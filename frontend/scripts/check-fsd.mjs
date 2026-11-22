/**
 * Проверка правил Feature-Sliced Design:  npm run check:fsd
 *  1. слой импортирует только слои НИЖЕ себя (app > pages > widgets > features > entities > shared);
 *  2. слайсы одного слоя не импортируют друг друга (для pages/widgets/features/entities);
 *  3. в чужой слайс/сегмент можно заходить только через его публичный API (index.ts), без «глубоких» путей;
 *  4. относительные импорты не должны выходить за пределы собственного слайса.
 * Завершается с кодом 1 и списком нарушений, если правила нарушены.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'

const SRC = resolve('src')
const LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared'] // сверху вниз
const SLICED = new Set(['pages', 'widgets', 'features', 'entities']) // слои со слайсами

const files = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) {
      if (name !== '__acceptance__') walk(p)
    } else if (/\.(ts|tsx)$/.test(name)) files.push(p)
  }
})(SRC)

const IMPORT_RE = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g

const violations = []

for (const file of files) {
  const rel = relative(SRC, file).split(sep)
  const [layer, slice] = rel
  if (!LAYERS.includes(layer)) continue // main.tsx, vite-env.d.ts
  const text = readFileSync(file, 'utf8')

  for (const m of text.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2]
    const where = `${relative(process.cwd(), file)}: '${spec}'`

    if (spec.startsWith('.')) {
      // относительный импорт: не должен покидать свой слайс (в shared/app — свой слой)
      const target = relative(SRC, resolve(dirname(file), spec)).split(sep)
      const own = SLICED.has(layer) ? [layer, slice] : [layer]
      if (!own.every((part, i) => target[i] === part)) violations.push(`${where} — относительный импорт выходит за пределы слайса`)
      continue
    }
    if (!spec.startsWith('@/')) continue // внешние пакеты

    const [tLayer, tSlice, ...deeper] = spec.slice(2).split('/')
    if (!LAYERS.includes(tLayer)) continue

    // 1. направление зависимостей
    if (LAYERS.indexOf(tLayer) < LAYERS.indexOf(layer)) violations.push(`${where} — слой «${layer}» не может импортировать вышестоящий слой «${tLayer}»`)
    // 2. слайсы одного слоя изолированы
    if (tLayer === layer && SLICED.has(layer) && tSlice !== slice) violations.push(`${where} — слайс «${slice}» не может импортировать соседний слайс «${tSlice}» (слой ${layer})`)
    // 3. только публичный API
    const sameSlice = tLayer === layer && (!SLICED.has(layer) || tSlice === slice)
    if (!sameSlice && deeper.length > 0) violations.push(`${where} — импортируйте через публичный API (index.ts), а не вглубь «${spec}»`)
  }
}

if (violations.length) {
  console.error(`Нарушения FSD (${violations.length}):\n` + violations.map((v) => ' • ' + v).join('\n'))
  process.exit(1)
}
console.log(`FSD: нарушений нет (проверено файлов: ${files.length})`)

# inet-shop-front

Фронтенд интернет-магазина (аналог Ozon): React 19 + Vite 8 + Apollo Client 4 + Material UI, архитектура Feature-Sliced Design. Все файлы проекта лежат в корне репозитория (`src/`, `nginx/`, `scripts/`, `Dockerfile`).

## Запуск всего стека одной командой (Docker)

`docker-compose.yml` находится в соседнем репозитории бэкенда (`../inet-shop-back`) и собирает фронтенд из этого репозитория (`context: ../inet-shop-front`):

```bash
cd ../inet-shop-back
docker compose up --build
```

- Магазин: http://localhost:8080
- GraphQL (GraphiQL): http://localhost:3000/graphql
- Демо-аккаунт: `demo@example.com` / `Demo12345!`

Отдельно frontend-образ собирается из корня этого репозитория:

```bash
docker build -t marketplace-frontend .
```

## Режим разработки

Нужен запущенный бэкенд на `http://localhost:3000` (Vite проксирует `/graphql`):

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Проверки

```bash
npm run typecheck
npm run lint
npm run check:fsd
npm run build
npm run test:acceptance   # 12 сценариев, нужен бэкенд со свежей БД + seed
```

Адрес бэкенда для приёмочного теста можно переопределить переменной `API_URL`.
Тест изменяет данные, поэтому перед повторным прогоном бэкендную БД нужно сбросить.

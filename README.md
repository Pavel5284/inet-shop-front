# inet-shop-front

Фронтенд интернет-магазина (аналог Ozon): React 19 + Vite 8 + Apollo Client 4, архитектура Feature-Sliced Design. Код лежит в `frontend/`.

## Запуск всего стека одной командой (Docker)

`docker-compose.yml` живёт в соседнем репозитории бэкенда (`../inet-shop-back`) и ожидает там папку `./frontend`. Если её нет — создайте ссылку на этот репозиторий:

```powershell
# Windows (PowerShell), из корня inet-shop-front:
New-Item -ItemType Junction -Path ..\inet-shop-back\frontend -Target .\frontend
```

```bash
# macOS / Linux:
ln -s ../inet-shop-front/frontend ../inet-shop-back/frontend
```

Затем:

```bash
cd ../inet-shop-back
docker compose up --build
```

- Магазин: http://localhost:8080
- GraphQL (GraphiQL): http://localhost:3000/graphql
- Демо-аккаунт: `demo@example.com` / `Demo12345!`

## Режим разработки

Нужен запущенный бэкенд на `http://localhost:3000` (Vite проксирует `/graphql`):

```bash
cd frontend
npm ci
npm run dev        # http://localhost:5173
```

## Проверки

```bash
cd frontend
npm run typecheck
npm run lint
npm run check:fsd
npm run build
npm run test:acceptance   # 12 сценариев, нужен бэкенд со свежей БД + seed
```

Адрес бэкенда для приёмочного теста можно переопределить переменной `API_URL`.
Тест изменяет данные, поэтому перед повторным прогоном бэкендную БД нужно сбросить.

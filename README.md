# Level Hub Web Prototype

Репозиторий переведен в web-формат с backend API и клиентским интерфейсом.

## Структура
- `index.html` — каркас экранов (главное меню, аккаунт, уровни, другое, редактор, мультиплеер-лента).
- `styles.css` — базовые стили интерфейса.
- `client.js` — навигация по экранам, авторизация, публикация/загрузка уровней.
- `server.js` — HTTP-сервер и API авторизации/уровней.
- `legacy/roblox/` — архив Roblox-скриптов из прошлой версии проекта.

## Запуск
```bash
node server.js
```

Открой `http://localhost:3000`.

## API
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/levels` (требует `Authorization: Bearer <token>`)
- `GET /api/levels`
- `GET /api/levels/:id`

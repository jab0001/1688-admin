# Local development

1. Setup correct NodeJS version

```bash
nvm use 18
```

2. Install dependencies 

```bash
npm i
```

3. Create .env file 

```bash
cp .env.example .env
```

4. And fill required values in `.env`. For example:
APP_ENV=local
APP_BASE_URL=localhost
APP_DEV_PORT=5000
APP_API_BASE_URL=https://flg-api-dev.toruza.com/api
STATIC_FILES_HOST=https://flg-api-dev.toruza.com
APP_API_KEY=
APP_IS_DEMO=


# Deploy with Docker Compose

1. Create .env file 
```bash
cp .env.example .env
```

2. Run Docker Compose
```bash
docker compose up --build -d
```

3. Bind reverse proxy in any way to local port 5173

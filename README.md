# NovaSMS web frontend

React and Vite dashboard for NovaSMS.

## VPS development environment

Start the hot-reload web server:

```bash
docker compose -f compose.dev.yml up -d --build
```

The web app listens only on `http://127.0.0.1:5173` and expects the NovaSMS
development API at `http://localhost:4010` in the browser.

Open both services from a workstation with one SSH tunnel:

```bash
ssh \
  -L 5173:127.0.0.1:5173 \
  -L 4010:127.0.0.1:4010 \
  ubuntu@YOUR_VPS
```

Then open `http://localhost:5173`.

Useful commands:

```bash
docker compose -f compose.dev.yml ps
docker compose -f compose.dev.yml logs -f web
docker compose -f compose.dev.yml down
```

Run the production build check inside the development container:

```bash
docker compose -f compose.dev.yml exec web npm run build
```

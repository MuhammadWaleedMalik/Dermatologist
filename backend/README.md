# Dr Salman Skin & Hair Clinic — Backend API

Express 5 + MongoDB Atlas (Mongoose 9) REST API powering the clinic website's
blog, reviews, treatments, before/after gallery and admin panel.

- Works locally as a long-running server (`npm run dev`).
- Deploys to Vercel as a single serverless function with zero extra scaffolding
  (Vercel detects `app.js`, which exports the Express app).

---

## 1. Run locally

```bash
# from the repository root
docker compose up -d

cd backend
npm install
cp .env.example .env      # then fill in MONGODB_URI and JWT_SECRET
npm run seed              # creates the first admin from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev               # http://localhost:5000
```

Check it is alive:

```bash
curl http://localhost:5000/api/health
```

`npm run dev` uses Node's built-in file watcher. `npm start` runs the same server
without auto-reload.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local server with auto-reload |
| `npm start` | Local/production-style server |
| `npm run seed` | Create the bootstrap admin if missing |
| `npm run seed:fresh` | Recreate the bootstrap admin (deletes the old one) |

---

## 2. Database options

For local development, the repository's `compose.yaml` starts MongoDB 8 on
`127.0.0.1:27017`. The connection string in `.env.example` matches that local
container, so no Atlas account is required.

For a hosted production database, configure MongoDB Atlas:

1. Create a free **M0** cluster at <https://cloud.mongodb.com>.
2. **Database Access → Add New Database User**: create a user and a strong
   password. If the password contains `@ : / ? # [ ] % & +` etc. it **must be
   URL-encoded** in the connection string.
3. **Network Access → Add IP Address**:
   - For local development, add your current public IP (curl `https://api.ipify.org`).
   - Serverless platforms (Vercel) use dynamic IPs. For a student project the
     simple option is `0.0.0.0/0` (allow from anywhere). Tighten this later with
     [Vercel Secure Compute](https://vercel.com/docs/security/secure-compute) if
     you have a static egress IP.
4. **Connect → Drivers → Node.js**: copy the connection string.
5. Put it in `backend/.env` as `MONGODB_URI`. You can include the database name
   in the path or set `MONGODB_DB_NAME` (defaults to `Derma-App`).

### Common connection errors

| Error | Cause | Fix |
| --- | --- | --- |
| `Could not connect to any servers ... IP whitelist` | Your IP is not allowed | Add your current IP (or `0.0.0.0/0`) in Atlas **Network Access** |
| `bad auth : authentication failed` | Wrong username/password | Recheck the database user; URL-encode special characters in the password |
| `querySrv ENOTFOUND` | Bad cluster hostname / DNS | Re-copy the connection string from Atlas |
| `MongooseServerSelectionError` on Vercel | Vercel IPs not allowlisted | Allow `0.0.0.0/0`, or use Secure Compute |

> Vercel functions have dynamic outbound IPs, so for a student project using
> `0.0.0.0/0` is the pragmatic choice. This does **not** expose your database —
> the database user/password are still required to connect.

---

## 3. Environment variables

Copy `backend/.env.example` to `backend/.env` for local development. In Vercel,
add the same keys under **Project → Settings → Environment Variables**.

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | yes | Atlas connection string |
| `MONGODB_DB_NAME` | no | Defaults to `Derma-App` |
| `JWT_SECRET` | yes | Long random string for signing admin tokens |
| `JWT_EXPIRES_IN` | no | Default `7d` |
| `PORT` | no | Local only (default `5000`) |
| `CLIENT_URL` | yes in prod | Comma-separated allowed CORS origins |
| `FRONTEND_URL` | optional | Alias for `CLIENT_URL` (both are merged) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | for `seed` | Bootstrap admin only |
| `GRIDFS_BUCKET` | no | GridFS bucket name; defaults to `images` |
| `MAX_UPLOAD_MB` | no | Default 3 |

Generate a strong secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Never commit `backend/.env` (it is git-ignored).

---

## 4. Deploy to Vercel

1. Push the repository to GitHub/GitLab.
2. In Vercel, **Add New Project** and import the repository.
3. Set **Root Directory** to `backend`.
4. Framework preset: **Other** (Vercel still auto-detects the Express entry
   `app.js`). Leave Build/Output commands empty.
5. Add the environment variables from the table above (at minimum `MONGODB_URI`,
   `JWT_SECRET`, `CLIENT_URL`).
6. **Deploy**.
7. Run the seed once against the deployed database — either locally with the
   production `MONGODB_URI` (`npm run seed`), or add the admin directly in Atlas.

No `vercel.json` is required: Vercel's zero-configuration Express support turns
`app.js` (which exports the app via `export default app`) into a single
serverless function and routes every request to it. `server.js` is only used for
local/long-running hosting and is not started on Vercel.

### Test the deployed API

```bash
curl https://<your-backend>.vercel.app/api/health
# {"success":true,"data":{"status":"ok","database":"connected",...}}
```

If `database` is `disconnected`, re-check the Atlas allowlist and `MONGODB_URI`.

---

## 5. Image storage with MongoDB GridFS

The frontend uploaders send a base64 data URL to the API. The backend decodes
the file and stores its binary data in MongoDB GridFS, using the `images.files`
and `images.chunks` collections by default. The blog/review/treatment/gallery
document stores only a small `/uploads/<ObjectId>` reference.

`GET /uploads/:id` streams the image from GridFS with its original content type
and long-lived immutable cache headers. Replacing an image or deleting its
content record also removes the old GridFS file, preventing orphaned blobs.

Use `GRIDFS_BUCKET` to change the bucket name. Keep `MAX_UPLOAD_MB` at **3** or
lower when deploying to a platform with a small request-body limit because
base64 adds roughly 33% overhead.

Legacy local files can be migrated once with:

```bash
npm run migrate:images
```

The migration updates database references only after each GridFS upload
succeeds, then removes the corresponding legacy file from `backend/uploads`.

---

## 6. Connect the frontend

The frontend reads its API base URL from `VITE_API_BASE_URL`
(`frontend/src/services/api.js`).

Local development (`frontend/.env`):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Production (frontend hosting environment, e.g. Vercel frontend project):

```
VITE_API_BASE_URL=https://<your-backend>.vercel.app/api
```

Also set the backend `CLIENT_URL` to the deployed frontend origin(s),
comma-separated, so CORS allows the browser requests:

```
CLIENT_URL=http://localhost:5173,https://<your-frontend>.vercel.app
```

The frontend must be rebuilt/redeployed after changing `VITE_*` variables,
because Vite inlines them at build time.

---

## 7. API overview

Base path: `/api`

| Area | Public | Admin (JWT required) |
| --- | --- | --- |
| Health | `GET /health` | — |
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | — |
| Blogs | `GET /blogs`, `GET /blogs/:slug` | `/admin/blogs` CRUD + `PATCH /admin/blogs/:id/publish` |
| Reviews | `GET /reviews`, `POST /reviews` | `/admin/reviews` CRUD + approve/hide |
| Treatments | `GET /treatments`, `GET /treatments/featured`, `GET /treatments/:id`, `GET /treatment-categories` | `/admin/treatments` CRUD + publish |
| Before/After | `GET /before-after`, `GET /before-after/categories`, `GET /before-after/:id` | `/admin/before-after` CRUD + publish |
| Dashboard | — | `GET /admin/stats` |

Admin routes require `Authorization: Bearer <jwt>` and the `admin`/`editor` role.

All responses use the shape `{ success: true, data }` or
`{ success: false, message, errors? }`.

---

## 8. Notes for Vercel operations

- **Rate limiting** (`express-rate-limit`) uses per-instance memory on Vercel, so
  limits apply per warm function instance rather than globally. This is
  acceptable for a clinic site; a shared store (e.g. Upstash Redis) would be the
  next step if needed.
- **Database connections** are cached per function instance to avoid exhausting
  Atlas connections.
- Uploaded images do not depend on the server filesystem; `/uploads/:id`
  streams them directly from MongoDB GridFS.
- **Health endpoint** always responds and reports `database: connected|disconnected`.

# Eventora - Next.js Client

This is the React/Vite client converted to Next.js App Router while keeping the existing Express/MongoDB backend unchanged.

## Run

1. Copy `.env.local.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` if your backend uses that URL.
3. Install dependencies:

```bash
npm install
```

4. Start the backend in the original `server` folder.
5. Start this client:

```bash
npm run dev
```

## Routes

- `/`
- `/events/:id`
- `/login`
- `/register`
- `/dashboard`
- `/admin`
- `/payment-success`
- `/payment-failed`

## Main conversion changes

- React Router routes were replaced with the Next.js `app/` folder.
- `Link` comes from `next/link` and uses `href`.
- `useNavigate()` became `useRouter()` + `router.push()`.
- `useParams()` comes from `next/navigation`.
- `AuthProvider` remains a client component because it uses state, effects, and localStorage.
- Axios still talks to the same Express backend.

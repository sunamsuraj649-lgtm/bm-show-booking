# Backend (Express + MySQL)

1. Copy `.env.example` to `.env` and set your MySQL credentials and DB name.
2. From the `backend` folder run:

```bash
npm install
npm run start
```

The server exposes:
- `GET /api/shows` — list of shows
- `POST /api/bookings` — create a booking { show_id, name, seats }

It will auto-create `users`, `shows` and `bookings` tables and seed two shows if the `shows` table is empty.

Auth endpoints:
- `POST /api/register` — { email, password, name } returns `{ token }`
- `POST /api/login` — { email, password } returns `{ token }`

Protected endpoints (require `Authorization: Bearer <token>`):
- `POST /api/bookings` — create a booking (saves `user_id`)
- `GET /api/mybookings` — list bookings for the current user

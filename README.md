## Installation Tutorial

Follow these steps to set up and run the project:

### 1. Install dependencies

```bash
bun install
```

### 2. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` as needed for your local setup.

### 3. Run Prisma migrations and generate client

```bash
bunx prisma migrate deploy
bunx prisma generate
```

### 4. Seed Database (Opsional)

Untuk mengisi data awal ke database:

```bash
bunx prisma db seed
```

Jika ingin menjalankan seeder dengan mode tertentu:

```bash
bun run prisma/seed.ts
```

### 5. Start the development server

```bash
bun dev
```

**Default Login (dari seeder):**

- Email: `admin@email.com`
- Password: `12345`

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

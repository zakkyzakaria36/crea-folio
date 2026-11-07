# ZxProject — Platform Portofolio & Komisi Jasa Kreatif

Platform *full-stack decoupled* modern untuk kreator yang mencakup **Ilustrasi Digital**, **Editing Video & Motion**, serta **Visualisasi Data & Dashboard Interaktif**.

---

## 🛠 Tech Stack

- **Backend:** Node.js + Hono Framework
- **Database & ORM:** MySQL 8 (Docker Container) + Drizzle ORM
- **Frontend:** React + Vite + Tailwind CSS v4 + Recharts + Lucide Icons
- **Storage:** Local static uploads (`/uploads/`) dengan penanganan multipart file
- **Auth:** JWT Token & Enkripsi Kata Sandi Bcrypt

---

## 🚀 Panduan Menjalankan

### 1. Nyalakan Database MySQL (Docker)
```bash
docker compose up -d
```
> Berjalan di port `3307` (container: `creafolio_mysql`).

### 2. Jalankan Backend API
```bash
npm run backend
```
> Server API aktif di: `http://localhost:5001`

### 3. Jalankan Frontend Web
Buka terminal baru:
```bash
npm run frontend
```
> Web aplikasi aktif di: `http://localhost:3000`

---

## 🔑 Panel Admin & Keamanan
- Buka web `http://localhost:3000` lalu klik tombol **Admin** di pojok kanan atas.
- Akun default awal: `admin` / `admin123`
- Kata sandi dapat diubah langsung dari tab **"Ubah Password"** di dalam dashboard admin.
- Reset darurat via terminal:
  ```bash
  cd backend
  npx tsx src/resetPassword.ts SandiBaruAnda
  ```

# CreaFolio — Multidisciplinary Portfolio & Commission Platform

Full-stack decoupled platform designed for creators specializing in **Digital Illustration**, **Video & Motion Production**, and **Interactive Data Visualization / Dashboards**.

---

## 🛠 Tech Stack

- **Backend:** Node.js + Hono (Lightweight & high performance)
- **Database & ORM:** MySQL 8 (Docker Container) + Drizzle ORM
- **Frontend:** React 19 + Vite + Tailwind CSS v4 + Recharts + Lucide Icons
- **Storage:** Local static uploads (`/uploads/`) with multipart handling

---

## 🚀 Quick Start Guide

### 1. Jalankan Database (MySQL via Docker)
```bash
docker compose up -d
```
> MySQL berjalan pada port `3307` (container name: `creafolio_mysql`).

### 2. Jalankan Backend API
```bash
npm run backend
```
> Server API aktif di: `http://localhost:5000`

### 3. Jalankan Frontend UI
Buka terminal baru:
```bash
npm run frontend
```
> Antarmuka web aktif di: `http://localhost:3000`

---

## 🔑 Akun Default Admin
- **Username:** `admin`
- **Password:** `admin123`
*(Tombol Admin berada di pojok kanan atas Navbar)*

---

## 📡 Ringkasan API Endpoints

### Public:
- `GET /api/portfolios` — Ambil semua item portfolio (filter `?category=illustration|video|dataviz`).
- `GET /api/portfolios/:idOrSlug` — Ambil detail satu item portfolio.
- `POST /api/orders` — Submit pesanan komisi (menghasilkan kode resi unik `CF-YYYYMMDD-XXXX`).
- `GET /api/orders/track/:code` — Cek status progres pesanan secara real-time.
- `POST /api/upload` — Upload file attachment (PDF/PNG/Video).

### Admin (Header: `Authorization: Bearer <token>`):
- `POST /api/auth/login` — Login admin.
- `POST /api/portfolios` — Tambah portfolio baru.
- `PUT /api/portfolios/:id` — Update portfolio.
- `DELETE /api/portfolios/:id` — Hapus portfolio.
- `GET /api/orders` — Lihat daftar semua pesanan klien.
- `PATCH /api/orders/:id` — Update status order (`pending`, `reviewed`, `in_progress`, `completed`, `rejected`) & catatan.

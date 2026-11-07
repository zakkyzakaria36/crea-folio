import bcrypt from 'bcryptjs';
import { db, poolConnection } from './db/index.js';
import { users } from './db/schema.js';
import { eq } from 'drizzle-orm';

const newPassword = process.argv[2];

if (!newPassword) {
  console.log('Penggunaan: npx tsx src/resetPassword.ts <password_baru>');
  console.log('Contoh: npx tsx src/resetPassword.ts RahasiaKu2026!');
  process.exit(1);
}

async function run() {
  const hash = await bcrypt.hash(newPassword, 10);
  const result = await db.update(users).set({ passwordHash: hash }).where(eq(users.username, 'admin'));
  console.log(`Password admin berhasil diubah menjadi: "${newPassword}"`);
  await poolConnection.end();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

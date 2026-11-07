// Creates (or promotes) an admin user. Run LOCALLY with the service-role key; never ship that key to the browser.
//   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... node scripts/create-admin.mjs you@company.com 'StrongPassword'
import { createClient } from "@supabase/supabase-js";
const [email, password, role = "admin"] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!email || !password || !url || !key) { console.error("Usage: node scripts/create-admin.mjs <email> <password> [admin|editor]\nRequires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment."); process.exit(1); }
if (password.length < 10) { console.error("Use a password of at least 10 characters."); process.exit(1); }
const db = createClient(url, key, { auth: { persistSession: false } });
let userId;
const { data: created, error } = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  if (!/already|registered/i.test(error.message)) { console.error(error.message); process.exit(1); }
  const { data: list } = await db.auth.admin.listUsers({ perPage: 1000 });
  userId = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) { console.error("User exists but could not be found."); process.exit(1); }
  await db.auth.admin.updateUserById(userId, { password });
} else userId = created.user.id;
const { error: pe } = await db.from("profiles").upsert({ id: userId, email, role }, { onConflict: "id" });
if (pe) { console.error(pe.message); process.exit(1); }
console.log(`✔ ${role} ready: ${email}`);

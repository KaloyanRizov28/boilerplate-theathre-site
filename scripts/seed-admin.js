import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

async function makeAdmin(email) {
  const { data, error } = await supabase.auth.admin.updateUserByEmail(email, {
    user_metadata: { is_admin: true },
  });
  if (error) {
    console.error(error);
  } else {
    console.log(`Updated ${email} as admin`);
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/seed-admin.js email@example.com');
  process.exit(1);
}

makeAdmin(email);

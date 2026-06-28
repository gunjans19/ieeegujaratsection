const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.+)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim();
const supabase = createClient(url, key);

const email = 'admin@ieeegujarat.org';
const password = 'AdminPassword123!';

(async () => {
  console.log(`Registering auth account for ${email}...`);
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error('Error during signup:', error.message);
    return;
  }
  const userId = data.user?.id;
  console.log('\n======================================================');
  console.log('1. AUTH USER CREATED SUCCESSFULLY!');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`User ID: ${userId}`);
  console.log('======================================================');
  console.log('\n2. ACTIVATE ADMIN ROLE:');
  console.log('Copy and paste the SQL query below into the Supabase SQL Editor and run it:');
  console.log('------------------------------------------------------');
  console.log(`INSERT INTO admin_users (id, email, role)
VALUES ('${userId}', '${email}', 'super_admin');`);
  console.log('------------------------------------------------------\n');
})();

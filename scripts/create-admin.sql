// Script to create first admin user
// Run this after setting up your admin account in Supabase Auth

// Step 1: Create admin account in Supabase Auth (manually via Supabase dashboard)
// Go to Authentication > Users > Add User
// Email: admin@ieeegujarat.org
// Password: [your-secure-password]

// Step 2: Get the user ID from Supabase dashboard
// Go to Authentication > Users, copy the user ID

// Step 3: Run this SQL in Supabase SQL Editor
/*
INSERT INTO admin_users (id, email, role)
VALUES (
  'USER_ID_FROM_STEP_2',  -- Replace with actual user ID
  'admin@ieeegujarat.org',
  'super_admin'
);
*/

// Alternative: Use Supabase Edge Function to auto-create admin on first signup
// This would require additional setup

console.log('Admin creation steps documented above');

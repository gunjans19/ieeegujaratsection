/*
  # Create Admin Portal Tables

  1. New Tables
    - `site_content`
      - `id` (uuid, primary key)
      - `section` (text) - e.g., 'links', 'announcements', 'home'
      - `key` (text) - unique key for the content
      - `content` (jsonb) - flexible JSON content
      - `updated_at` (timestamp)
      - `updated_by` (uuid, references auth.users)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (text)
      - `time` (text)
      - `location` (text)
      - `category` (text)
      - `status` (text) - 'upcoming', 'ongoing', 'past'
      - `registration_link` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `role` (text) - 'super_admin', 'admin', 'editor'
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Only authenticated admin users can access
    - Super admin can manage other admins
*/

-- Site Content Table (links, announcements, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date text,
  time text,
  location text,
  category text DEFAULT 'Event',
  status text DEFAULT 'upcoming',
  registration_link text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text DEFAULT 'editor',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Insert default content
INSERT INTO site_content (section, key, content) VALUES
  ('links', 'linkedin', '{"label": "LinkedIn", "description": "Connect with us professionally", "url": "https://www.linkedin.com/company/ieee-gujarat-section/", "icon": "Linkedin"}'),
  ('links', 'whatsapp', '{"label": "WhatsApp Community", "description": "Join our active discussion group", "url": "https://chat.whatsapp.com/", "icon": "MessageCircle"}'),
  ('links', 'website', '{"label": "Official Website", "description": "Explore IEEE Gujarat Section", "url": "https://ieeegujaratsection.org/", "icon": "Globe"}'),
  ('links', 'membership', '{"label": "Membership Portal", "description": "Join or renew IEEE membership", "url": "https://www.ieee.org/", "icon": "Network"}'),
  ('links', 'events', '{"label": "Upcoming Events", "description": "Conferences, workshops & more", "url": "/events", "icon": "Calendar"}')
ON CONFLICT (key) DO NOTHING;

-- Insert sample events
INSERT INTO events (title, description, date, time, location, category, status, registration_link) VALUES
  ('IEEE INDICON 2025', 'Premier international conference on industrial technology', 'Dec 12-14, 2025', '9:00 AM - 6:00 PM IST', 'Ahmedabad, Gujarat', 'Conference', 'upcoming', '#'),
  ('AI/ML Workshop', 'Hands-on workshop on machine learning and LLMs', 'Jun 8, 2025', '10:00 AM - 5:00 PM IST', 'IIT Gandhinagar', 'Workshop', 'upcoming', '#')
ON CONFLICT DO NOTHING;

-- RLS Policies for site_content
CREATE POLICY "Admins can manage site content"
  ON site_content FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Public can view site content"
  ON site_content FOR SELECT
  TO public
  USING (true);

-- RLS Policies for events
CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Public can view events"
  ON events FOR SELECT
  TO public
  USING (true);

-- RLS Policies for admin_users
CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid() AND admin_users.role = 'super_admin')
  );

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.id = auth.uid())
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
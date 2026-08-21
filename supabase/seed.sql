-- VeriFlow Initial Seed SQL for schema testing
-- Note: Actual users and cases should be generated via the UI or Supabase Auth API in live testing.

INSERT INTO cases (id, title, description, category, location_text, latitude, longitude, status, created_by)
SELECT
  'c1111111-1111-1111-1111-111111111111'::uuid,
  'Severe Pothole on Main St & 5th Ave',
  'Deep pothole causing vehicle damage and traffic hazard near pedestrian crossing.',
  'POTHOLE',
  'Main St & 5th Ave Intersection, City Center',
  37.774929,
  -122.419416,
  'OPEN',
  id
FROM profiles LIMIT 1;

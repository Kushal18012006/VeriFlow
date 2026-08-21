-- VeriFlow Database Initial Migration Schema
-- Civic Issue Real-World Claim Verification Engine Platform

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('CITIZEN', 'AUTHORITY');

CREATE TYPE case_status AS ENUM (
  'OPEN',
  'UNDER_REVIEW',
  'CLAIMED_RESOLVED',
  'VERIFYING',
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'REJECTED',
  'INSUFFICIENT_EVIDENCE',
  'HUMAN_REVIEW'
);

CREATE TYPE evidence_type AS ENUM (
  'ORIGINAL_REPORT',
  'RESOLUTION_PROOF'
);

CREATE TYPE verification_run_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

CREATE TYPE verification_decision AS ENUM (
  'VERIFIED',
  'PARTIALLY_VERIFIED',
  'REJECTED',
  'INSUFFICIENT_EVIDENCE',
  'HUMAN_REVIEW'
);

CREATE TYPE finding_status AS ENUM (
  'PASSED',
  'FAILED',
  'WARNING',
  'INCONCLUSIVE'
);

CREATE TYPE finding_category AS ENUM (
  'EVIDENCE_QUALITY',
  'METADATA',
  'SPATIAL',
  'VISUAL_DELTA',
  'TIMELINE'
);

-- 2. Profiles Table (Extends Supabase Auth users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'CITIZEN',
  full_name TEXT NOT NULL,
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Cases Table
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'POTHOLE',
  location_text TEXT NOT NULL,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  status case_status NOT NULL DEFAULT 'OPEN',
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  assigned_authority_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Evidence Table
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  type evidence_type NOT NULL,
  file_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INT NOT NULL,
  width INT,
  height INT,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Verification Runs Table
CREATE TABLE verification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  status verification_run_status NOT NULL DEFAULT 'PENDING',
  overall_decision verification_decision,
  overall_confidence NUMERIC(5, 4), -- Evidence-support confidence score [0.0000 - 1.0000]
  summary TEXT,
  recommended_next_action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 6. Verification Findings Table
CREATE TABLE verification_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES verification_runs(id) ON DELETE CASCADE,
  category finding_category NOT NULL,
  check_name TEXT NOT NULL,
  status finding_status NOT NULL,
  confidence NUMERIC(5, 4),
  explanation TEXT NOT NULL,
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  previous_state TEXT,
  new_state TEXT,
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Indexes for Query Performance
CREATE INDEX idx_cases_created_by ON cases(created_by);
CREATE INDEX idx_cases_assigned_authority ON cases(assigned_authority_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_type ON evidence(type);
CREATE INDEX idx_verification_runs_case_id ON verification_runs(case_id);
CREATE INDEX idx_verification_findings_run_id ON verification_findings(run_id);
CREATE INDEX idx_audit_logs_case_id ON audit_logs(case_id);

-- 9. Auto Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, department)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'VeriFlow User'),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'CITIZEN'::user_role),
    new.raw_user_meta_data->>'department'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Auto Updated_at Trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cases_updated_at BEFORE UPDATE ON cases FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 11. Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles read policy (authenticated users can view profiles)
CREATE POLICY "Public profiles viewable by authenticated users" ON profiles
  FOR SELECT TO authenticated USING (true);

-- Profiles update self policy
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Cases: Viewable by all authenticated users
CREATE POLICY "Cases viewable by authenticated users" ON cases
  FOR SELECT TO authenticated USING (true);

-- Cases: Citizens can create cases
CREATE POLICY "Citizens can insert cases" ON cases
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- Cases: Authorities or creators can update cases
CREATE POLICY "Authority or creator can update cases" ON cases
  FOR UPDATE TO authenticated USING (
    auth.uid() = created_by OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'AUTHORITY')
  );

-- Evidence: Viewable by authenticated users
CREATE POLICY "Evidence viewable by authenticated users" ON evidence
  FOR SELECT TO authenticated USING (true);

-- Evidence: Authenticated users can upload evidence for open/resolving cases
CREATE POLICY "Users can insert evidence" ON evidence
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

-- Verification Runs & Findings: Viewable by authenticated users
CREATE POLICY "Runs viewable by authenticated users" ON verification_runs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Findings viewable by authenticated users" ON verification_findings
  FOR SELECT TO authenticated USING (true);

-- Audit Logs: Viewable by authenticated users
CREATE POLICY "Audit logs viewable by authenticated users" ON audit_logs
  FOR SELECT TO authenticated USING (true);

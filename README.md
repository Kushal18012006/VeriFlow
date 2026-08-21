# VeriFlow: AI-Powered Real-World Claim Verification Platform

> **Civic Issue Resolution Verification Platform Scaffold & Foundation**

VeriFlow is an AI-powered real-world claim verification platform built to validate physical state claims (starting with civic issue resolution like pothole repairs, broken streetlights, or storm drain clearing) against citizen issue reports.

---

## 🏛️ Core Product Innovation

VeriFlow is **not** a generic chatbot and **not** just an image classifier. It operates on a strict verification chain:

```
CLAIM → EVIDENCE → VERIFICATION → CONFIDENCE → DECISION → ACTION → AUDIT TRAIL
```

1. **CLAIM**: Citizen reports a civic issue or Authority claims resolution.
2. **EVIDENCE**: EXIF-embedded multi-angle photo proof and metadata.
3. **VERIFICATION**: Multi-stage validation (Evidence Quality Pre-Check → Deterministic Rule Engine → AI Vision Boundaries).
4. **CONFIDENCE**: Evidence-support confidence score (rating evidence completeness, not a calibrated statistical probability).
5. **DECISION**: `VERIFIED`, `PARTIALLY_VERIFIED`, `REJECTED`, `INSUFFICIENT_EVIDENCE`, or `HUMAN_REVIEW`.
6. **ACTION**: Recommended next step for citizen/authority reviewer.
7. **AUDIT TRAIL**: Immutable state transition timeline and check findings.

---

## 🏗️ Architecture & Module Structure

```
Veriflow/
├── supabase/
│   ├── migrations/
│   │   └── 20260820000000_init_veriflow.sql   # Complete PostgreSQL DDL, RLS, Indexes, Triggers
│   └── seed.sql                              # Seed data structure
├── src/
│   ├── app/                                  # Next.js 14 App Router Routes
│   │   ├── page.tsx                          # Platform landing page & pipeline demo
│   │   ├── login/page.tsx                    # Sign-in UI with role toggle
│   │   ├── register/page.tsx                 # Account registration UI
│   │   ├── dashboard/page.tsx                # Smart role router
│   │   ├── citizen/
│   │   │   ├── cases/page.tsx                # Citizen dashboard & reported cases list
│   │   │   └── cases/new/page.tsx            # Issue report submission form
│   │   ├── authority/
│   │   │   └── cases/page.tsx                # Authority review queue & claim verification modal
│   │   ├── cases/
│   │   │   └── [id]/page.tsx                 # Case detail, Side-by-Side Evidence, Why Decided, Audit
│   │   ├── layout.tsx                        # App shell layout
│   │   └── globals.css                       # Dark navy/purple Tailwind styling
│   ├── components/                           # UI Components
│   │   ├── navigation/Navbar.tsx             # Navbar with role switch & navigation
│   │   ├── ui/StatusBadge.tsx                # Status badge primitives
│   │   ├── ui/FindingBadge.tsx               # Finding check status indicators
│   │   └── cases/
│   │       ├── CaseCard.tsx                  # Case preview card
│   │       ├── EvidenceInspector.tsx         # Side-by-side evidence comparator
│   │       ├── DecisionWhySection.tsx        # Dedicated "Why did VeriFlow decide this?" component
│   │       └── AuditTimeline.tsx             # Immutable chain of custody timeline
│   ├── lib/                                  # Modular Architectural Boundaries
│   │   ├── domain/types.ts                   # Domain entities (Case, Evidence, VerificationRun, Finding, AuditLog)
│   │   ├── ai/contracts.ts                   # AI vision, spatial-temporal & synthesis service interfaces
│   │   ├── verification/
│   │   │   ├── quality.ts                    # Evidence Quality Validation Layer
│   │   │   └── engine.ts                     # Deterministic Verification Engine & routing
│   │   ├── validation/schemas.ts             # Zod input validation schemas
│   │   ├── auth/                             # Supabase Auth client/server/session helpers
│   │   ├── db/cases.ts                       # Data access layer
│   │   └── storage/upload.ts                 # Evidence storage & metadata parser
```

---

## ⚡ Key Architectural Features

### 1. Evidence Quality Validation Layer (`src/lib/verification/quality.ts`)
Validates file format, resolution adequacy, blur/quality thresholds, duplicate evidence, and coverage before routing to full verification.
Returns `INSUFFICIENT_EVIDENCE` status if quality checks fail, preventing false positive verification runs.

### 2. Human Review as First-Class Outcome (`src/lib/verification/engine.ts`)
Ambiguous cases (e.g. missing EXIF GPS metadata, timing anomalies) are explicitly routed to `HUMAN_REVIEW` in the authority queue rather than producing fake auto-approvals or rejections.

### 3. Dedicated "Why Did VeriFlow Decide This?" Section (`src/components/cases/DecisionWhySection.tsx`)
Displays:
- Verification decision status
- Evidence-support confidence score
- Individual check findings (`PASSED`, `FAILED`, `WARNING`, `INCONCLUSIVE`)
- Human-readable explanations
- Actionable next step recommendations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 24+
- npm 10+

### Setup & Run
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Type Check:
   ```bash
   npm run typecheck
   ```

4. Build Project:
   ```bash
   npm run build
   ```

5. Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🛡️ Database Migrations

Apply `supabase/migrations/20260820000000_init_veriflow.sql` using Supabase CLI or the Supabase SQL Editor:
```bash
supabase db push
```

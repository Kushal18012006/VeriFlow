import { UserProfile, UserRole } from '../domain/types';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  department?: string;
}

// Standard UUID format for demo users to comply with PostgreSQL UUID FK constraints
export const DEMO_CITIZEN_USER: CurrentUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'citizen@example.org',
  role: 'CITIZEN',
  full_name: 'Elena Rostova (Citizen)',
};

export const DEMO_AUTHORITY_USER: CurrentUser = {
  id: '22222222-2222-2222-2222-222222222222',
  email: 'reviewer@citygov.org',
  role: 'AUTHORITY',
  full_name: 'David Vance (Public Works Reviewer)',
  department: 'Department of Transportation',
};

export function getDemoUserByRole(role: UserRole): CurrentUser {
  return role === 'AUTHORITY' ? DEMO_AUTHORITY_USER : DEMO_CITIZEN_USER;
}

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
  id: 'd8c7ca8b-661c-4be8-9211-1770983f440a',
  email: 'citizen@example.org',
  role: 'CITIZEN',
  full_name: 'Elena Rostova (Citizen)',
};

export const DEMO_AUTHORITY_USER: CurrentUser = {
  id: '329dfd8f-d0c4-4e71-93e9-0a37f72d816b',
  email: 'reviewer@citygov.org',
  role: 'AUTHORITY',
  full_name: 'David Vance (Public Works Reviewer)',
  department: 'Department of Transportation',
};

export function getDemoUserByRole(role: UserRole): CurrentUser {
  return role === 'AUTHORITY' ? DEMO_AUTHORITY_USER : DEMO_CITIZEN_USER;
}

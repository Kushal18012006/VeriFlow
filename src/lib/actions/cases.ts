'use server';

import { redirect } from 'next/navigation';
import { createNewCase, submitResolutionClaim } from '@/lib/db/cases';
import { CreateCaseSchema, ClaimResolutionSchema } from '@/lib/validation/schemas';
import { DEMO_CITIZEN_USER, DEMO_AUTHORITY_USER } from '@/lib/auth/session';

export async function createCaseServerAction(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const location_text = formData.get('location_text') as string;
  const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : undefined;
  const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : undefined;
  const evidence_url = formData.get('evidence_url') as string;

  const validatedData = CreateCaseSchema.parse({
    title,
    description,
    category,
    location_text,
    latitude,
    longitude,
    evidence_url,
    evidence_mime_type: 'image/jpeg',
    evidence_size: 450000,
    evidence_width: 1920,
    evidence_height: 1080,
  });

  const createdCase = await createNewCase({
    ...validatedData,
    created_by: DEMO_CITIZEN_USER.id,
  });

  redirect(`/cases/${createdCase.id}`);
}

export async function submitClaimServerAction(formData: FormData) {
  const case_id = formData.get('case_id') as string;
  const resolution_notes = formData.get('resolution_notes') as string;
  const resolution_evidence_url = formData.get('resolution_evidence_url') as string;

  const validated = ClaimResolutionSchema.parse({
    case_id,
    resolution_notes,
    resolution_evidence_url,
    resolution_mime_type: 'image/jpeg',
    resolution_size: 520000,
  });

  const result = await submitResolutionClaim({
    ...validated,
    authority_id: DEMO_AUTHORITY_USER.id,
  });

  // Explicitly trigger the verification execution in the background 
  // via a detached webhook-style fetch to guarantee it starts immediately.
  // We use NEXT_PUBLIC_APP_URL to hit the full absolute API URL.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  fetch(`${appUrl}/api/cases/${result.caseItem.id}/verify`, { 
    method: 'POST' 
  }).catch(err => console.error('Failed to trigger background verification:', err));

  redirect(`/cases/${result.caseItem.id}`);
}

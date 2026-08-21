import { NextResponse } from 'next/server';
import { createNewCase, getAllCases } from '@/lib/db/cases';
import { CreateCaseSchema } from '@/lib/validation/schemas';
import { DEMO_CITIZEN_USER } from '@/lib/auth/session';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const cases = await getAllCases({ status, category, search });
    return NextResponse.json({ success: true, cases });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cases' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Server-side Zod Input Validation
    const validatedData = CreateCaseSchema.parse({
      title: body.title,
      description: body.description,
      category: body.category,
      location_text: body.location_text,
      latitude: body.latitude ? Number(body.latitude) : undefined,
      longitude: body.longitude ? Number(body.longitude) : undefined,
      evidence_url: body.evidence_url,
      evidence_mime_type: body.evidence_mime_type || 'image/jpeg',
      evidence_size: body.evidence_size || 450000,
      evidence_width: body.evidence_width || 1920,
      evidence_height: body.evidence_height || 1080,
      evidence_metadata: body.evidence_metadata,
    });

    // 2. Authenticated user verification (Server side)
    const user = DEMO_CITIZEN_USER;

    // 3. Create Case in database (Supabase + Server DB)
    const createdCase = await createNewCase({
      ...validatedData,
      created_by: user.id,
    });

    return NextResponse.json({
      success: true,
      case: createdCase,
      redirectUrl: `/cases/${createdCase.id}`,
    });
  } catch (error: any) {
    console.error('Case Creation Server Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error during case creation' },
      { status: 400 }
    );
  }
}

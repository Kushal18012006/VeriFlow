import { z } from 'zod';

export const CreateCaseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(120),
  description: z.string().min(15, 'Description must be at least 15 characters long'),
  category: z.enum(['POTHOLE', 'TRAFFIC_SIGNAL', 'DRAINAGE', 'STREETLIGHT', 'ILLEGAL_DUMPING', 'OTHER']),
  location_text: z.string().min(3, 'Location description is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  evidence_url: z.string().url('A valid evidence image URL is required'),
  evidence_mime_type: z.string().default('image/jpeg'),
  evidence_size: z.number().min(1000, 'Evidence file size is too small'),
  evidence_width: z.number().optional(),
  evidence_height: z.number().optional(),
  evidence_metadata: z.record(z.unknown()).optional(),
});

export const ClaimResolutionSchema = z.object({
  case_id: z.string().uuid(),
  resolution_notes: z.string().min(10, 'Resolution explanation notes are required'),
  resolution_evidence_url: z.string().url('A valid resolution evidence image URL is required'),
  resolution_mime_type: z.string().default('image/jpeg'),
  resolution_size: z.number().min(1000, 'Resolution evidence file size is too small'),
  resolution_width: z.number().optional(),
  resolution_height: z.number().optional(),
  resolution_metadata: z.record(z.unknown()).optional(),
});

export const UserRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(2, 'Full name is required'),
  role: z.enum(['CITIZEN', 'AUTHORITY']),
  department: z.string().optional(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

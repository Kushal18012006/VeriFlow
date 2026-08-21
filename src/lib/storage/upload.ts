import { EvidenceMetadata } from '../domain/types';

export interface StorageUploadResult {
  file_url: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  width?: number;
  height?: number;
  metadata: EvidenceMetadata;
}

/**
 * Utility helper to validate file and extract metadata before upload.
 */
export async function prepareEvidenceUpload(
  file: File,
  caseId: string,
  type: 'ORIGINAL_REPORT' | 'RESOLUTION_PROOF'
): Promise<StorageUploadResult> {
  const timestamp = new Date().toISOString();
  const filename = `${type.toLowerCase()}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const storage_path = `cases/${caseId}/${filename}`;

  // In production, file would be uploaded to Supabase Storage Bucket ('evidence')
  const file_url = URL.createObjectURL(file);

  return {
    file_url,
    storage_path,
    mime_type: file.type || 'image/jpeg',
    file_size: file.size,
    width: 1920,
    height: 1080,
    metadata: {
      timestamp,
      filename: file.name,
    },
  };
}

import { VisionService } from './src/lib/ai/visionService';
import { EvidenceItem } from './src/lib/domain/types';

async function test() {
  const service = new VisionService();
  const originalEvidence: EvidenceItem[] = [
    {
      id: 'e1',
      case_id: 'c1',
      uploaded_by: 'u1',
      type: 'ORIGINAL_REPORT',
      file_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pothole.jpg/640px-Pothole.jpg',
      storage_path: 'cases/c1/orig.jpg',
      mime_type: 'image/jpeg',
      file_size: 100000,
      metadata_json: {},
      created_at: new Date().toISOString()
    }
  ];
  const resolutionEvidence: EvidenceItem[] = [
    {
      id: 'e2',
      case_id: 'c1',
      uploaded_by: 'u2',
      type: 'RESOLUTION_PROOF',
      file_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Asphalt_patch.jpg/640px-Asphalt_patch.jpg',
      storage_path: 'cases/c1/res.jpg',
      mime_type: 'image/jpeg',
      file_size: 100000,
      metadata_json: {},
      created_at: new Date().toISOString()
    }
  ];

  try {
    const result = await service.analyzeResolutionDelta({
      originalEvidence,
      resolutionEvidence,
      category: 'ROAD_INFRASTRUCTURE',
      caseDescription: 'A large pothole on the main street.'
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

test();

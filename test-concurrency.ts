import { submitResolutionClaim, getAllCases } from './src/lib/db/cases';

async function test() {
  const cases = await getAllCases();
  const target = cases.find(c => c.status === 'OPEN') || cases[0];
  if (target.original_evidence) {
    target.original_evidence[0].mime_type = 'image/jpeg';
  }

  // Ensure case is not in verifying
  console.log('Starting concurrency test on case', target.id);

  // Note: the test-pipeline calls submitResolutionClaim which updates the DB to processing.
  // And it calls fetch on the API. 
  // Let's mock a parallel fetch locally using Node's native fetch.
  // We need the Next.js server to be running.
}
test();

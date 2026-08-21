import {
  IVisualDeltaAnalyzer,
  VisualDeltaAnalysisRequest,
  VisualDeltaAnalysisResult,
} from './contracts';

// We define an expected structured JSON format for the AI response
interface RawVisionResponse {
  isResolved: boolean;
  resolutionLevel: 'FULL' | 'PARTIAL' | 'NONE' | 'INCONCLUSIVE';
  visualCoverageSufficient: boolean;
  detectedChanges: string[];
  residualDamage: boolean;
  explanation: string;
}

export class VisionService implements IVisualDeltaAnalyzer {
  public async analyzeResolutionDelta(
    request: VisualDeltaAnalysisRequest
  ): Promise<VisualDeltaAnalysisResult> {
    const provider = process.env.VISION_AI_PROVIDER || 'openai';
    const model = process.env.VISION_AI_MODEL || 'gpt-4o';
    const apiKey = process.env.VISION_AI_API_KEY;

    if (!apiKey) {
      console.warn(`VISION_AI_API_KEY is missing. Aborting visual analysis.`);
      throw new Error('Vision AI API key is not configured.');
    }

    const originalImages = await Promise.all(
      request.originalEvidence.map((e) => this.fetchImageAsBase64(e.file_url))
    );
    const resolutionImages = await Promise.all(
      request.resolutionEvidence.map((e) => this.fetchImageAsBase64(e.file_url))
    );

    const content: any[] = [
      {
        type: 'text',
        text: `You are a professional civic infrastructure inspector.
Analyze the following pairs of "Original Report" and "Resolution Proof" images.
Case Category: ${request.category}
Case Description: ${request.caseDescription}

Your task is to determine if the reported issue has been resolved.
Return a STRICT JSON object matching this structure:
{
  "isResolved": boolean, // true ONLY if fully resolved
  "resolutionLevel": "FULL" | "PARTIAL" | "NONE" | "INCONCLUSIVE",
  "visualCoverageSufficient": boolean,
  "detectedChanges": string[], // list of specific observations
  "residualDamage": boolean, // true if issue remains partially
  "explanation": string // clear, human-readable justification for your findings
}
DO NOT include any markdown blocks or other text outside the JSON object.
`,
      },
    ];

    originalImages.forEach((img) => {
      if (img) {
        content.push({ type: 'text', text: 'Original Evidence:' });
        content.push({ type: 'image_url', image_url: { url: img } });
      }
    });

    resolutionImages.forEach((img) => {
      if (img) {
        content.push({ type: 'text', text: 'Resolution Proof Evidence:' });
        content.push({ type: 'image_url', image_url: { url: img } });
      }
    });

    try {
      // Determine endpoint based on provider
      let endpoint = 'https://api.openai.com/v1/chat/completions';
      if (provider === 'gemini') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`; // Gemini supports OpenAI SDK format
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content }],
          response_format: { type: 'json_object' },
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Vision API error:', response.status, errText);
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      const rawOutput = data.choices?.[0]?.message?.content;

      if (!rawOutput) {
        throw new Error('Empty response from Vision API');
      }

      const parsed: RawVisionResponse = JSON.parse(rawOutput);

      // Determine evidence-support score from observations
      let supportConfidence = 0.5;
      if (parsed.resolutionLevel === 'FULL') {
        supportConfidence = parsed.visualCoverageSufficient ? 0.95 : 0.7;
      } else if (parsed.resolutionLevel === 'PARTIAL') {
        supportConfidence = 0.8;
      } else if (parsed.resolutionLevel === 'NONE') {
        supportConfidence = 0.9;
      }

      return {
        isResolved: parsed.isResolved,
        supportConfidence,
        detectedChanges: parsed.detectedChanges,
        visualCoverageSufficient: parsed.visualCoverageSufficient,
        explanation: parsed.explanation,
        rawModelResponse: parsed as any,
      };
    } catch (error) {
      console.error('VisionService analysis failed:', error);
      throw error;
    }
  }

  /**
   * Helper to fetch an image (local or remote) and convert it to a base64 Data URI
   * required by most Vision APIs when handling local development environments.
   */
  private async fetchImageAsBase64(url: string): Promise<string | null> {
    try {
      let fetchUrl = url;
      // If it's a relative URL in local dev, prepend localhost
      if (url.startsWith('/')) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        fetchUrl = `${baseUrl}${url}`;
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) return null;

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const mimeType = response.headers.get('content-type') || 'image/jpeg';
      
      // If it's an SVG, OpenAI doesn't natively support SVG vision well, but some models do.
      // We will pass it as a standard data URI.
      return `data:${mimeType};base64,${buffer.toString('base64')}`;
    } catch (e) {
      console.error(`Failed to fetch image for base64 conversion: ${url}`, e);
      return null;
    }
  }
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';

const PRESET_EVIDENCE_SAMPLES = [
  {
    label: 'Sample Pothole Evidence',
    url: '/demo/pothole_evidence.svg',
  },
  {
    label: 'Sample Streetlight Damage Evidence',
    url: '/demo/streetlight_evidence.svg',
  },
  {
    label: 'Sample Clogged Drain Evidence',
    url: '/demo/drainage_evidence.svg',
  },
];

export default function NewCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_EVIDENCE_SAMPLES[0].url);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const absoluteEvidenceUrl = new URL(selectedPreset, window.location.origin).toString();

    const data = {
      title: formData.get('title'),
      category: formData.get('category'),
      location_text: formData.get('location_text'),
      description: formData.get('description'),
      evidence_url: absoluteEvidenceUrl,
    };

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setError(result.error || 'An unexpected error occurred during submission.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('A critical error occurred while submitting the case. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100">Report a Civic Issue</h1>
        <p className="text-sm text-slate-400 mt-1">Submit a detailed issue report with visual evidence for operational review.</p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-4 rounded-lg flex items-start gap-3 text-rose-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Form Fields Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-slate-300">
              Issue Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="E.g., Severe Pothole on Main St."
              className="w-full h-10 px-3 bg-[#0F1523] border border-slate-800 rounded-md text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-slate-300">
              Category
            </label>
            <select
              name="category"
              id="category"
              required
              className="w-full h-10 px-3 bg-[#0F1523] border border-slate-800 rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
            >
              <option value="POTHOLE">Pothole / Road Damage</option>
              <option value="STREETLIGHT">Streetlight Outage</option>
              <option value="DRAINAGE">Drainage / Flooding</option>
              <option value="VANDALISM">Vandalism / Graffiti</option>
              <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location_text" className="block text-sm font-medium text-slate-300">
              Location Details
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                name="location_text"
                id="location_text"
                required
                placeholder="Intersection, landmark, or address"
                className="w-full h-10 pl-9 pr-3 bg-[#0F1523] border border-slate-800 rounded-md text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              placeholder="Provide specific details about the issue..."
              className="w-full p-3 bg-[#0F1523] border border-slate-800 rounded-md text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm resize-none"
            />
          </div>
        </div>

        {/* Evidence Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-slate-400" />
              Evidence Photo
            </label>
            <p className="text-xs text-slate-500">
              Select a representative evidence photo for this issue. This will be stored and used for verification.
            </p>

            <div className="space-y-3 mt-2">
              {PRESET_EVIDENCE_SAMPLES.map((preset) => (
                <label
                  key={preset.url}
                  className={`flex flex-col cursor-pointer border rounded-lg p-3 transition-colors ${
                    selectedPreset === preset.url
                      ? 'bg-[#151D2E] border-indigo-500'
                      : 'bg-[#0F1523] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="preset_selector"
                      value={preset.url}
                      checked={selectedPreset === preset.url}
                      onChange={(e) => setSelectedPreset(e.target.value)}
                      className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-800 border-slate-700"
                    />
                    <span className="text-sm font-medium text-slate-200">
                      {preset.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-4 bg-[#0B101E] border border-slate-800 rounded-lg overflow-hidden aspect-[4/3] relative shadow-sm">
              <SafeImage
                src={selectedPreset}
                alt="Selected evidence preview"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-slate-900/80 px-2 py-1 rounded border border-slate-700 text-[10px] text-slate-300 font-medium uppercase tracking-wider">
                Preview
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="md:col-span-2 pt-6 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="h-10 px-4 bg-transparent border border-slate-700 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting & Generating Audit Log...</span>
              </>
            ) : (
              <span>Submit Case</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

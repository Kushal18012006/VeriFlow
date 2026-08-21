import React from 'react';
import { EvidenceItem } from '@/lib/domain/types';
import SafeImage from '../ui/SafeImage';
import { Camera, Calendar, MapPin, Tag } from 'lucide-react';
import { formatDateUTC } from '@/lib/utils/format';

interface EvidenceInspectorProps {
  originalEvidence: EvidenceItem[];
  resolutionEvidence?: EvidenceItem[];
}

export default function EvidenceInspector({
  originalEvidence,
  resolutionEvidence = [],
}: EvidenceInspectorProps) {
  const hasResolution = resolutionEvidence && resolutionEvidence.length > 0;
  
  const orig = originalEvidence[0];
  const res = hasResolution ? resolutionEvidence[0] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Original Evidence Panel */}
      <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
        <div className="bg-[#151D2E] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Original report</span>
          <span className="text-[10px] font-semibold text-slate-400">
            VF-{orig?.id.slice(0, 4).toUpperCase()}
          </span>
        </div>
        
        <div className="aspect-[4/3] bg-[#0B1120] relative">
          {orig ? (
            <SafeImage
              src={orig.file_url}
              alt="Original report evidence"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              No evidence provided
            </div>
          )}
        </div>

        {orig && (
          <div className="p-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-800/60 bg-[#0F1523]">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Timestamp</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {orig.metadata_json?.timestamp ? formatDateUTC(orig.metadata_json.timestamp) : 'Unknown'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">GPS Location</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {orig.metadata_json?.gps ? `${orig.metadata_json.gps.latitude.toFixed(4)}, ${orig.metadata_json.gps.longitude.toFixed(4)}` : 'Missing EXIF'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Device</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                {orig.metadata_json?.camera_make ? `${orig.metadata_json.camera_make} ${orig.metadata_json.camera_model}` : 'Unknown'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Format</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                {orig.mime_type} ({Math.round(orig.file_size / 1024)} KB)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resolution Evidence Panel */}
      <div className="bg-[#0F1523] border border-slate-800 rounded-lg overflow-hidden flex flex-col shadow-sm">
        <div className="bg-[#151D2E] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Resolution proof</span>
          {res && (
            <span className="text-[10px] font-semibold text-slate-400">
              VF-{res.id.slice(0, 4).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="aspect-[4/3] bg-[#0B1120] relative">
          {res ? (
            <SafeImage
              src={res.file_url}
              alt="Resolution proof evidence"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-sm p-6 text-center border-2 border-dashed border-slate-800 m-4 w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-md">
              <span className="text-slate-400 font-medium mb-1">Awaiting Resolution</span>
              <span className="text-xs">No resolution proof has been submitted for this case yet.</span>
            </div>
          )}
        </div>

        {res && (
          <div className="p-4 grid grid-cols-2 gap-3 text-xs border-t border-slate-800/60 bg-[#0F1523]">
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Timestamp</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {res.metadata_json?.timestamp ? formatDateUTC(res.metadata_json.timestamp) : 'Unknown'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">GPS Location</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {res.metadata_json?.gps ? `${res.metadata_json.gps.latitude.toFixed(4)}, ${res.metadata_json.gps.longitude.toFixed(4)}` : 'Missing EXIF'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Device</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
                {res.metadata_json?.camera_make ? `${res.metadata_json.camera_make} ${res.metadata_json.camera_model}` : 'Unknown'}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-slate-500 font-medium">Format</span>
              <div className="text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                {res.mime_type} ({Math.round(res.file_size / 1024)} KB)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

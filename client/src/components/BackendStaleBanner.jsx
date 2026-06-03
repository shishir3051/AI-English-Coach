import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function BackendStaleBanner() {
  return (
    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">Backend needs a restart</p>
        <p className="mt-1 text-amber-200/90 leading-relaxed">
          An older server is still running on port 5000 without IELTS routes. Stop it, then run:{' '}
          <code className="text-[10px] bg-black/30 px-1 py-0.5 rounded">cd server && npm run restart</code>
          {' '}or from the project root: <code className="text-[10px] bg-black/30 px-1 py-0.5 rounded">npm run dev</code>.
          Practice tests below work offline until the API is updated.
        </p>
      </div>
    </div>
  );
}

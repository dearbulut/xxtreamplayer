'use client';

import { EPGGuide } from '@/components/epg-guide';

export default function LiveChannelsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Live Channels</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EPGGuide />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { getEPGData } from '@/lib/utils';

interface Channel {
  id: string;
  displayName: string;
  icon: string;
}

interface Programme {
  title: string;
  desc: string;
  start: string;
  stop: string;
  channel: string;
}

interface EPGData {
  channels: Channel[];
  programmes: Programme[];
}

export function EPGGuide() {
  const [epgData, setEpgData] = useState<EPGData>({ channels: [], programmes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const data = await getEPGData();
        // Transform the data into a more usable format
        const channels = data.tv.channel.map((ch: any) => ({
          id: ch._id,
          displayName: ch['display-name'],
          icon: ch.icon?.src || ''
        }));

        const programmes = data.tv.programme?.map((prog: any) => ({
          title: prog.title,
          desc: prog.desc || '',
          start: new Date(prog._start.replace(' +0000', '')).toLocaleString(),
          stop: new Date(prog._stop.replace(' +0000', '')).toLocaleString(),
          channel: prog._channel
        })) || [];

        setEpgData({ channels, programmes });
      } catch (err) {
        setError('Failed to load EPG data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEPG();
  }, []);

  const filteredProgrammes = selectedChannel
    ? epgData.programmes.filter(prog => prog.channel === selectedChannel)
    : epgData.programmes;

  if (loading) return <div className="p-4">Loading EPG data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Channel List */}
      <div className="md:col-span-1 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-4 border-b">Channels</h2>
        <div className="overflow-y-auto max-h-[600px]">
          {epgData.channels.map((channel) => (
            <div
              key={channel.id + channel.displayName}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChannel === channel.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedChannel(channel.id)}
            >
              <div className="flex items-center gap-2">
                {channel.icon && (
                  <img 
                    src={channel.icon} 
                    alt={channel.displayName} 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span>{channel.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Programme List */}
      <div className="md:col-span-2 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold p-4 border-b">
          {selectedChannel ? 'Channel Programme' : 'All Programmes'}
        </h2>
        <div className="overflow-y-auto max-h-[600px]">
          {filteredProgrammes.map((program, index) => (
            <div key={index} className="p-4 border-b hover:bg-gray-50">
              <h3 className="font-semibold text-lg">{program.title}</h3>
              <p className="text-sm text-gray-600">
                {program.start} - {program.stop}
              </p>
              {program.desc && (
                <p className="text-sm mt-2 text-gray-700">{program.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

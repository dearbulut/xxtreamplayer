'use client';

import { useEffect, useState } from 'react';
import { fetchFromApi, getStreamUrl } from '@/lib/utils';
import { VideoPlayer } from './video-player';
import {  Tv } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
interface Channel {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export async function LiveChannels() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, channelsData] = await Promise.all([
          fetchFromApi('get_live_categories'),
          fetchFromApi('get_live_streams')
        ]);
        setCategories(categoriesData);
        setChannels(channelsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredChannels = selectedCategory === 'all'
    ? channels
    : channels.filter(channel => channel.category_id === selectedCategory);

  const searchedChannels = searchQuery
    ? filteredChannels.filter(channel =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredChannels;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[350px,1fr] md:grid-cols-[300px,1fr] gap-4 md:gap-6 p-4">
      <div className="flex flex-col space-y-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4 space-y-4">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="p-4 space-y-2">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 p-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : searchedChannels.length === 0 ? (
                <p className="text-center text-muted-foreground p-4">
                  No channels found
                </p>
              ) : (
                searchedChannels.map((channel) => (
                  <button
                    key={channel.stream_id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`flex items-center space-x-3 w-full p-2 rounded-md hover:bg-accent transition-colors ${
                      selectedChannel?.stream_id === channel.stream_id ? 'bg-accent' : ''
                    }`}
                  >
                    {channel.stream_icon ? (
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <Image
                          src={channel.stream_icon}
                          alt={channel.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Tv className="w-8 h-8 flex-shrink-0" />
                    )}
                    <span className="text-sm text-left line-clamp-2">{channel.name}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className="space-y-4">
        {selectedChannel ? (
          <>
            <div className="rounded-lg overflow-hidden">
              <VideoPlayer
                src={await getStreamUrl('live', selectedChannel.stream_id)}
              />
            </div>
            <h2 className="text-xl md:text-2xl font-bold">{selectedChannel.name}</h2>
          </>
        ) : (
          <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
            <p className="text-lg text-center px-4">Select a channel to start watching</p>
          </div>
        )}
      </div>
    </div>
  );
}
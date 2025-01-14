'use client';

import { useEffect, useState, use } from 'react';
import { fetchFromApi, getStreamUrl } from '@/lib/api';
import { VideoPlayer } from '@/components/video-player';
import { Film } from 'lucide-react';
import Image from 'next/image';

interface SeriesDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SeriesDetails(props: SeriesDetailsProps) {
  const params = use(props.params);
  const [series, setSeries] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formattedSeries, setFormattedSeries] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {
        const seriesData = await fetchFromApi(`get_series_info&series_id=${params.id}`);
        setSeries(seriesData);
        console.log("API Response:", seriesData); // Log the API response

        // Format the series data into the desired JSON structure
        const formatted = formatSeriesData(seriesData);
        setFormattedSeries(formatted);
        console.log("Formatted JSON:", formatted); // Log the formatted JSON

         // Select first episode of first season by default
        if (formatted && formatted.seasons && formatted.seasons[0] && formatted.seasons[0].episodes[0]) {
          setSelectedSeason(1);
          setSelectedEpisode(formatted.seasons[0].episodes[0]);
        }

        // Create a download URL for the formatted JSON data
        const jsonString = JSON.stringify(formatted, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);

      } catch (error) {
        console.error('Failed to fetch series data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  // Function to format the series data
  const formatSeriesData = (data: any) => {
    if (!data) return null;

    const formattedData = {
      series_id: data.series_id,
      name: data.name,
      cover: data.cover,
      plot: data.plot,
      cast: data.cast,
      director: data.director,
      genre: data.genre,
      rating: data.rating,
      seasons: [] as any[],
    };

    if (data.seasons) {
      formattedData.seasons = data.seasons.map((season: any) => ({
        season_number: season.season_number,
        episodes: season.episodes.map((episode: any) => ({
          id: episode.id,
          episode_num: episode.episode_num,
          title: episode.title,
          info: episode.info,
        })),
      }));
    }
    return formattedData;
  };


  if (loading || !formattedSeries) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        {/* Series poster */}
        <div className="relative aspect-[2/3] md:aspect-auto">
          {formattedSeries.cover ? (
            <Image
              src={formattedSeries.cover}
              alt={formattedSeries.name}
              fill
              className="object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center rounded-lg">
              <Film className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Series info */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{formattedSeries.name}</h1>
          {formattedSeries.plot && (
            <p className="text-muted-foreground">{formattedSeries.plot}</p>
          )}
          {formattedSeries.cast && (
            <div>
              <h2 className="font-semibold mb-1">Cast</h2>
              <p className="text-muted-foreground">{formattedSeries.cast}</p>
            </div>
          )}
          {formattedSeries.director && (
            <div>
              <h2 className="font-semibold mb-1">Director</h2>
              <p className="text-muted-foreground">{formattedSeries.director}</p>
            </div>
          )}
          {formattedSeries.genre && (
            <div>
              <h2 className="font-semibold mb-1">Genre</h2>
              <p className="text-muted-foreground">{formattedSeries.genre}</p>
            </div>
          )}
          {formattedSeries.rating && (
            <div>
              <h2 className="font-semibold mb-1">Rating</h2>
              <p className="text-muted-foreground">{formattedSeries.rating}/10</p>
            </div>
          )}
        </div>
      </div>

      {/* Video player and episode selection */}
      <div className="space-y-4">
        {selectedEpisode ? (
          <div className="rounded-lg overflow-hidden">
            <VideoPlayer
              src={getStreamUrl(selectedEpisode.id, 'series')}
              poster={selectedEpisode.info?.movie_image || formattedSeries.cover}
            />
          </div>
        ) : (
          <div className="aspect-video bg-accent rounded-lg flex items-center justify-center">
            <p className="text-lg text-center px-4">Select an episode to start watching</p>
          </div>
        )}

        {/* Season and episode selection */}
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {formattedSeries.seasons?.map((season: any) => (
              <button
                key={season.season_number}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedSeason === season.season_number ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                Season {season.season_number}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {formattedSeries.seasons
              ?.find((s: any) => s.season_number === selectedSeason)
              ?.episodes.map((episode: any) => (
                <button
                  key={episode.id}
                  onClick={() => setSelectedEpisode(episode)}
                  className={`flex flex-col bg-card rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all ${
                    selectedEpisode?.id === episode.id ? 'ring-2' : ''
                  }`}
                >
                  <div className="relative aspect-video">
                    {episode.info?.movie_image ? (
                      <Image
                        src={episode.info.movie_image}
                        alt={episode.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <Film className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium line-clamp-2">
                      Episode {episode.episode_num}: {episode.title}
                    </h3>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
      {downloadUrl && (
        <a href={downloadUrl} download="series_data.json">
          Download JSON
        </a>
      )}
    </div>
  );
}

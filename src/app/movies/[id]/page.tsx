'use server';

import { Suspense } from 'react';
import { fetchFromApi } from '@/lib/utils';
import { Loader2, Star, Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video-player';
import { getStreamUrl } from '@/lib/utils';
import MovieClient from './movie-client';

interface MovieInfo {
  movie_image: string;
  name: string;
  tmdb_id: number;
  backdrop: string;
  youtube_trailer: string;
  genre: string;
  plot: string;
  cast: string;
  rating: string;
  director: string;
  releasedate: string;
  backdrop_path: string[];
  duration_secs: number;
  duration: string;
}

interface MovieData {
  stream_id: number;
  name: string;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

interface MovieDetails {
  info: MovieInfo;
  movie_data: MovieData;
  streamUrl: string;
}

async function getMovieDetails(id: string): Promise<MovieDetails> {
  try {
    const movie = await fetchFromApi('get_vod_info', { vod_id: id });
    console.log('Movie data:', movie);
    
    if (!movie || !movie.movie_data) {
      throw new Error('Invalid movie data received from API');
    }
    
    const streamUrl = await getStreamUrl("movie", movie.movie_data.stream_id);
    
    return {
      ...movie,
      streamUrl
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
}

export default async function MovieDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const movieDetails = await getMovieDetails(params.id);
    
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>}>
        <MovieClient movieDetails={movieDetails} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in MovieDetailsPage:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load movie details</p>
      </div>
    );
  }
}

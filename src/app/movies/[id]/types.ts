export interface MovieInfo {
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

export interface MovieData {
  stream_id: number;
  name: string;
  added: string;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

export interface MovieDetails {
  info: MovieInfo;
  movie_data: MovieData;
  streamUrl: string;
}

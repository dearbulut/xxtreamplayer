'use client';

import { useEffect, useState } from 'react';
import { fetchFromApi } from '@/lib/utils';
import { Film } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Movie {
  stream_id: string;
  name: string;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  category_id: string;
  container_extension: string;
  custom_sid: string;
  direct_source: string;
}

interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export function MovieList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, moviesData] = await Promise.all([
          fetchFromApi('get_vod_categories'),
          fetchFromApi('get_vod_streams')
        ]);
        setCategories(categoriesData);
        setMovies(moviesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMovies = selectedCategory
    ? movies.filter(movie => movie.category_id === selectedCategory)
    : movies;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-4">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => setSelectedCategory(category.category_id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.category_id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMovies.map((movie) => (
          <Link
            key={movie.stream_id}
            href={`/movies/${movie.stream_id}`}
            className="group relative flex flex-col bg-card rounded-lg overflow-hidden hover:ring-2 ring-primary transition-all"
          >
            <div className="relative aspect-[2/3]">
              {movie.stream_icon ? (
                <Image
                  src={movie.stream_icon}
                  alt={movie.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Film className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-medium line-clamp-2">{movie.name}</h3>
              {movie.rating_5based > 0 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{movie.rating_5based}/5</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
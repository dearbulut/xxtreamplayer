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
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await fetchFromApi('get_vod_categories');
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch movies when category is selected
  useEffect(() => {
    async function fetchMovies() {
      if (!selectedCategory) return;
      
      setLoading(true);
      try {
        const moviesData = await fetchFromApi('get_vod_streams', {
          category_id: selectedCategory
        });
        setMovies(moviesData);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [selectedCategory]);

  if (loading && !selectedCategory) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {categories.map((category) => (
          <button
            key={category.category_id}
            onClick={() => setSelectedCategory(category.category_id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.category_id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {category.category_name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : !selectedCategory ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-muted-foreground">Please select a category to view movies</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
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
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <Film className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium line-clamp-2">{movie.name}</h3>
                {movie.rating_5based > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Rating: {movie.rating_5based}/5
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
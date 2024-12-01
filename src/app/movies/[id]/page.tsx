'use server';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import MovieDetailsComponent from './movie-details';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { id } = await params;
  
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <MovieDetailsComponent movieId={id} />
    </Suspense>
  );
}

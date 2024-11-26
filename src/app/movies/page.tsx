import { MovieList } from "@/components/movie-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MoviesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <MovieList />
    </div>
  );
}
import { SeriesList } from "@/components/series-list";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SeriesPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <SeriesList />
    </div>
  );
}

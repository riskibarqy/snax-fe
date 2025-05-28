import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch URLs from API
  const response = await fetch(`${process.env.API_URL}/urls`, {
    headers: {
      'Authorization': `Bearer ${userId}`
    }
  });

  if (!response.ok) {
    return <div>Error loading URLs</div>;
  }

  const urls = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AnalyticsDashboard urls={urls} />
    </div>
  );
} 
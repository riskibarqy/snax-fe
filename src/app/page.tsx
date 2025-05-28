import { UserButton } from "@clerk/nextjs";
import { URLShortenerForm } from "@/components/url-shortener-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="fixed w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            SnaxURL
          </h1>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">
              Shorten Your Links, Expand Your Reach
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create short, memorable links that redirect to your content. Track clicks and analyze performance.
            </p>
          </div>
          
          <URLShortenerForm />
        </div>
      </div>
    </main>
  );
}

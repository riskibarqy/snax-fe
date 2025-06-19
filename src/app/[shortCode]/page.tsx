// app/[shortCode]/page.tsx
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
    const resolvedParams = await params;
    const { shortCode } = resolvedParams;
  
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/r/${shortCode}`,
      { method: 'GET', redirect: 'manual' }
    );

  if (res.status === 302 || res.status === 301) {
    const location = res.headers.get('location');
    if (location) {
      redirect(location);
    }
  }

  redirect('/not-found');
}

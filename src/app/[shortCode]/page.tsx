import { redirect, notFound } from 'next/navigation';

export default async function RedirectPage({ params: { shortCode } }: { params: { shortCode: string } }) {
  try {
    const res = await fetch(`${process.env.API_URL}/urls/${shortCode}`, {
      cache: 'no-store',
    });

    if (!res.ok) return notFound();

    const data = await res.json();

    if (typeof data.url !== 'string') return notFound();

    redirect(data.url);
  } catch {
    return <div>Error processing redirect</div>;
  }
}

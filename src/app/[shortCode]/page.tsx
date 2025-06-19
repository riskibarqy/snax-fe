// src/app/[shortCode]/page.tsx

import { redirect } from 'next/navigation';

export default async function RedirectPage({
  params,
}: {
  params: { shortCode: string };
}) {
  const { shortCode } = params;

  const res = await fetch(`${process.env.API_URL}/urls/${shortCode}`, {
    cache: 'no-store',
  });

  if (!res.ok) return <div>URL not found</div>;

  const data = await res.json();

  if (typeof data.url !== 'string') return <div>Invalid URL</div>;

  redirect(data.url);
}

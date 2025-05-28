import { Metadata } from 'next';

interface Props {
  params: { shortCode: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params: { shortCode } }: Props
): Promise<Metadata> {
  return {
    title: `Redirecting... | ${shortCode}`,
  };
}

export default async function RedirectPage(
  { params: { shortCode } }: Props
) {
  try {
    // Find the URL using the API
    const response = await fetch(`${process.env.API_URL}/urls/${shortCode}`, {
      // Add cache: 'no-store' to prevent caching
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return new Response('URL not found', { status: 404 });
    }

    const data = await response.json();
    
    // Ensure data.url is a string
    if (typeof data.url !== 'string') {
      throw new Error('Invalid URL format');
    }

    return Response.redirect(data.url);
  } catch (error) {
    console.error('Error processing redirect:', error);
    return new Response('Error processing redirect', { status: 500 });
  }
} 
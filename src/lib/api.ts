import { CreateUrlRequest, Url, Domain, Tag, UrlAnalytics, ApiResponse } from './types';

const API_BASE_URL = "https://snax-url-shortener.fly.dev";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  console.log(API_BASE_URL, endpoint)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  console.log(response);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

export async function createShortUrl(data: CreateUrlRequest, isLoggedIn: boolean): Promise<ApiResponse<Url>> {
  const endpoint = isLoggedIn ? '/urls' : '/public/shorten';

  return fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// // URL Management
// export async function createShortUrl(data: CreateUrlRequest): Promise<ApiResponse<Url>> {
//   return fetchWithAuth('/urls', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }

export async function getUserUrls(): Promise<ApiResponse<Url[]>> {
  return fetchWithAuth('/urls');
}

export async function getUrlAnalytics(urlId: string): Promise<ApiResponse<UrlAnalytics>> {
  return fetchWithAuth(`/urls/${urlId}/analytics`);
}

// Tags Management
export async function getUrlTags(urlId: string): Promise<ApiResponse<Tag[]>> {
  return fetchWithAuth(`/urls/${urlId}/tags`);
}

export async function addUrlTag(urlId: string, tag: string): Promise<ApiResponse<Tag>> {
  return fetchWithAuth(`/urls/${urlId}/tags`, {
    method: 'POST',
    body: JSON.stringify({ tag }),
  });
}

export async function removeUrlTag(urlId: string, tag: string): Promise<ApiResponse<void>> {
  return fetchWithAuth(`/urls/${urlId}/tags/${tag}`, {
    method: 'DELETE',
  });
}

// Domain Management
export async function getUserDomains(): Promise<ApiResponse<Domain[]>> {
  return fetchWithAuth('/domains');
}

export async function registerDomain(domain: string): Promise<ApiResponse<Domain>> {
  return fetchWithAuth('/domains', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
}

export async function verifyDomain(domainId: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchWithAuth(`/domains/${domainId}/verify`, {
    method: 'POST',
  });
}

export async function deleteDomain(domainId: string): Promise<ApiResponse<void>> {
  return fetchWithAuth(`/domains/${domainId}`, {
    method: 'DELETE',
  });
}

// Health Check
export async function checkHealth(): Promise<ApiResponse<{ status: string; database: string }>> {
  return fetchWithAuth('/health');
} 
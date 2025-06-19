"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createShortUrl } from "@/lib/api";
import { CreateUrlRequest } from "@/lib/types";

const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  customCode: z.string().optional(),
  expiresAt: z.string().optional(),
});

type FormData = z.infer<typeof urlSchema>;

export function URLShortenerForm() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ isSignedIn ] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError(null);
      const request: CreateUrlRequest = {
        url: data.url,
        customCode: data.customCode,
        expiresAt: data.expiresAt,
      };

      const response = await createShortUrl(request, isSignedIn);
      if (response.error) {
        setError(typeof response.error === 'string' ? response.error : response.error.message);
        return;
      }

      if (response.data) {
        const baseUrl = window.location.origin;
        setShortUrl(`${baseUrl}/${response.data.shortCode}`);
      }
    } catch (error) {
      console.error("Error shortening URL:", error);
      setError("Failed to shorten URL. Please try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            Enter your URL
          </label>
          <input
            {...register("url")}
            type="url"
            id="url"
            placeholder="https://example.com"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium mb-1">
            Custom Code (Optional)
          </label>
          <input
            {...register("customCode")}
            type="text"
            id="customCode"
            placeholder="custom-code"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium mb-1">
            Expiration Date (Optional)
          </label>
          <input
            {...register("expiresAt")}
            type="datetime-local"
            id="expiresAt"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm font-medium mb-2">Your shortened URL:</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border rounded-md"
            />
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
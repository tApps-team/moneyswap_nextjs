"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { CmsApiError } from "../api/client";

/**
 * Свой QueryClient для CMS, отдельно от сайтового: там минутный кэш под SSR,
 * а редактору нужны живые данные. Ошибки 4xx не повторяем — это права,
 * валидация или отсутствие записи, повтор ничего не изменит.
 */
export function CmsProviders({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 15 * 1000,
            refetchOnWindowFocus: false,
            retry: (count, error) =>
              !(error instanceof CmsApiError && error.status < 500) && count < 2,
          },
          mutations: { retry: false },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

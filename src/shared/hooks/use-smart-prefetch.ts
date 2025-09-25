"use client";

import { useRouter } from "next/navigation";
import { useRef, useCallback } from "react";

interface PrefetchOptions {
  delay?: number; // Задержка перед prefetch
  cancelPrevious?: boolean; // Отменять ли предыдущие запросы
}

export const useSmartPrefetch = (options: PrefetchOptions = {}) => {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activePrefetches = useRef<Set<string>>(new Set());
  
  const { delay = 150, cancelPrevious = true } = options;

  const prefetch = useCallback((route: string) => {
    // Если prefetch уже активен для этого маршрута, не запускаем повторно
    if (activePrefetches.current.has(route)) {
      return;
    }

    // Отменяем предыдущий prefetch если нужно
    if (cancelPrevious && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Запускаем prefetch с задержкой
    timeoutRef.current = setTimeout(() => {
      // Добавляем маршрут в активные prefetch
      activePrefetches.current.add(route);
      
      // Выполняем prefetch
      router.prefetch(route);
      
      // Убираем из активных через небольшую задержку
      setTimeout(() => {
        activePrefetches.current.delete(route);
      }, 1000);
      
      timeoutRef.current = null;
    }, delay);
  }, [router, delay, cancelPrevious]);

  const cancelPrefetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const prefetchMultiple = useCallback((routes: string[]) => {
    // Отменяем предыдущие prefetch
    if (cancelPrevious) {
      cancelPrefetch();
    }

    // Prefetch всех маршрутов параллельно
    routes.forEach(route => {
      if (!activePrefetches.current.has(route)) {
        activePrefetches.current.add(route);
        router.prefetch(route);
        
        // Убираем из активных через задержку
        setTimeout(() => {
          activePrefetches.current.delete(route);
        }, 1000);
      }
    });
  }, [router, cancelPrevious, cancelPrefetch]);

  return {
    prefetch,
    cancelPrefetch,
    prefetchMultiple,
    isPrefetching: (route: string) => activePrefetches.current.has(route)
  };
};

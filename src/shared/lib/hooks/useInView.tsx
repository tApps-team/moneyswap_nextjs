"use client";

import { RefObject, useEffect, useRef, useState } from "react";

/**
 * Сообщает, попал ли элемент в область просмотра.
 * Срабатывает один раз: блоки-витрины появляются при первой прокрутке и дальше
 * не должны мигать при возврате наверх.
 */
export function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit,
): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Без поддержки observer'а показываем сразу, чтобы контент не остался скрытым
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1, ...options },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

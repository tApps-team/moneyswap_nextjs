"use client";
import { useEffect, useState } from "react";

/** Ниже этого порога считаем, что клавиатуры нет: так отсекаем схлопывание адресной строки. */
const KEYBOARD_MIN_HEIGHT = 120;

/**
 * Высота экранной клавиатуры — разница между layout- и visual-viewport.
 * Нужна, чтобы поднимать закреплённые снизу блоки над клавиатурой.
 * Возвращает 0 на десктопе и там, где visualViewport недоступен.
 */
export function useKeyboardInset(enabled = true) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = typeof window !== "undefined" ? window.visualViewport : null;
    if (!enabled || !viewport) {
      setInset(0);
      return;
    }

    const update = () => {
      // offsetTop вычитаем: браузер мог сам сдвинуть visual viewport при фокусе.
      const height = window.innerHeight - viewport.height - viewport.offsetTop;
      setInset(height > KEYBOARD_MIN_HEIGHT ? Math.round(height) : 0);
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [enabled]);

  return enabled ? inset : 0;
}

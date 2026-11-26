/**
 * One localStorage key as an external store for React. Falls back to memory when
 * the browser blocks or fills storage.
 */
export function createBrowserStore(key: string) {
  const listeners = new Set<() => void>();
  let fallback: string | null = null;

  return {
    read(): string | null {
      try {
        return fallback ?? window.localStorage.getItem(key);
      } catch {
        return fallback;
      }
    },
    write(value: string): void {
      try {
        window.localStorage.setItem(key, value);
        fallback = null;
      } catch {
        fallback = value;
      }
      listeners.forEach((listener) => listener());
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      // Keeps other open tabs in step.
      window.addEventListener('storage', listener);
      return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', listener);
      };
    },
  };
}

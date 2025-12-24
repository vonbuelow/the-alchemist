const STORAGE_KEY = "alchemist_magic";

export function captureMagicFromUrl() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const magic = url.searchParams.get("magic");
  if (!magic) return;

  localStorage.setItem(STORAGE_KEY, magic);

  url.searchParams.delete("magic");
  window.history.replaceState({}, "", url.toString());
}

export function getMagicToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

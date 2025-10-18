// Buduje poprawny URL do zasobów z public/ lub z internetu.
// Działa w dev i po deployu (honoruje BASE_URL/PUBLIC_URL).
export const resolvePublicUrl = (u?: string) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u; // zewnętrzny URL
  const base =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (import.meta as any)?.env?.BASE_URL ??
    (typeof process !== "undefined" ? process.env.PUBLIC_URL || "/" : "/");
  return `${base}${u.replace(/^\//, "")}`; // media/a.jpg  -> {base}/media/a.jpg
};

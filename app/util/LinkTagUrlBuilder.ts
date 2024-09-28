export function LinkTagUrlBuilder(tag: string): string {
  return `/links/tags.html?tag=${encodeURIComponent(tag)}`;
}
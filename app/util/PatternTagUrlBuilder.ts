
export function PatternTagUrlBuilder(tag: string): string {
  return `/patterns/tags.html?tag=${encodeURIComponent(tag)}`;
}

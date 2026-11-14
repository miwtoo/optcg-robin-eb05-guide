export function cardImage(id: string): string {
  const set = id.slice(0, 4).toLowerCase();
  return `https://onepiecetopdecks.com/wp-content/gallery/${set}/${id}.jpg`;
}

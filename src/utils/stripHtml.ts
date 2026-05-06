/** Removes HTML tags for safe plain-text previews (TVMaze summaries are HTML). */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

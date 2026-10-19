import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

export function renderMd(text: string): string {
  if (!text) return "";
  return marked.parse(text) as string;
}
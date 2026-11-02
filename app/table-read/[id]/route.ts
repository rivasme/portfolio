import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "content", "table-read");
const ID = /^[a-z0-9]{6,32}$/;

export const dynamicParams = false;

export async function generateStaticParams() {
  const files = await readdir(DIR);
  return files
    .filter((f) => f.endsWith(".html"))
    .map((f) => ({ id: f.replace(/\.html$/, "") }))
    .filter((p) => ID.test(p.id));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!ID.test(id)) return new Response("Not found", { status: 404 });
  try {
    const html = await readFile(path.join(DIR, `${id}.html`), "utf8");
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
        "cache-control": "public, max-age=0, must-revalidate",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

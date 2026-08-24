import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import hljs from "highlight.js";

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

export function getAllPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title || file,
      date: data.date || "",
      category: data.category || "미분류",
      tags: data.tags || [],
      summary: data.summary || content.replace(/[#*`\n-]/g, " ").trim().slice(0, 120),
      demo: data.demo || null,
    };
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug) {
  const fp = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const raw = fs.readFileSync(fp, "utf-8");
  const { data, content } = matter(raw);
  marked.setOptions({
    highlight: (code, lang) => {
      try {
        return lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang }).value
          : hljs.highlightAuto(code).value;
      } catch {
        return code;
      }
    },
  });
  const html = marked(content);
  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    category: data.category || "미분류",
    tags: data.tags || [],
    demo: data.demo || null,
    html,
  };
}

export function getAllCategories() {
  const posts = getAllPosts();
  const map = {};
  for (const p of posts) map[p.category] = (map[p.category] || 0) + 1;
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}

import Link from "next/link";
import { getAllPosts, getAllCategories } from "../../lib/posts";

export default function Home({ posts, categories }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-8 py-6">
        <h1 className="text-2xl font-bold">📝 Hermes Blog & Archive</h1>
        <p className="text-sm text-gray-400 mt-1">
          Hermes Agent가 작성한 글 · 코드 데모 · 리포트 아카이브
        </p>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-10">
        {/* 카테고리 */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((c) => (
            <span
              key={c.name}
              className="px-3 py-1 rounded-full bg-gray-800 text-sm text-gray-300"
            >
              {c.name} ({c.count})
            </span>
          ))}
        </div>

        {/* 글 목록 */}
        <div className="space-y-4">
          {posts.length === 0 && (
            <p className="text-gray-500">
              아직 게시글이 없습니다. Hermes에게 "블로그에 올려줘"라고 말씀해보세요.
            </p>
          )}
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/post/${p.slug}`}
              className="block p-5 rounded-lg border border-gray-800 hover:border-blue-600 transition"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <span className="text-xs text-gray-500 whitespace-nowrap">{p.date}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{p.summary}</p>
              <div className="flex gap-2 mt-3 items-center">
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/50 text-blue-300">
                  {p.category}
                </span>
                {p.demo && (
                  <span className="text-xs px-2 py-0.5 rounded bg-green-900/50 text-green-300">
                    ▶ 데모 포함
                  </span>
                )}
                {p.tags.map((t) => (
                  <span key={t} className="text-xs text-gray-500">#{t}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  return { props: { posts, categories } };
}

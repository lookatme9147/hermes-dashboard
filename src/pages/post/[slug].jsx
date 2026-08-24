import Link from "next/link";
import { useRouter } from "next/router";
import { getPost } from "../../../lib/posts";

export default function PostPage({ post }) {
  const router = useRouter();
  if (router.isFallback) return <div className="p-10 text-gray-400">로딩 중...</div>;
  if (!post)
    return (
      <div className="p-10 text-gray-300">
        글을 찾을 수 없습니다.{" "}
        <Link href="/" className="text-blue-400">← 목록으로</Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-8 py-4 flex items-center gap-4">
        <Link href="/" className="text-blue-400 hover:underline text-sm">← 블로그 홈</Link>
      </header>

      <article className="max-w-3xl mx-auto px-8 py-10">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex gap-3 items-center text-sm text-gray-500 mb-8">
          <span>{post.date}</span>
          <span className="px-2 py-0.5 rounded bg-blue-900/50 text-blue-300 text-xs">{post.category}</span>
          {post.tags.map((t) => (
            <span key={t} className="text-xs">#{t}</span>
          ))}
        </div>

        {/* 본문 */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* 데모 임베드 (public/demos/*.html) */}
        {post.demo && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold mb-3 border-t border-gray-800 pt-6">
              ▶ 실행 데모
            </h2>
            <iframe
              src={`/demos/${post.demo}`}
              className="w-full h-[600px] rounded-lg border border-gray-800 bg-white"
              sandbox="allow-scripts allow-same-origin"
            />
            <a
              href={`/demos/${post.demo}`}
              target="_blank"
              rel="noopener"
              className="inline-block mt-2 text-sm text-blue-400 hover:underline"
            >
              새 창에서 크게 보기 ↗
            </a>
          </section>
        )}
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const { getAllPosts } = await import("../../../lib/posts");
  const posts = getAllPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPost(params.slug);
  return { props: { post } };
}

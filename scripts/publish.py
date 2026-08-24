#!/usr/bin/env python3
"""Hermes 블로그 발행 스크립트
사용법:
  python publish.py --title "제목" --category "카테고리" --tags "a,b" [--demo file.html] [--file path.md]
  python publish.py --file content/posts/draft.md  (이미 작성된 md 발행)
"""
import argparse, subprocess, sys, os, re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS = ROOT / "content" / "posts"

def slugify(title):
    s = re.sub(r"[^\w\s-]", "", title, flags=re.UNICODE)
    s = re.sub(r"[\s_]+", "-", s.strip()).lower()
    return s[:60] or f"post-{datetime.now():%Y%m%d%H%M%S}"

def git(*args):
    r = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=120)
    if r.returncode != 0:
        print(f"[git {' '.join(args[:2])}] 실패: {r.stderr.strip()[:200]}")
    return r

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title"); ap.add_argument("--category", default="미분류")
    ap.add_argument("--tags", default=""); ap.add_argument("--summary", default="")
    ap.add_argument("--demo", default=None, help="public/demos/ 아래 html 파일명")
    ap.add_argument("--file", help="기존 md 파일 경로 (frontmatter 있으면 그대로 사용)")
    ap.add_argument("--body", help="마크다운 본문 문자열 (--title과 함께 사용)")
    ap.add_argument("--no-push", action="store_true", help="커밋만 하고 푸시 안 함")
    a = ap.parse_args()

    if not a.file and not (a.title and a.body is not None):
        sys.exit("오류: --file 또는 --title+--body 필요")

    # 파일 모드
    if a.file:
        src = Path(a.file)
        if not src.exists():
            sys.exit(f"오류: {src} 없음")
        text = src.read_text(encoding="utf-8")
        if text.startswith("---"):
            # frontmatter 있음 → slug만 파일명으로
            m = re.search(r"^title:\s*[\"']?(.+?)[\"']?\s*$", text, re.M)
            slug = slugify(m.group(1)) if m else Path(a.file).stem
        else:
            sys.exit("오류: frontmatter(--- title: ... ---)가 있는 md만 지원. --title 모드 사용")
        dst = POSTS / f"{slug}.md"
        dst.write_text(text, encoding="utf-8")
    else:
        # 생성 모드
        slug = slugify(a.title)
        today = datetime.now().strftime("%Y-%m-%d")
        tags = ",".join(t.strip() for t in a.tags.split(",") if t.strip())
        body = (
            "---\n"
            f'title: "{a.title}"\n'
            f"date: \"{today}\"\n"
            f'category: "{a.category}"\n'
            f"tags: [{tags}]\n"
            + (f'demo: {a.demo}\n' if a.demo else "")
            + f'summary: "{a.summary or a.title}"\n'
            + "---\n\n" + a.body
        )
        dst = POSTS / f"{slug}.md"
        dst.write_text(body, encoding="utf-8")

    print(f"📝 포스트 저장: {dst.relative_to(ROOT)}")

    if a.demo:
        demo_src = ROOT / "public" / "demos" / a.demo
        if not demo_src.exists():
            print(f"⚠️ 데모 파일 없음: {demo_src} (임베드는 유지됨)")

    # 커밋 & 푸시
    git("add", "content/posts", "public/demos")
    msg = f'publish: {a.title or dst.stem}'
    git("commit", "-m", msg)
    if not a.no_push:
        r = git("push", "origin", "main")
        if "main" in (r.stdout or "") or r.returncode == 0:
            print("🚀 푸시 완료 — Vercel 배포 진행 중 (약 1분 후 반영)")
        else:
            print("⚠️ push 실패 — 나중에 수동 실행: cd dashboard && git push")

if __name__ == "__main__":
    main()

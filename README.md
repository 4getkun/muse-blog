# Museのブログ

Muse が書くブログ。Hugo + Cloudflare Pages、公開先は https://blog.fourgetkun.com/

## 仕組み

- 記事は `content/posts/YYYY-MM-DD-slug.md` の Markdown
- GitHub リポジトリ `4getkun/muse-blog` に push すると Cloudflare Pages が自動ビルドして公開
- テーマは外部に頼らず、このリポジトリの `layouts/` + `static/css/style.css` のみ。更新する依存は存在しない
- サイト名は仮置き。変える場合は `hugo.toml` の `title` を1行直すだけ

## Cloudflare Pages の設定（初回だけ）

1. GitHub でリポジトリ `muse-blog` を作り、このフォルダを push する
2. Cloudflare ダッシュボード → Workers & Pages → Create → Pages → Connect to Git → 上のリポジトリを選ぶ
3. ビルド設定:
   - Framework preset: **Hugo**
   - Build command: `hugo`
   - Build output directory: `public`
   - Production branch: `main`
   - Environment variable: `HUGO_VERSION` = `0.152.2`
4. デプロイ完了後、プロジェクトの **Custom domains** → Set up a domain → `blog.fourgetkun.com`
   - fourgetkun.com の DNS が Cloudflare 管理下ならレコードは自動で入る
   - そうでない場合は DNS 側で CNAME を1本追加: `blog` → `<プロジェクト名>.pages.dev`

## 記事を書く（Muse の作業手順）

1. `content/posts/` に Markdown を追加（front matter: title / date / tags / description）
2. ローカルで `hugo` を回してビルドが通ることを確認（未来日付の記事は Hugo が公開をスキップするので date は過去〜現在にする）
3. commit & push → 数十秒後に公開

## ローカル確認

```sh
hugo server   # http://localhost:1313 でプレビュー
hugo          # public/ にビルド
```

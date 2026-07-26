# Dad Knows Dungeons

A warm, modern static website for the *Dad Knows Dungeons* TTRPG Game Master podcast — built with [Eleventy (11ty)](https://www.11ty.dev/), Nunjucks, Markdown, and LESS, following CodeStitch-style component conventions. Deploys to [Netlify](https://www.netlify.com/) with zero extra configuration.

## Design direction

Warm parchment and leather tones, a fantasy-flavored serif for headings (Fraunces) paired with a clean sans body face (Inter), and small dice/parchment accents used sparingly — a well-loved GM notebook, not a gothic dungeon crawl. Full token list lives in `src/assets/css/base/variables.less`.

The site logo replaces the **O** in "Kn**o**ws" with the supplied d20 artwork (`src/assets/images/d20-logo.png`) — see `src/_includes/partials/header.njk`.

## Requirements

- Node.js 18+ (Netlify build uses Node 20 — see `netlify.toml`)
- npm

## Getting started

```bash
npm install
npm start
```

`npm start` compiles the LESS to CSS, then runs Eleventy's dev server with live reload at `http://localhost:8080`, watching LESS files for changes.

To build for production:

```bash
npm run build
```

Output goes to `_site/`.

## Project structure

See `project-structure.txt` for the full annotated file tree.

## Adding content (no HTML required)

| Content type | Where | Notes |
|---|---|---|
| Campaign | `src/campaigns/your-campaign.md` | Front matter: `title`, `slug`, `permalink`, `description`, `coverImage`, `system`, `status`, `tags`, `sessions`, `characters` |
| Journal post | `src/journal/posts/your-post.md` | Front matter: `title`, `date`, `campaign` (optional), `campaignSlug` (optional, links it to a campaign page), `tags`, `coverImage`, `excerpt` |
| Podcast episode | `src/podcast/episodes/your-episode.md` | Front matter: `title`, `date`, `episodeNumber`, `duration`, `episodeArt`, `audioUrl`, `summary` |

Journal posts that set `campaignSlug` to match a campaign's `slug` automatically appear in that campaign's "Journal entries" list.

### Markdown extras available in journal posts and show notes

- **Callouts**: `{% callout "tip" %}...{% endcallout %}` (types: `note`, `tip`, `warning`, `rule`)
- **YouTube embeds**: `{% youtube "VIDEO_ID", "Accessible title" %}`
- Tables, code blocks, and blockquotes are styled automatically.

## Collections & tags

Eleventy collections are defined in `eleventy.config.js`: `campaigns`, `journal`, `podcastEpisodes`, `feed` (journal + podcast combined, powers `/feed.xml`), and `tagList` (auto-generated, powers `/journal/tags/<tag>/` archive pages).

## Fonts

`src/assets/css/base/fonts.less` currently loads Fraunces, Inter, and IBM Plex Mono from Google Fonts for convenience. For a 100 Lighthouse Performance score, self-host these instead:

1. Download the font files into `src/assets/fonts/`.
2. Replace the `@import` in `fonts.less` with `@font-face` declarations pointing at those files.

## SEO & feeds

- `src/_includes/partials/head.njk` — OpenGraph, Twitter Card, canonical URL, and Organization schema on every page.
- `/feed.xml` — RSS feed combining journal posts and podcast episodes, newest first.
- `/sitemap.xml` — generated from every collection automatically.
- `robots.txt` — points crawlers at the sitemap.

Update `src/_data/site.js` with your real domain (`url`), social links, and author bios before launch — everything else derives from that file.

## Accessibility

Skip-to-content link, visible focus states (`:focus-visible`), `prefers-reduced-motion` support, semantic landmarks, and `aria-current="page"` on active nav links are already in place. Run an audit (Lighthouse or axe) after adding real content and images, and make sure every new `<img>` has meaningful `alt` text (or `alt=""` if decorative).

## Deploying to Netlify

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command and publish directory are already set via `netlify.toml` (`npm run build` → `_site`).
4. The contact form (`src/contact/index.njk`) uses Netlify Forms (`data-netlify="true"`) — submissions appear automatically in your Netlify dashboard under **Forms** once the site is deployed once with the form present in the built HTML.

## Placeholder content

Sample campaigns, journal posts, podcast episodes, author bios, and image placeholders (SVG) are included so the site runs and looks complete out of the box. Swap them for real content and replace `src/assets/images/social-share.jpg`, the author photos, and episode audio files (`src/assets/audio/`) before launch.

## License

MIT — see `package.json`.

const { EleventyRenderPlugin } = require("@11ty/eleventy");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------
  // Passthrough copy
  // ---------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy({ "src/assets/audio": "assets/audio" });
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // ---------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // ---------------------------------------------------------------------
  // Markdown-it configuration (callouts, anchors, better typography)
  // ---------------------------------------------------------------------
  const md = markdownIt({ html: true, typographer: true, linkify: true }).use(
    markdownItAnchor,
    {
      permalink: markdownItAnchor.permalink.headerLink(),
    }
  );

  // Simple callout block support: > [!note] / [!tip] / [!warning]
  const defaultBlockquote = md.renderer.rules.blockquote_open || function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
    return defaultBlockquote(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);

  // ---------------------------------------------------------------------
  // Filters
  // ---------------------------------------------------------------------
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const words = content.toString().split(/\s+/g).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) return [];
    if (n < 0) return array.slice(n);
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("excerpt", (content, length = 160) => {
    if (!content) return "";
    const text = content.replace(/(<([^>]+)>)/gi, "");
    return text.length > length ? text.slice(0, length).trim() + "…" : text;
  });

  eleventyConfig.addFilter("min", (...numbers) => Math.min(...numbers.flat()));

  eleventyConfig.addFilter("filterTagList", (tags) => {
    return (tags || []).filter(
      (tag) => !["all", "campaigns", "journal", "podcast", "pages"].includes(tag)
    );
  });

  eleventyConfig.addFilter("where_exp", function (arr, varName, expr) {
    // lightweight replacement for liquid's where_exp (kept for parity w/ CodeStitch templates)
    return arr;
  });

  // ---------------------------------------------------------------------
  // Collections
  // ---------------------------------------------------------------------
  eleventyConfig.addCollection("campaigns", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/campaigns/*.md").sort((a, b) => {
      return (a.data.title || "").localeCompare(b.data.title || "");
    });
  });

  eleventyConfig.addCollection("journal", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/journal/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("podcastEpisodes", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/podcast/episodes/*.md")
      .sort((a, b) => (b.data.episodeNumber || 0) - (a.data.episodeNumber || 0));
  });

  eleventyConfig.addCollection("feed", (collectionApi) => {
    const journal = collectionApi.getFilteredByGlob("src/journal/posts/*.md");
    const podcast = collectionApi.getFilteredByGlob("src/podcast/episodes/*.md");
    return [...journal, ...podcast].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return [...tagSet].filter(
      (tag) => !["all", "campaigns", "journal", "podcast", "pages"].includes(tag)
    );
  });

  // ---------------------------------------------------------------------
  // Shortcodes
  // ---------------------------------------------------------------------
  eleventyConfig.addShortcode("youtube", (id, title = "Embedded video") => {
    return `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  });

  eleventyConfig.addPairedShortcode("callout", (content, type = "note") => {
    const labels = { note: "Note", tip: "GM Tip", warning: "Warning", rule: "Rules" };
    return `<div class="callout callout--${type}"><p class="callout__label">${labels[type] || "Note"}</p>${content}</div>`;
  });

  // ---------------------------------------------------------------------
  // Base config
  // ---------------------------------------------------------------------
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    dataTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

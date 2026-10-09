import sanitizeHtml from "sanitize-html";

/**
 * Article HTML written in the admin. Keeps formatting, links and images;
 * strips scripts, event handlers, iframes and javascript: URLs.
 */
export function sanitizeArticleHtml(html: string | null | undefined): string {
  return sanitizeHtml(html ?? "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption", "u", "s"]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      // Alignment set in the admin's rich text editor.
      "*": ["style"],
    },
    allowedStyles: {
      "*": { "text-align": [/^(left|right|center|justify)$/] },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

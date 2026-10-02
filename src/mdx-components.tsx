import type { MDXComponents } from "mdx/types";

// Required by @next/mdx. Global element overrides for every MDX post.
const components: MDXComponents = {
  a: ({ href = "", ...props }) => (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}

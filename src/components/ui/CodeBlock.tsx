import { codeSamples, type CodeSampleId } from "@/content/code";
import { repo } from "@/content/framework";
import type { Dictionary } from "@/i18n/types";
import { highlight } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

export async function CodeBlock({
  id,
  dict,
  title,
  showSource = true,
}: {
  id: CodeSampleId;
  dict: Dictionary;
  title?: string;
  showSource?: boolean;
}) {
  const sample = codeSamples[id];
  const html = await highlight(sample.code, sample.lang);
  const sourcePath = sample.source.split(" ")[0];
  const sourceHref = sourcePath.includes(".") ? `${repo.blob}/${sourcePath}` : `${repo.tree}/${sourcePath}`;

  return (
    <figure className="code-frame my-0">
      <figcaption className="flex items-center justify-between gap-3 border-b border-[var(--code-line)] px-3 py-1.5">
        <span className="min-w-0 truncate font-mono text-xs text-subtle">
          {title ?? sample.lang}
        </span>
        <CopyButton
          text={sample.code}
          labels={{ copy: dict.a11y.copyCode, copied: dict.a11y.copied, failed: dict.a11y.copyFailed }}
        />
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {showSource ? (
        <p className="border-t border-[var(--code-line)] px-3 py-1.5 text-xs text-subtle">
          <span dir="auto">{dict.common.sourceFile}</span>{" "}
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono [overflow-wrap:anywhere] underline decoration-[var(--line-strong)] underline-offset-2 hover:text-fg"
          >
            supercore/{sample.source}
            <span className="sr-only"> {dict.a11y.newTab}</span>
          </a>
        </p>
      ) : null}
    </figure>
  );
}

import { Icon } from "@/components/ui/Icon";

export function DocHeading({
  id,
  title,
  anchorLabel,
  level = 2,
}: {
  id: string;
  title: string;
  anchorLabel: string;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag id={id}>
      {title}
      <a href={`#${id}`} className="heading-anchor">
        <Icon name="hash" size={level === 2 ? 18 : 15} />
        <span className="sr-only">
          {anchorLabel}: {title}
        </span>
      </a>
    </Tag>
  );
}

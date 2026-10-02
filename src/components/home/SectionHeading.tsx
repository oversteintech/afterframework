export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  className = "",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`} className="display mt-4 text-3xl sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lead ? <p className="lead mt-5">{lead}</p> : null}
    </div>
  );
}

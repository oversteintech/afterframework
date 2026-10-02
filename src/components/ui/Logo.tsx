/** Stacked-layer mark: product module on top of two product lines on one kernel. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="30" height="30" rx="7" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="12.5" y="6.5" width="7" height="5" rx="1.2" fill="var(--accent)" />
      <rect x="6.5" y="14" width="8.5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="17" y="14" width="8.5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.5" />
      <rect x="6.5" y="21.5" width="19" height="4.5" rx="1.2" fill="currentColor" />
      <path d="M16 11.5V14" stroke="var(--accent)" strokeWidth="1.5" />
    </svg>
  );
}

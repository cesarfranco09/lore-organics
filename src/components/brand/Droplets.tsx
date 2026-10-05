/** Absorbency droplets (1–3 filled out of 3), as printed on the boxes. */
const Droplets = ({
  count,
  size = 12,
  color = "currentColor",
  total = 3,
}: {
  count: number;
  size?: number;
  color?: string;
  total?: number;
}) => (
  <span className="inline-flex items-center gap-[0.3em]" role="img" aria-label={`${count}/${total}`}>
    {Array.from({ length: total }, (_, i) => (
      <svg key={i} width={size} height={size * 1.3} viewBox="0 0 10 13" aria-hidden="true">
        <path
          d="M5 0.8 C5 0.8 1 5.6 1 8.4 A4 4 0 0 0 9 8.4 C9 5.6 5 0.8 5 0.8 Z"
          fill={i < count ? color : "none"}
          stroke={color}
          strokeWidth={0.9}
          opacity={i < count ? 1 : 0.55}
        />
      </svg>
    ))}
  </span>
);

export default Droplets;

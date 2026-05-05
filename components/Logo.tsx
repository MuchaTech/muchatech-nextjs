/**
 * MuchaTech Logo
 *
 * variant="dark"  → logo.png  (original, black bg blends into dark surfaces)
 * variant="light" → logo-light.png (new transparent logo for light surfaces)
 */

interface LogoProps {
  height?: number;
  variant?: "light" | "dark";
  className?: string;
}

export default function Logo({
  height = 36,
  variant = "dark",
  className = "",
}: LogoProps) {
  const src =
    variant === "light" ? "/images/logo-light.png" : "/images/logo.png";

  return (
    <img
      src={src}
      alt="MuchaTech"
      height={height}
      style={{
        height,
        width: "auto",
        display: "block",
        filter: variant === "dark" ? "brightness(1.05)" : "none",
      }}
      className={className}
    />
  );
}

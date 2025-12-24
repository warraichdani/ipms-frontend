type BrandLogoProps = {
  name?: string;
  size?: "sm" | "md" | "lg";
};

export function BrandLogo({ name = "Dairy", size = "md" }: BrandLogoProps) {
  const sizeMap = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  } as const;

  return (
    <div
      className={`font-bold ${sizeMap[size]} text-brand-600 dark:text-brand-400`}
    >
      {name}
    </div>
  );
}

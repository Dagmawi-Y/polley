// Simple utility to combine class names (shadcn-style cn)
export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(" ");
}

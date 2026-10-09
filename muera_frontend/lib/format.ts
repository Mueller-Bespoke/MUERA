export function formatPrice(price: number): string {
  // Whole francs read cleaner ("CHF 1'490"); anything with cents shows both digits ("CHF 317.50").
  const whole = Number.isInteger(Math.round(price * 100) / 100);
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(price);
}

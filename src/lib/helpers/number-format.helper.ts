const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function numberToUsd(value: number): string {
  return usdFormatter.format(value);
}

export function toOptionalFixed(value: number, digits: number): string {
  return parseFloat(value.toFixed(digits)).toFixed(digits);
}

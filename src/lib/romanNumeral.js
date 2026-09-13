/** Chapter numbers in the old page heading. */

const ONES = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
const TENS = ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"];
const HUNDREDS = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"];

export function romanNumeral(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1 || n > 3999) return String(value ?? "");
  return `${HUNDREDS[Math.floor(n / 100) % 10]}${TENS[Math.floor(n / 10) % 10]}${ONES[n % 10]}`;
}

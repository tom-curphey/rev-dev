export default function roundNumber(value, decimals) {
  if (value === 0 || value === '0' || value === '') {
    return '';
  }
  return Number(
    Math.round(+value + 'e' + decimals) + 'e-' + decimals
  );
}

export default function calcTimeToSecond(time, unit) {
  let seconds = null;
  switch (unit) {
    case 'sec':
      seconds = time;
      break;
    case 'min':
      seconds = time * 60;
      break;
    case 'hour':
      seconds = time * 60 * 60;
      break;
    default:
      seconds = null;
  }
  return seconds;
}

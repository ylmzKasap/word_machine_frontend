export function randint(fromN: number, toN: number) {
  return Math.floor(Math.random() * (toN - fromN + 1)) + fromN;
}

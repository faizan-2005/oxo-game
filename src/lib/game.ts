export type C = "X" | "O" | null;
export type B = C[];

const L = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const win = (b: B) => {
  for (const [a, c, d] of L) if (b[a] && b[a] === b[c] && b[a] === b[d]) return { p: b[a] as "X" | "O", l: [a, c, d] };
  return null;
};

export const draw = (b: B) => b.every(Boolean) && !win(b);

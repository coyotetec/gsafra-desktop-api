export function executeFomula(formula: string) {
  const result: number = eval(formula);

  return result.toFixed(2);
}

function Somar(...numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr);
}

function Subtrair(...numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr);
}

function Media(...numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr) / numbers.length;
}

function Maior(...numbers: number[]) {
  return Math.max(...numbers);
}
function Menor(...numbers: number[]) {
  return Math.min(...numbers);
}



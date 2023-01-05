interface Data {
  id: number;
  nome: string;
  total: number;
  totalReal: number;
}

export function dataHasZero(data: Data[]) {
  let hasZeroValue = false;

  for (const item of data) {
    if (item.total === 0) {
      hasZeroValue = true;
      break;
    }
  }

  return hasZeroValue;
}

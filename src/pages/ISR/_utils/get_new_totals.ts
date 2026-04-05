export function getDeductionsTotal(
  currentTopTab: string,
  currentTotals: any
): { Importe: number; importe: number;  isr_cargo: number } | undefined {
  if (currentTopTab === "incomes") {
    return currentTotals?.deductions ?? undefined;
  }

  const totals = currentTotals && Array.isArray(currentTotals.totalsDeductions)
    ? currentTotals.totalsDeductions
    : [];

  return totals.find(
    (value: { concepto: string }) =>
      value?.concepto === "Deducciones autorizadas sin inversiones"
  );
}

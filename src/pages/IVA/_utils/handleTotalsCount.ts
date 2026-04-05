export function handleTotalsCount(
  isYearly: boolean,
  iva: IVAResponse | undefined,
  type: "creditable" | "transferred"
) {
  if (isYearly && iva && type === "transferred") {
    const data = iva.exercise.transferred;
    return {
      cash: data.i_tra?.qty,
      credit: data.p_tra?.qty,
      withholdingCash: data.prev_i_ret?.qty,
      withholdingCredit: data.prev_p_ret?.qty,
      excluded: data?.excluded_qty,
      moved: data?.moved_qty,
      creditNotes: data?.credit_notes.qty,
    };
  } else if (isYearly && iva && type === "creditable") {
    const data = iva.exercise.creditable;
    return {
      cash: data.i_tra?.qty,
      credit: data.p_tra?.qty,
      withholdingCash: data.prev_i_ret?.qty,
      withholdingCredit: data.prev_p_ret?.qty,
      excluded: data?.excluded_qty,
      moved: data?.moved_qty,
      creditNotes: data?.credit_notes.qty,
    };
  }
  if (!isYearly && iva && type === "transferred") {
    const data = iva.period.transferred;
    return {
      cash: data.i_tra?.qty,
      credit: data.p_tra?.qty,
      withholdingCash: data.prev_i_ret?.qty,
      withholdingCredit: data.prev_p_ret?.qty,
      excluded: data?.excluded_qty,
      moved: data?.moved_qty,
      creditNotes: data?.credit_notes.qty,
    };
  } else if (!isYearly && iva && type === "creditable") {
    const data = iva.period.creditable;
    return {
      cash: data.i_tra?.qty,
      credit: data.p_tra?.qty,
      withholdingCash: data.prev_i_ret?.qty,
      withholdingCredit: data.prev_p_ret?.qty,
      excluded: data?.excluded_qty,
      moved: data?.moved_qty,
      creditNotes: data?.credit_notes.qty,
    };
  }
  return {
    cash: 0,
    credit: 0,
    withholdingCash: 0,
    withholdingCredit: 0,
    excluded: 0,
    moved: 0,
    creditNotes: 0,
  };
}

import { ITotalsResponse } from "../_types/TotalsType";

export function manageTotalsDataContent(
  response: IVAResponse | undefined,
  isYearly: boolean,
  periodToDisplay: string,
  pastPeriodToDisplay: string,
  modalType: "creditable" | "transferred"
): ITotalsResponse {
  const preData = isYearly ? response?.exercise : response?.period;
  const data = modalType === "transferred" ? preData?.transferred : preData?.creditable;
  if (response === undefined) {
    return {
      cash: {
        key: 1,
        context: "",
        period: periodToDisplay,
        totalCfdis: 0,
        PaymentRelatedCount: 0,
        totalIVAHoldings: 0,
        baseIVA16: 0,
        baseIVA8: 0,
        baseIVA0: 0,
        baseExemptIVA: 0,
        creditableOrTransferredIVA16: 0,
        creditableOrTransferredIVA8: 0,
        IVAHoldings: Math.abs(0),
        totalCreditableOrTransferredIVA: 0,
      },
      credit: {
        key: 2,
        context: "",
        period: periodToDisplay,
        totalCfdis: 0,
        PaymentRelatedCount: 0,
        totalIVAHoldings: 0,
        baseIVA16: 0,
        baseIVA8: 0,
        baseIVA0: 0,
        baseExemptIVA: 0,
        creditableOrTransferredIVA16: 0,
        creditableOrTransferredIVA8: 0,
        IVAHoldings: Math.abs(0),
        totalCreditableOrTransferredIVA: 0,
      },
      creditNotes: {
        key: 3,
        context: "",
        period: periodToDisplay,
        totalCfdis: 0,
        PaymentRelatedCount: 0,
        totalIVAHoldings: 0,
        baseIVA16: 0,
        baseIVA8: 0,
        baseIVA0: 0,
        baseExemptIVA: 0,
        creditableOrTransferredIVA16: 0,
        creditableOrTransferredIVA8: 0,
        IVAHoldings: Math.abs(0),
        totalCreditableOrTransferredIVA: Math.abs(0),
      },
    };
  }
  const totalsDataContent: ITotalsResponse = {
    cash: {
      key: 1,
      context: "",
      period: periodToDisplay,
      totalCfdis: data ? data.i_tra?.qty : 0,
      PaymentRelatedCount: data ? data.i_tra?.PaymentRelatedCount : 0,
      totalIVAHoldings: data ? data.i_tra?.RetencionesIVAMXN : 0,
      baseIVA16: data ? data.i_tra?.BaseIVA16 : 0,
      baseIVA8: data ? data.i_tra?.BaseIVA8 : 0,
      baseIVA0: data ? data.i_tra?.BaseIVA0 : 0,
      baseExemptIVA: data ? data.i_tra?.BaseIVAExento : 0,
      creditableOrTransferredIVA16: data ? data.i_tra?.IVATrasladado16 : 0,
      creditableOrTransferredIVA8: data ? data.i_tra?.IVATrasladado8 : 0,
      IVAHoldings: data ? Math.abs(data.i_tra?.RetencionesIVAMXN) : 0,
      totalCreditableOrTransferredIVA: data ? data.i_tra?.total : 0,
    },
    credit: {
      key: 2,
      context: "",
      period: periodToDisplay,
      totalCfdis: data ? data.p_tra?.qty : 0,
      PaymentRelatedCount: data ? data.p_tra?.PaymentRelatedCount : 0,
      totalIVAHoldings: data ? data.p_tra?.RetencionesIVAMXN : 0,
      baseIVA16: data ? data.p_tra?.BaseIVA16 : 0,
      baseIVA8: data ? data.p_tra?.BaseIVA8 : 0,
      baseIVA0: data ? data.p_tra?.BaseIVA0 : 0,
      baseExemptIVA: data ? data.p_tra?.BaseIVAExento : 0,
      creditableOrTransferredIVA16: data ? data.p_tra?.IVATrasladado16 : 0,
      creditableOrTransferredIVA8: data ? data.p_tra?.IVATrasladado8 : 0,
      IVAHoldings: data ? Math.abs(data.p_tra?.RetencionesIVAMXN) : 0,
      totalCreditableOrTransferredIVA: data ? data.p_tra?.total : 0,
    },
    creditNotes: {
      key: 3,
      context: "",
      period: periodToDisplay,
      totalCfdis: data ? data.credit_notes?.qty : 0,
      PaymentRelatedCount: data ? data.credit_notes?.PaymentRelatedCount : 0,
      totalIVAHoldings: data ? data.credit_notes?.RetencionesIVAMXN : 0,
      baseIVA16: data ? data.credit_notes?.BaseIVA16 : 0,
      baseIVA8: data ? data.credit_notes?.BaseIVA8 : 0,
      baseIVA0: data ? data.credit_notes?.BaseIVA0 : 0,
      baseExemptIVA: data ? data.credit_notes?.BaseIVAExento : 0,
      creditableOrTransferredIVA16: data ? data.credit_notes?.IVATrasladado16 : 0,
      creditableOrTransferredIVA8: data ? data.credit_notes?.IVATrasladado8 : 0,
      IVAHoldings: data ? data.credit_notes?.RetencionesIVAMXN : 0,
      totalCreditableOrTransferredIVA: data ? Math.abs(data?.credit_notes.total) : 0,
      // totalCreditableOrTransferredIVA: data
      //   ? data.credit_notes?.BaseIVA0 +
      //     data.credit_notes?.BaseIVA8 +
      //     data.credit_notes?.BaseIVA16 +
      //     data.credit_notes?.BaseIVAExento +
      //     data.credit_notes?.IVATrasladado8 +
      //     data.credit_notes?.IVATrasladado16 -
      //     data.credit_notes?.RetencionesIVAMXN
      //   : 0,
    },
  };

  return totalsDataContent;
}
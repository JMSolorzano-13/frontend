import { recordType, totalsRecordType } from "./IVATotalColumns";

interface propsType {
  modalType: "creditable" | "transferred";
  data: totalsRecordType;
}

export const getIVATotalRows = (props: propsType): recordType[] => {
  const { modalType, data } = props;
  const { cash, credit, creditNotes: incomingCreditnotes } = data;

  const cashInvoice: recordType = {
    key: 1,
    context: "Facturas de contado",
    totalCfdis: cash.totalCfdis,
    PaymentRelatedCount: cash.PaymentRelatedCount,
    baseIVA16: cash.baseIVA16,
    baseIVA8: cash.baseIVA8,
    baseIVA0: cash.baseIVA0,
    baseExemptIVA: cash.baseExemptIVA,
    creditableOrTransferredIVA16: cash.creditableOrTransferredIVA16,
    creditableOrTransferredIVA8: cash.creditableOrTransferredIVA8,
    IVAHoldings: cash.IVAHoldings,
    totalCreditableOrTransferredIVA: cash.totalCreditableOrTransferredIVA,
  };

  const creditInvoice = {
    key: 2,
    context: `${modalType === "creditable" ? "Pago" : "Cobro"} facturas de crédito`,
    totalCfdis: credit.totalCfdis,
    PaymentRelatedCount: credit.PaymentRelatedCount,
    baseIVA16: credit.baseIVA16,
    baseIVA8: credit.baseIVA8,
    baseIVA0: credit.baseIVA0,
    baseExemptIVA: credit.baseExemptIVA,
    creditableOrTransferredIVA16: credit.creditableOrTransferredIVA16,
    creditableOrTransferredIVA8: credit.creditableOrTransferredIVA8,
    IVAHoldings: credit.IVAHoldings,
    totalCreditableOrTransferredIVA: credit.totalCreditableOrTransferredIVA,
  };

  const newTotals = {
    key: 3,
    context: "Totales",
    totalCfdis: cash.totalCfdis + credit.totalCfdis,
    PaymentRelatedCount: 0,
    baseIVA16: (cash.baseIVA16 ? cash.baseIVA16 : 0) + (credit.baseIVA16 ? credit.baseIVA16 : 0),
    baseIVA8: (cash.baseIVA8 ? cash.baseIVA8 : 0) + (credit.baseIVA8 ? credit.baseIVA8 : 0),
    baseIVA0: (cash.baseIVA0 ? cash.baseIVA0 : 0) + (credit.baseIVA0 ? credit.baseIVA0 : 0),
    baseExemptIVA:
      (cash.baseExemptIVA ? cash.baseExemptIVA : 0) +
      (credit.baseExemptIVA ? credit.baseExemptIVA : 0),
    creditableOrTransferredIVA16:
      (cash.creditableOrTransferredIVA16 ? cash.creditableOrTransferredIVA16 : 0) +
      (credit.creditableOrTransferredIVA16 ? credit.creditableOrTransferredIVA16 : 0),
    creditableOrTransferredIVA8:
      (cash.creditableOrTransferredIVA8 ? cash.creditableOrTransferredIVA8 : 0) +
      (credit.creditableOrTransferredIVA8 ? credit.creditableOrTransferredIVA8 : 0),
    IVAHoldings:
      (cash.IVAHoldings ? cash.IVAHoldings : 0) + (credit.IVAHoldings ? credit.IVAHoldings : 0),
    totalCreditableOrTransferredIVA: Math.abs(
      (cash.totalCreditableOrTransferredIVA ? cash.totalCreditableOrTransferredIVA : 0) +
        (credit.totalCreditableOrTransferredIVA ? credit.totalCreditableOrTransferredIVA : 0)
    ),
  };

  const creditNotes = {
    key: 4,
    context: "Notas de crédito",
    totalCfdis: incomingCreditnotes.totalCfdis,
    PaymentRelatedCount: incomingCreditnotes.PaymentRelatedCount,
    baseIVA16: incomingCreditnotes.baseIVA16,
    baseIVA8: incomingCreditnotes.baseIVA8,
    baseIVA0: incomingCreditnotes.baseIVA0,
    baseExemptIVA: incomingCreditnotes.baseExemptIVA,
    creditableOrTransferredIVA16: incomingCreditnotes.creditableOrTransferredIVA16,
    creditableOrTransferredIVA8: incomingCreditnotes.creditableOrTransferredIVA8,
    IVAHoldings: incomingCreditnotes.IVAHoldings,
    totalCreditableOrTransferredIVA: incomingCreditnotes.totalCreditableOrTransferredIVA
      ? Math.abs(incomingCreditnotes.totalCreditableOrTransferredIVA)
      : 0,
  };
  return [cashInvoice, creditInvoice, newTotals, creditNotes];
};

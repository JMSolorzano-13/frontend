export interface ITotalsPayload {
  key: number;
  context: string;
  period: string;
  totalCfdis: number;
  PaymentRelatedCount: number;
  totalIVAHoldings: number;
  baseIVA16: number;
  baseIVA8: number;
  baseIVA0: number;
  baseExemptIVA: number;
  creditableOrTransferredIVA16: number;
  creditableOrTransferredIVA8: number;
  IVAHoldings: number;
  totalCreditableOrTransferredIVA: number;
}

export interface ITotalsResponse {
  cash: ITotalsPayload;
  credit: ITotalsPayload;
  creditNotes: ITotalsPayload;
}

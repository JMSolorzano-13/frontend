import { useEffect, useState } from "react";
import { recordType } from "../_utils";
import { ITotalsResponse } from "../_types/TotalsType";

interface IHooksParams {
  tab: TabIVAType;
  ivaCFDIs: {
    cfdis: CFDI[];
    totals: CFDIsTotals | null;
    quantity: number;
  };
  totalsData: ITotalsResponse;
  iva?: IVAResponse;
}

export default function useGetTotals({ tab, ivaCFDIs, totalsData, iva }: IHooksParams) {
  const [state, setState] = useState<{
    totalsData: recordType[];
    totalMeta: number;
  }>({
    totalsData: [],
    totalMeta: 0,
  });
  useEffect(() => {
    async function checkTab() {
      // if (ivaCFDIs.cfdis.length === 0) {
      //   setState((state) => ({
      //     ...state,
      //     totalsData: [],
      //   }));
      //   return;
      // }
      switch (tab) {
        case "ALL": {
          setState((state) => ({
            ...state,
            totalsData: [],
            totalMeta: ivaCFDIs.quantity,
          }));
          break;
        }

        case "CASH": {
          setState((state) => ({
            ...state,
            totalsData: [totalsData.cash],
            totalMeta: ivaCFDIs.quantity,
          }));
          break;
        }

        case "CREDIT_NOTES": {
          setState((state) => ({
            ...state,
            totalsData: [totalsData.creditNotes],
            totalMeta: ivaCFDIs.quantity,
          }));
          break;
        }

        case "CREDIT": {
          setState((state) => ({
            ...state,
            totalsData: [totalsData.credit],
            totalMeta: ivaCFDIs.quantity,
          }));
          break;
        }

        default: {
          setState((state) => ({
            ...state,
            totalsData: [],
          }));
          break;
        }
      }
    }
    checkTab();
  }, [tab, iva]);

  return { ...state };
}

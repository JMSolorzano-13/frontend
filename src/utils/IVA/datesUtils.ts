import { Months } from "@utils/dateHelper";
import moment from "moment";
import l from "lodash";
import { InternalTabType, TabType } from "@pages/ISR/_types/ISRTypes";

export function isYearly(periodDates: string | null): boolean {
  if (periodDates) {
    const datesDifference = Math.abs(
      moment(periodDates.split("|")[0]).diff(moment(periodDates.split("|")[1]), "months")
    );
    return datesDifference === 12;
  }
  return false;
}

export function getISRPeriodToSend(tab: TabType, periodDates: string | null) {
  const initialDate = periodDates ? periodDates.split("T")[0] : "-";
  const ISR_TYPE: { [key: string]: string } = {
    ALL: initialDate,
    CASH: initialDate,
    CREDIT: initialDate,
    WITHHOLDINGCASH: moment.utc(initialDate).format("YYYY-MM-DD"),
    WITHHOLDINGCREDIT: moment.utc(initialDate).format("YYYY-MM-DD"),
  };
  return ISR_TYPE[tab];
}

export function getISRPeriodToSendWhenIsYear(tab: TabType, periodDates: string | null) {
  const initialDate = periodDates ? periodDates.split("T")[0] : "-";
  const ISR_TYPE: { [key: string]: string } = {
    ALL: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    CASH: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    CREDIT: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    WITHHOLDINGCASH: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    WITHHOLDINGCREDIT: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
  };
  return ISR_TYPE[tab];
}

export function getPeriodToSend(iva: TabIVAType, periodDates: string | null) {
  const initialDate = periodDates ? periodDates.split("T")[0] : "-";
  const IVA_TYPE: { [key: string]: string } = {
    ALL: initialDate,
    CASH: initialDate,
    CREDIT: initialDate,
    WITHHOLDINGCASH: moment.utc(initialDate).format("YYYY-MM-DD"),
    WITHHOLDINGCREDIT: moment.utc(initialDate).format("YYYY-MM-DD"),
    MOVED: initialDate,
    EXCLUDED: initialDate,
    CREDIT_NOTES: initialDate,
  };
  return IVA_TYPE[iva];
}

export function getPeriodToSendWhenIsYear(iva: TabIVAType, periodDates: string | null) {
  const initialDate = periodDates ? periodDates.split("T")[0] : "-";
  const IVA_TYPE: { [key: string]: string } = {
    ALL: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    CASH: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    CREDIT: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    WITHHOLDINGCASH: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    WITHHOLDINGCREDIT: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    MOVED: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    EXCLUDED: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
    CREDIT_NOTES: `${moment.utc(initialDate).format(`YYYY`)}-12-01`,
  };
  return IVA_TYPE[iva];
}

export function getISRTypeName(ivaType: TabType): string {
  const IVA_TYPE: { [key: string]: string } = {
    ALL: "Todos",
    CASH: "Facturas de contado",
    PAYMENT: `CFDI de pagos`,
    EXCLUDED: "No considerados ISR"
  };
  return IVA_TYPE[ivaType];
}

export function getISRTypeNameDeductions(tab: TabType, internalTab?: InternalTabType): string {
  const tabNameInternal = internalTab ? internalTab : tab;
  const ISR_TYPE: { [key: string]: string } = {
    ALL: "Todos",
    CASH: "Facturas de contado",
    PAYMENT: `Pagos`,
    DISCOUNTS:
      tabNameInternal === "DISCOUNTS-INCOMES"
        ? "Dev., desctos. y bonif. en ingresos emitidos"
        : "Dev., desctos. y bonif. en egresos emitidos",
    EGRESS: "Egresos recibidos",
    INVESTMENTS: "Inversiones",
    "EXCLUDED-PREFILLED":
      tabNameInternal === "EXCLUDED-PREFILLED-INCOMES" ? "Ingresos PUE" : "Pagos",
    EXCLUDED:
      tabNameInternal === "CASH"
        ? "Facturas de contado"
        : tabNameInternal === "PAYMENT"
        ? "Pagos"
        : internalTab === "EXCLUDED-INCOMES"
        ? "Ingresos"
        : internalTab === "EXCLUDED-EGRESS"
        ? "Egresos"
        : internalTab === "EXCLUDED-INCOMES-PUE"
        ? "Ingresos PUE"
        : internalTab === "EXCLUDED-PAYMENTS"
        ? "Pagos"
        : internalTab === "EGRESS"
        ? "Egresos recibidos"
        : "",
  };
  return ISR_TYPE[tab];
}

export function getIVAType(ivaType: TabIVAType): IVAAPITYPE {
  const IVA_TYPE: { [key: string]: IVAAPITYPE } = {
    ALL: "all",
    CASH: "i_tra",
    CREDIT: "p_tra",
    WITHHOLDINGCASH: "prev_i_ret",
    WITHHOLDINGCREDIT: "prev_p_ret",
    MOVED: "moved",
    EXCLUDED: "excluded",
    CREDIT_NOTES: "credit_notes",
  };
  return IVA_TYPE[ivaType];
}
export function getIVATypeName(ivaType: TabIVAType, issued: boolean): string {
  const IVA_TYPE: { [key: string]: string } = {
    ALL: "Todos",
    CASH: "Facturas de contado",
    CREDIT: `${issued ? "Cobro" : "Pago"} facturas de crédito`,
    WITHHOLDINGCASH: "Retenciones facturas de contado",
    WITHHOLDINGCREDIT: `${issued ? "Cobro" : "Pago"} retenciones facturas de crédito`,
    CREDIT_NOTES: "Notas de crédito",
    EXCLUDED: "No considerados IVA",
    MOVED: "Periodo de IVA reasignado",
  };

  return IVA_TYPE[ivaType];
}

export function isPeriodEqual(
  periodDates: string | null,
  period: string[] | undefined,
  datesDifference: boolean
): boolean {
  if (!datesDifference) {
    if (periodDates && period) {
      const periodFromSelector = periodDates.split("T")[0].split("-");
      const finalPeriodFromURL =
        period[0] +
        "-" +
        Object.keys(Months)
          .find((key) => Months[parseInt(key)] === l.startCase(period[1]))
          ?.toString()
          .padStart(2, "0");
      const finalPeriodFromSelector = periodFromSelector[0] + "-" + periodFromSelector[1];

      if (finalPeriodFromSelector === finalPeriodFromURL) {
        return true;
      }
    }
  } else if (datesDifference) {
    if (periodDates && period) {
      const periodFromSelector = periodDates.split("T")[0].split("-");
      const finalPeriodFromURL = period[0] + "-01";
      const finalPeriodFromSelector = periodFromSelector[0] + "-" + periodFromSelector[1];

      if (finalPeriodFromSelector === finalPeriodFromURL) {
        const finalYearFromSelector = finalPeriodFromSelector.split("-")[0];
        const finalYearFromURL = finalPeriodFromURL.split("-")[0];

        if (finalYearFromSelector === finalYearFromURL) {
          return true;
        }
      }
    }
  }

  return false;
}

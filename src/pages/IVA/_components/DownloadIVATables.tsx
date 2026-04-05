import { Tooltip, Button, Dropdown } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getExportToExcel } from "@store/ivaSlice/exportIVATable";
import { authSelector } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import { commonSelector } from "@store/common";
import {
  getIVAType,
  isYearly,
  getIVATypeName,
  getPeriodToSend,
  getPeriodToSendWhenIsYear,
} from "@utils/IVA/datesUtils";
import { cfdiSelector } from "@store/cfdiSlice";
import moment from "moment";

type DownloadIVATablesType = {
  issued: boolean;
  iva: TabIVAType;
  totalsCount: {
    cash: number;
    credit: number;
    withholdingCash: number;
    withholdingCredit: number;
    excluded: number;
    moved: number;
    creditNotes: number;
  };
};

export default function DownloadIVATables({ issued, iva, totalsCount }: DownloadIVATablesType) {
  const { company } = useSelector(authSelector);
  const dispatch = useAppDispatch();
  const { periodDates } = useSelector(commonSelector);
  const { isFetchingIVAExports } = useSelector(cfdiSelector);
  const year = isYearly(periodDates);
  const dateToSend = year
    ? getPeriodToSendWhenIsYear(iva, periodDates)
    : getPeriodToSend(iva, periodDates);

  const getIVADomain = () => {
    if (iva !== "ALL" && iva !== "EXCLUDED" && issued) {
      return;
    }
    const dates = periodDates?.split("|") ?? [];
    const startDate = `${moment.utc(dates[0]).format("YYYY-MM-DD")}T00:00:00.000`;
    const endDate = `${moment.utc(dates[1]).format("YYYY-MM-DD")}T00:00:00.000`;

    const payload = [
      ["company_identifier", "=", company],
      ["Estatus", "=", true],
      ["is_issued", "=", false],
      ["TipoDeComprobante", "in", ["I", "E"]],
      ["ExcludeFromIVA", "=", iva === "EXCLUDED" ? true : false],
      ["PaymentDate", ">=", startDate],
      ["PaymentDate", "<", endDate],
      ["Version", "=", "4.0"],
    ];

    return payload;
  };

  async function manageExport(specialExport = false) {
    const IVAType = getIVAType(iva);
    if (company && periodDates) {
      dispatch(
        getExportToExcel({
          company_identifier: company,
          issued,
          period: dateToSend ?? "",
          yearly: year,
          iva: specialExport ? "OpeConTer" : IVAType,
          ...((iva === "EXCLUDED" || (iva === "ALL" && !specialExport)) &&
            !issued && { domain: getIVADomain() as DomainItem }),
          order_by: specialExport ? "" : '"Fecha de pago" desc',
        })
      );
    }
  }
  function manageDisabledButton(): boolean {
    if (iva === "ALL") {
      const total =
        (totalsCount.cash || 0) +
        (totalsCount.credit || 0) +
        (totalsCount.withholdingCash || 0) +
        (totalsCount.withholdingCredit || 0);
      return total === 0;
    }
    if (iva === "CASH") {
      return (totalsCount.cash ?? 0) === 0;
    }
    if (iva === "CREDIT") {
      return (totalsCount.credit ?? 0) === 0;
    }
    if (iva === "WITHHOLDINGCASH") {
      return (totalsCount.withholdingCash ?? 0) === 0;
    }
    if (iva === "WITHHOLDINGCREDIT") {
      return (totalsCount.withholdingCredit ?? 0) === 0;
    }
    if (iva === "EXCLUDED") {
      return (totalsCount.excluded ?? 0) === 0;
    }
    if (iva === "CREDIT_NOTES") {
      return (totalsCount.creditNotes ?? 0) === 0;
    }
    if (iva === "MOVED") {
      return (totalsCount.moved ?? 0) === 0;
    }
    return false;
  }

  const menuTotals = [
    {
      key: "export-totals",
      label: "Exportar Totales",
      onClick: () => manageExport(),
      disabled: manageDisabledButton(),
    },
    {
      key: "export-creditable",
      label: "Exportar operaciones con terceros",
      onClick: () => manageExport(true),
      disabled: manageDisabledButton(),
    },
  ];

  const ExportTotalsButton = () => {
    return (
      <Dropdown menu={{ items: menuTotals }} placement="bottomRight">
        <Button
          icon={<DownloadOutlined />}
          loading={isFetchingIVAExports}
          disabled={manageDisabledButton()}
        >
          Exportar a Excel
        </Button>
      </Dropdown>
    );
  };

  const ExportDefaultButton = () => {
    return (
      <Tooltip title={`Exportar ${getIVATypeName(iva, issued)}`}>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => manageExport()}
          loading={isFetchingIVAExports}
          disabled={manageDisabledButton()}
        >
          Exportar a Excel
        </Button>
      </Tooltip>
    );
  };

  return iva === "ALL" && !issued ? <ExportTotalsButton /> : <ExportDefaultButton />;
}

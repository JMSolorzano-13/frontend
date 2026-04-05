import { Tooltip, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { exportISRTable } from "../_state/actions";
import { authSelector } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import { getISRTypeName, getISRTypeNameDeductions } from "@utils/IVA/datesUtils";
import getPeriodToSend from "../_utils/getPeriodToSend";
import { InternalTabType, TabType, TopTabSectionType, ISRRecordType } from "../_types/ISRTypes";
import { ISRSelector } from "../_state/ISRSlice";
import { getISRStatusButton } from "../_utils/getISRStatusButton";

type DownloadIVATablesType = {
  issued: boolean;
  tab: TabType;
  isExercise: boolean;
  date: string | null;
  periodType: string | null;
  topTab: TopTabSectionType;
  internalTab: InternalTabType;
  cfdis: ISRRecordType[];
};

type TISR = "all" | "invoice_pue" | "payments" | "excluded";

export default function DownloadISRTables({
  issued,
  tab,
  isExercise,
  date,
  periodType,
  topTab,
  internalTab,
}: // cfdis,
DownloadIVATablesType) {
  const { company } = useSelector(authSelector);
  const dispatch = useAppDispatch();
  const {
    isFetchingISRExports,
    ISRCFDIs,
    fetchingTotals,
    fetchingTotalsDeductions,
    ISRTotalsDeductionsTable,
  } = useSelector(ISRSelector);
  const year = periodType === "year";
  const dateToSend = getPeriodToSend(periodType, date);
  function getISRType(isrType: TabType): TISR {
    const ISR_TYPE: { [key: string]: TISR } = {
      ALL: "all",
      CASH: "invoice_pue",
      PAYMENT: "payments",
      EXCLUDED: "excluded",
    };
    return ISR_TYPE[isrType];
  }

  async function manageExport() {
    const isr = getISRType(tab);

    if (company && date) {
      dispatch(
        exportISRTable({
          issued,
          period: dateToSend ?? "",
          yearly: year || isExercise,
          isr,
          internalTab,
          tab,
          topTab,
          date,
          periodType,
        })
      );
    }
  }

  if (topTab === "deductions") {
    return (
      <Tooltip title={`Exportar ${getISRTypeNameDeductions(tab, internalTab)}`}>
        <Button
          icon={<DownloadOutlined />}
          onClick={() => manageExport()}
          loading={isFetchingISRExports || fetchingTotals || fetchingTotalsDeductions}
          disabled={getISRStatusButton(
            tab,
            ISRCFDIs,
            ISRTotalsDeductionsTable?.totals_table as any
          )}
        >
          Exportar a Excel
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Exportar ${getISRTypeName(tab)}`}>
      <Button
        icon={<DownloadOutlined />}
        onClick={() => manageExport()}
        loading={isFetchingISRExports}
        disabled={ISRCFDIs.length === 0}
      >
        Exportar a Excel
      </Button>
    </Tooltip>
  );
}

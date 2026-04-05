import { Row, Tag, Alert } from "antd";
import { Link, useNavigate } from "react-router-dom";
import * as P from "@constants/PageIds";
import PeriodSelector from "@components/PeriodSelector";
import { TState } from "../_types/StateTypes";
import editSearchParams from "@utils/editSearchParams";
import Title from "antd/lib/typography/Title";
import { TableMeta } from "@hooks/useTableMeta";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import { RelatedDocto } from "../_types/RelatedDocsTable";
import { tailwindColors } from "@utils/tailwindColors";
import { useSelector } from "react-redux";
import { authSelector } from "@store/authSlice";

export default function IVAHeader({
  exportBanner,
  closeBanner,
  setTopTab,
  topTab,
  setModalType,
}: {
  exportBanner: boolean;
  closeBanner: () => void;
  periodDates: string | null;
  setTopTab: (value: TIVAPeriodTab) => void;
  topTab: TState;
  setModalType: (data: "creditable" | "transferred") => void;
  datesDifference: boolean;
  loading: boolean;
  tab: TabIVAType;
  fuzzySearch: string;
  changefuzzySearch: (value: string) => void;
  loadCFDIs: () => void;
  loadTotals(): void;
  tableMeta: TableMeta<IVACFDI>;
  doctosTableMeta: TableMeta<RelatedDocto>;
  forceSetTableMeta: (value: React.SetStateAction<TableMeta<IVACFDI>>) => void;
  forceDoctosSetTableMeta: (value: React.SetStateAction<TableMeta<RelatedDocto>>) => void;
}) {
  const navigate = useNavigate();
  const { company } = useSelector(authSelector);

  function handleChangeTab() {
    setTopTab(topTab.includes("transferred") ? "period_transferred" : "period_creditable");
    setModalType(topTab.includes("transferred") ? "transferred" : "creditable");
    navigate(
      editSearchParams(
        location.search,
        [
          {
            key: "ivaType",
            value: topTab.includes("transferred") ? "period_transferred" : "period_creditable",
          },
        ],
        { baseUrl: location.pathname }
      ),
      { replace: true }
    );
  }

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-iva">
        IVA base flujo
      </Title>
      {exportBanner ? (
        <Alert
          type="success"
          message={
            <span>
              Tu petición ha sido enviada; ve al menú{" "}
              <Link
                to={`${P.MASSIVEEXPORT.path}/?cid=${company}&tab=iva`}
                style={{ color: tailwindColors.primary }}
                onClick={() => closeBanner()}
              >
                Exportaciones
              </Link>{" "}
              para realizar la descarga.
            </span>
          }
          style={{ marginBottom: 10 }}
          onClose={() => closeBanner()}
          closable
        />
      ) : null}
      <Row justify="space-between" align="middle">
        <div className="flex gap-3">
          <PeriodSelector sideEffect={handleChangeTab} />
        </div>
        <Tag color="warning">
          <span style={{ color: "#5F5F5F" }}>
            <b>IMPORTANTE: </b> No están considerados CFDIs de pago 1.0
          </span>
        </Tag>
      </Row>
    </>
  );
}

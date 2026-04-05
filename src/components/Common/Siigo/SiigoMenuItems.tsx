import {
  AlertOutlined,
  ArrowLeftOutlined,
  CalculatorOutlined,
  CloudDownloadOutlined,
  CloudSyncOutlined,
  FileDoneOutlined,
  HomeOutlined,
  MailOutlined,
  ReconciliationOutlined,
  SafetyCertificateOutlined,
  StarFilled,
} from "@ant-design/icons";
import { getItem } from "@layouts/CustomMenu/CustomMenu";
import { SIIGO_PORTAL_URL } from "@utils/SIIGO/urls";
import { Divider } from "antd";
import * as P from "@constants/PageIds";
import { AppThunkDispatch } from "@store/store";
import type { MenuProps } from "antd";

type SiigoMenuItemsPropsType = {
  goTo: (value: string) => void;
  isCFDIButtonDisabled: boolean;
  isTaxesButtonDisabled: boolean;
  isADDButtonDisabled: boolean;
  closeExportBanner: (noArgument: void) => {
    payload: undefined;
    type: "cfdi/closeExportBanner";
  };
  addEnabled: boolean;
  hasADDConfig: boolean;
  dispatch: AppThunkDispatch;
  coi_enabled: boolean
};

export function SiigoMenuItems(props: SiigoMenuItemsPropsType): MenuProps["items"] {
  const {
    goTo,
    isCFDIButtonDisabled,
    isTaxesButtonDisabled,
    isADDButtonDisabled,
    closeExportBanner,
    dispatch,
    coi_enabled
  } = props;
  const menuItems: MenuProps["items"] = [];
  if (menuItems) {
    menuItems.push(
      getItem(
        <a href={SIIGO_PORTAL_URL} rel="noreferrer">
          Portal Contador
        </a>,
        "sg",
        <ArrowLeftOutlined />,
        undefined,
        undefined,
        "mi_sg"
      ),
      getItem(
        undefined,
        "divider_siigo",
        <Divider
          style={{
            backgroundColor: "#e5e5e580",
            marginLeft: "-18px",
            width: "180px",
          }}
        />,
        undefined,
        undefined,
        "divider_siigo",
        undefined,
        true
      ),
      getItem(
        "Inicio",
        P.DASHBOARD.key,
        <HomeOutlined />,
        () => goTo(P.DASHBOARD.path),
        undefined,
        "dashboard"
      ),
      getItem(
        "CFDIs",
        "sub1",
        <FileDoneOutlined />,
        undefined,
        [
          getItem(
            "Emitidos",
            P.CFDIISSUED.key,
            null,
            () => goTo(P.CFDIISSUED.path),
            undefined,
            "mi_cfdis_issued",
            undefined,
            isCFDIButtonDisabled
          ),
          getItem(
            "Recibidos",
            P.CFDIRECEIVED.key,
            null,
            () => goTo(P.CFDIRECEIVED.path),
            undefined,
            "mi_cfdis_received",
            undefined,
            isCFDIButtonDisabled
          ),
        ],
        "mi_cfdis"
      ),

      getItem(
        "Impuestos",
        "sub_impuestos",
        <CalculatorOutlined />,
        undefined,
        [
          getItem(
            "IVA base flujo",
            P.IVA.key,
            null,
            () => goTo(P.IVA.path),
            undefined,
            "mi_iva",
            undefined,
            isTaxesButtonDisabled
          ),
          getItem(
            "ISR base flujo",
            P.ISR.key,
            null,
            () => goTo(P.ISR.path),
            undefined,
            "mi_isr",
            undefined,
            isTaxesButtonDisabled
          ),
        ],
        "mi_impuestos"
      ),
      getItem(
        "Exportaciones",
        P.MASSIVEEXPORT.key,
        <CloudDownloadOutlined />,
        () => {
          goTo(P.MASSIVEEXPORT.path);
          dispatch(closeExportBanner());
        },
        undefined,
        "mi_exports"
      ),
      getItem("EFOS", P.EFOS.key, <AlertOutlined />, () => goTo(P.EFOS.path), undefined, "mi_efos"),
      getItem(
        "Validaciones",
        P.VALIDATIONS.key,
        <SafetyCertificateOutlined />,
        () => goTo(P.VALIDATIONS.path),
        undefined,
        "mi_validations"
      ),
      getItem(
        "Notificaciones",
        P.NOTIFICATIONS.key,
        <MailOutlined />,
        () => goTo(P.NOTIFICATIONS.path),
        undefined,
        "mi_configs_notifications"
      ),
      getItem(
        "Sincroniza SAT",
        "mi_sat",
        <CloudSyncOutlined />,
        undefined,
        [
          getItem(
            "Información Fiscal",
            P.TAX.key,
            null,
            () => goTo(P.TAX.path),
            undefined,
            "tax-information",
            undefined,
            isCFDIButtonDisabled
          ),
          getItem(
            "Descargas CFDIs",
            P.SAT.key,
            null,
            () => goTo(P.SAT.path),
            undefined,
            "sat-sync",
            undefined,
            isCFDIButtonDisabled
          ),
          getItem(
            "Actualizar e.firma",
            P.Sign.key,
            null,
            () => goTo(P.Sign.path),
            undefined,
            "update-signature",
            undefined,
            isCFDIButtonDisabled
          ),
        ],
        "mi_sat"
      )
    );


    if (coi_enabled) {
      menuItems.push(
        getItem(
          "Conciliación COI",
          "subADD",
          <ReconciliationOutlined />,
          undefined,
          [
            getItem(
              "Emitidos",
              P.ADDISSUED.key,
              null,
              () => goTo(P.ADDISSUED.path),
              undefined,
              "mi_add_issued",
              undefined,
              isADDButtonDisabled
            ),
            getItem(
              "Recibidos",
              P.ADDRECEIVED.key,
              null,
              () => goTo(P.ADDRECEIVED.path),
              undefined,
              "mi_add_received",
              undefined,
              isADDButtonDisabled
            ),
            getItem(
              "Bitácora",
              P.ADDLOG.key,
              null,
              () => goTo(P.ADDLOG.path),
              undefined,
              "mi_logs"
            ),
            // getItem(
            //   "Configuración ADD",
            //   P.ADD.key,
            //   null,
            //   () => goTo(P.ADD.path),
            //   undefined,
            //   "mi_add_configs_add"
            // ),
          ],
          "mi_add"
        )
      );
    }
  }
  return menuItems;
}

export function SiigoMenuItemsBasic(props: SiigoMenuItemsPropsType): MenuProps["items"] {
  const {
    goTo,
    isCFDIButtonDisabled,
    closeExportBanner,
    dispatch,
  } = props;
  const menuItems: MenuProps["items"] = [];
  if (menuItems) {
    menuItems.push(
      getItem(
        <a href={SIIGO_PORTAL_URL} rel="noreferrer">
          Portal Contador
        </a>,
        "sg",
        <ArrowLeftOutlined />,
        undefined,
        undefined,
        "mi_sg"
      ),
      getItem(
        undefined,
        "divider_siigo",
        <Divider
          style={{
            backgroundColor: "#e5e5e580",
            marginLeft: "-18px",
            width: "180px",
          }}
        />,
        undefined,
        undefined,
        "divider_siigo",
        undefined,
        true
      ),
      getItem(
        "CFDIs",
        "sub1",
        <FileDoneOutlined />,
        undefined,
        [
          getItem(
            "Emitidos",
            P.CFDIISSUED.key,
            null,
            () => goTo(P.CFDIISSUED.path),
            undefined,
            "mi_cfdis_issued",
            undefined,
            isCFDIButtonDisabled
          ),
          getItem(
            "Recibidos",
            P.CFDIRECEIVED.key,
            null,
            () => goTo(P.CFDIRECEIVED.path),
            undefined,
            "mi_cfdis_received",
            undefined,
            isCFDIButtonDisabled
          ),
        ],
        "mi_cfdis"
      ),


      getItem(
        "Exportaciones",
        P.MASSIVEEXPORT.key,
        <CloudDownloadOutlined />,
        () => {
          goTo(P.MASSIVEEXPORT.path);
          dispatch(closeExportBanner());
        },
        undefined,
        "mi_exports"
      ),
      getItem("EFOS", P.EFOS.key, <AlertOutlined />, () => goTo(P.EFOS.path), undefined, "mi_efos"),
      getItem(
        "Sincroniza SAT",
        "mi_sat",
        <CloudSyncOutlined />,
        undefined,
        [
          getItem(
            "Descargas CFDIs",
            P.SAT.key,
            null,
            () => goTo(P.SAT.path),
            undefined,
            "sat-sync",
            undefined,
            isCFDIButtonDisabled
          ),
          getItem(
            "Actualizar e.firma",
            P.Sign.key,
            null,
            () => goTo(P.Sign.path),
            undefined,
            "update-signature",
            undefined,
            isCFDIButtonDisabled
          ),
        ],
        "mi_sat"
      ),
      getItem(
        undefined,
        "divider_siigo",
        <Divider
          style={{
            backgroundColor: "#e5e5e580",
            marginLeft: "-18px",
            width: "180px",
          }}
        />,
        undefined,
        undefined,
        "divider_siigo",
        undefined,
        true
      ),
      getItem(
        "Mejora tu plan",
        "plan_siigo_fiscal",
        <StarFilled />,
        () => window.inline_manual_player.activateTopic('125200'),
        undefined,
        "plan_siigo_fiscal"
      ),
    );


  }
  return menuItems;
}

import { getItem } from "@layouts/CustomMenu/CustomMenu";
import type { MenuProps } from "antd";
import * as P from "@constants/PageIds";
import {
  AlertOutlined,
  CalculatorOutlined,
  CloudDownloadOutlined,
  CloudSyncOutlined,
  CustomerServiceOutlined,
  FileDoneOutlined,
  HomeOutlined,
  PlusOutlined,
  ReconciliationOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { setSubNoCompany } from "@store/salesSlice";
import { AppThunkDispatch } from "@store/store";

type EzMenuItemsPropsType = {
  subNoCompany: boolean;
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
  isWorkspaceOwner: boolean;
  dispatch: AppThunkDispatch;
};

export default function EzMenuItems(props: EzMenuItemsPropsType): MenuProps["items"] {
  const {
    subNoCompany,
    goTo,
    isCFDIButtonDisabled,
    isTaxesButtonDisabled,
    isADDButtonDisabled,
    closeExportBanner,
    addEnabled,
    hasADDConfig,
    isWorkspaceOwner,
    dispatch,
  } = props;
  const menuItems: MenuProps["items"] = [];

  if (menuItems) {
    if (subNoCompany) {
      menuItems.push(
        getItem(
          "Crear empresa",
          P.SELECTCOMPANY.key,
          <PlusOutlined />,
          () => {
            dispatch(setSubNoCompany({ value: false }));
            goTo(P.SELECTCOMPANY.path);
          },
          undefined,
          "create_company"
        )
      );
    }

    if (!subNoCompany) {
      menuItems.push(
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
        getItem(
          "EFOS",
          P.EFOS.key,
          <AlertOutlined />,
          () => goTo(P.EFOS.path),
          undefined,
          "mi_efos"
        ),
        getItem(
          "Validaciones",
          P.VALIDATIONS.key,
          <SafetyCertificateOutlined />,
          () => goTo(P.VALIDATIONS.path),
          undefined,
          "mi_validations"
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
    }

    if (addEnabled && !subNoCompany) {
      menuItems.push(
        getItem(
          "Conciliación ADD",
          "subADD",
          <ReconciliationOutlined />,
          undefined,
          hasADDConfig
            ? [
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
                getItem(
                  "Configuración ADD",
                  P.ADD.key,
                  null,
                  () => goTo(P.ADD.path),
                  undefined,
                  "mi_add_configs_add"
                ),
              ]
            : [
                getItem(
                  "Configuración ADD",
                  P.ADD.key,
                  null,
                  () => goTo(P.ADD.path),
                  undefined,
                  "mi_add_configs_add"
                ),
              ],
          "mi_add"
        )
      );
    }

    if (addEnabled && !subNoCompany) {
      menuItems.push(
        getItem(
          "Configuración",
          "sub2",
          <SettingOutlined />,
          undefined,
          isWorkspaceOwner
            ? [
                getItem(
                  "Perfil de usuario",
                  P.SETTINGS.key,
                  null,
                  () => goTo(P.SETTINGS.path),
                  undefined,
                  "mi_profile"
                ),
                getItem(
                  "Usuarios",
                  P.USERS.key,
                  null,
                  () => goTo(P.USERS.path),
                  undefined,
                  "mi_configs_users"
                ),
                getItem(
                  "Notificaciones",
                  P.NOTIFICATIONS.key,
                  null,
                  () => goTo(P.NOTIFICATIONS.path),
                  undefined,
                  "mi_configs_notifications"
                ),

                getItem(
                  "Reiniciar",
                  P.Restart.key,
                  null,
                  () => goTo(P.Restart.path),
                  undefined,
                  "mi_add_restart"
                ),
              ]
            : [
                getItem(
                  "Perfil de usuario",
                  P.SETTINGS.key,
                  null,
                  () => goTo(P.SETTINGS.path),
                  undefined,
                  "mi_profile"
                ),
                getItem(
                  "Notificaciones",
                  P.NOTIFICATIONS.key,
                  null,
                  () => goTo(P.NOTIFICATIONS.path),
                  undefined,
                  "mi_configs_notifications"
                ),

                getItem(
                  "Reiniciar",
                  P.Restart.key,
                  null,
                  () => goTo(P.Restart.path),
                  undefined,
                  "mi_restart"
                ),
              ],
          "mi_configs"
        )
      );
    }
    if (!addEnabled && !subNoCompany) {
      menuItems.push(
        getItem(
          "Configuración",
          "sub2",
          <SettingOutlined />,
          undefined,
          isWorkspaceOwner
            ? [
                getItem(
                  "Perfil de usuario",
                  P.SETTINGS.key,
                  null,
                  () => goTo(P.SETTINGS.path),
                  undefined,
                  "mi_profile"
                ),
                getItem(
                  "Usuarios",
                  P.USERS.key,
                  null,
                  () => goTo(P.USERS.path),
                  undefined,
                  "mi_configs_users"
                ),
                getItem(
                  "Notificaciones",
                  P.NOTIFICATIONS.key,
                  null,
                  () => goTo(P.NOTIFICATIONS.path),
                  undefined,
                  "mi_configs_notifications"
                ),

                getItem(
                  "Reiniciar",
                  P.Restart.key,
                  null,
                  () => goTo(P.Restart.path),
                  undefined,
                  "mi_restart"
                ),
              ]
            : [
                getItem(
                  "Perfil de usuario",
                  P.SETTINGS.key,
                  null,
                  () => goTo(P.SETTINGS.path),
                  undefined,
                  "mi_profile"
                ),
                getItem(
                  "Notificaciones",
                  P.NOTIFICATIONS.key,
                  null,
                  () => goTo(P.NOTIFICATIONS.path),
                  undefined,
                  "mi_configs_notifications"
                ),

                getItem(
                  "Reiniciar",
                  P.Restart.key,
                  null,
                  () => goTo(P.Restart.path),
                  undefined,
                  "mi_restart"
                ),
              ],
          "mi_configs"
        )
      );
    }

    if (isWorkspaceOwner) {
      menuItems.push(
        getItem(
          "Suscripción",
          P.SUBSCRIPTION.key,
          <StarOutlined />,
          () => goTo(P.SUBSCRIPTION.path),
          undefined,
          "mi_subscription"
        )
      );
    }

    menuItems.push(
      getItem(
        "Soporte",
        "help",
        <CustomerServiceOutlined />,
        undefined,
        P.HELP.map((item) =>
          getItem(
            <a href={item.path} target="_blank" rel="noreferrer">
              {item.text}
            </a>,
            item.key
          )
        ),
        "mi_support"
      )
    );
  }

  return menuItems;
}

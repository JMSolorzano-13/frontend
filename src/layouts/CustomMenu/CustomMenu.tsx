import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, Layout, Menu, Button, Tooltip, Divider } from "antd";
import { HomeOutlined, MenuFoldOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import LastSync from "@components/ui/LastSync";
import * as P from "@constants/PageIds";
import { clearSyncError, satSelector, setLoading } from "@store/satSlice";
import usePermissions from "@hooks/usePermissions";
import { closeExportBanner } from "@store/cfdiSlice";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { authSelector, setHasADDConfig } from "@store/authSlice";
import { companySelector } from "@store/companySlice";
import { getManualSyncStatus } from "@store/satSlice/getManualSync";
import { useAppDispatch } from "@store/store";
import { useDisableButtonsCFDI } from "@hooks/useDisableButtonsCFDI";
import { useDisableButtonsTaxes } from "@hooks/useDisableButtonsTaxes";
import { blockedCompanyIdentifiersFrontend } from "@utils/global/blackList";
import { useDisableButtonsADD } from "@hooks/useDisableButtonsADD";
import moment from "moment";
import { getNewSatLog } from "@store/satSlice/getNewSatLog";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import EzMenuItems from "@components/Common/ezaudita/EzMenuItems";
import { SiigoMenuItems, SiigoMenuItemsBasic } from "@components/Common/Siigo/SiigoMenuItems";
import { salesSelector } from "@store/salesSlice";
import { useBasicPlan } from "@hooks/useBasicPlan";
import { useCOIEnabled } from "@hooks/useCOI";

let s: Record<string, string> = {};

// Load styles asynchronously
(async () => {
  if (IS_SIIGO) {
    s = (await import("./CustomMenu.module.scss")).default;
  } else {
    s = (await import("./ezCustomMenu.module.scss")).default;
  }
})();

const { Sider } = Layout;
const { useBreakpoint } = Grid;

type CustomMenuProps = {
  pageId?: string;
  visible: boolean;
  setVisible: (newState: boolean) => void;
  menuHovered: boolean;
  setMenuHovered: (newState: boolean) => void;
};

export default function CustomMenu(props: CustomMenuProps) {
  const { isDownloadPlan } = useBasicPlan()
  const { coi_enabled } = useCOIEnabled()
  const { pageId, visible, setVisible, menuHovered, setMenuHovered } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isWorkspaceOwner } = usePermissions();
  const screens = useBreakpoint();
  const { dateEnd, stripeStatus, isTrialing } = useSubscriptionData();
  const { userData, rfc, workspace, company, hasADDConfig, addEnabled } =
    useSelector(authSelector);
  const { syncError, differenceDaySinceManualSync } = useSelector(satSelector);
  const { subNoCompany } = useSelector(salesSelector);
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const currentOpenKey = localStorage.getItem("curr-open-menu-key");
    if (currentOpenKey) {
      return [currentOpenKey];
    } else {
      return [];
    }
  });
  const { companies } = useSelector(companySelector);
  const currentCompany = companies.find((c) => c.identifier === company);
  const [toggleMenuButtonVisible, setToggleMenuButtonVisible] = useState(false);
  const [tempVisible, setTempVisible] = useState(false);
  const isCFDIButtonDisabled = useDisableButtonsCFDI();
  const isTaxesButtonDisabled = useDisableButtonsTaxes();
  const isADDButtonDisabled = useDisableButtonsADD();

  useEffect(() => {
    if (menuHovered) {
      setTempVisible(true);
    } else {
      setTempVisible(false);
    }
  }, [menuHovered]);

  useEffect(() => {
    if (currentCompany) {
      dispatch(setHasADDConfig({ company: currentCompany }));
    }
  }, [userData, workspace, company, hasADDConfig]);

  useEffect(() => {
    dispatch(setLoading());
    dispatch(getManualSyncStatus());
    function getSatLogData() {
      const startDate = moment().subtract("5", "years").format("YYYY-MM-DD");
      const yearFromStartDate = moment(startDate).format("YYYY");
      dispatch(
        getNewSatLog({
          startDate: `${yearFromStartDate}-01-01`,
          daysDifference: differenceDaySinceManualSync,
        })
      );
    }
    getSatLogData();
    dispatch(setLoading());
  }, []);

  useEffect(() => {
    if (syncError) {
      dispatch(clearSyncError());
    }
  }, [syncError]);

  const demoDaysRemaining = useMemo(() => {
    if (isTrialing && dateEnd) {
      const now = new Date();
      const remaining = Math.abs(dateEnd.getTime() - now.getTime());
      return Math.round(remaining / 24 / 60 / 60 / 1000);
    }
    return 0;
  }, [stripeStatus, dateEnd]);

  const goTo = (path: string) => {
    setMenuHovered(false);
    if (path === P.DASHBOARD.path) {
      navigate(`${path}?cid=${company}`);
    } else {
      navigate(`${path}/?cid=${company}`);
    }
  };

  useEffect(() => {
    const currentOpenMenu = localStorage.getItem("curr-open-menu-key");
    if (menuHovered && currentOpenMenu) {
      setOpenKeys([currentOpenMenu]);
    }
  }, [menuHovered]);

  useEffect(() => {
    const items: any = loadMenu();
    const itemsWithChildren = items.filter((e: any) => e.children);
    const isSelectedItem = itemsWithChildren.filter(
      (e: any) => e.children.filter((e: any) => e.key === pageId).length > 0
    );
    localStorage.setItem("curr-open-menu-key", isSelectedItem[0]?.key);
  }, [pageId]);

  const onOpenChange = (keys: React.Key[]) => {
    if (keys) {
      const openKey: string[] = [];
      openKey.push((keys[1] as string) || (keys[0] as string));
      setOpenKeys(openKey);
      const items: any = loadMenu();
      const itemsWithChildren = items.filter((e: any) => e.children);
      const isSelectedItem = itemsWithChildren.filter(
        (e: any) => e.children.filter((e: any) => e.key === pageId).length > 0
      );
      if (isSelectedItem[0]?.key === openKey[0]) {
        localStorage.setItem("curr-open-menu-key", openKey[0]);
      }
    }
  };

  const singleItem: MenuProps["items"] = [
    getItem(
      "Inicio",
      P.DASHBOARD.key,
      <HomeOutlined />,
      () => goTo(P.DASHBOARD.path),
      undefined,
      "dashboard"
    ),
  ];

  function loadMenu(): MenuProps["items"] {
    if (IS_SIIGO) {
      if (isDownloadPlan) {
        const menuItems = SiigoMenuItemsBasic({
          addEnabled,
          closeExportBanner,
          goTo,
          hasADDConfig,
          isADDButtonDisabled,
          isCFDIButtonDisabled,
          isTaxesButtonDisabled,
          dispatch,
          coi_enabled: false
        });
        return menuItems;
      }
      const menuItems = SiigoMenuItems({
        addEnabled,
        closeExportBanner,
        goTo,
        hasADDConfig,
        isADDButtonDisabled,
        isCFDIButtonDisabled,
        isTaxesButtonDisabled,
        dispatch,
        coi_enabled
      });
      return menuItems;
    } else {
      const menuItems = EzMenuItems({
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
      });
      return menuItems;
    }
  }

  return (
    <>
      {menuHovered ? (
        <div
          id="clearfix-sidebar"
          className={s.ClearFix}
          style={{
            display: (visible || tempVisible) && !screens.md ? "block" : "none",
          }}
          onClick={() => (screens.md ? setVisible(false) : setMenuHovered(false))}
          aria-hidden="true"
        />
      ) : null}



      {(company && rfc) && (
        <Sider
          className={`${s.Sider} siigo`}
          collapsedWidth={0}
          trigger={null}
          width={!screens.md ? "60%" : 200}
          collapsed={!screens.md ? !tempVisible : !tempVisible && !visible}
          collapsible
          reverseArrow
        >
          <div
            className={s.SiderContainer}
            onMouseEnter={() => {
              if (screens.md) {
                setToggleMenuButtonVisible(true);
                setMenuHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (screens.md) {
                setToggleMenuButtonVisible(false);
                setMenuHovered(false);
              }
            }}
          >
            <div>
              {screens.md && (
                <Button
                  id="ws-burger-menu-trigger"
                  size="large"
                  icon={
                    <Tooltip placement="left" title="Ocultar">
                      <MenuFoldOutlined id="CLOSE_MENU_BUTTON" />
                    </Tooltip>
                  }
                  onClick={() => {
                    setVisible(false);
                    setMenuHovered(false);
                    localStorage.setItem("h-menu-state", `${false}`);
                  }}
                  style={{
                    border: "none",
                    backgroundColor: "#00000000",
                    color: "white",
                    opacity: toggleMenuButtonVisible && visible ? "1" : "0",
                    transition: "opacity 0.3s linear",
                    width: "100%",
                    textAlign: "right",
                    paddingRight: 20,
                  }}
                />
              )}

              <Menu
                mode="inline"
                theme="dark"
                items={
                  blockedCompanyIdentifiersFrontend.includes(company || "")
                    ? singleItem
                    : loadMenu()
                }
                className={`${s.Menu} ${IS_SIIGO ? "siigo" : "ezaudita"}`}
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                selectedKeys={pageId ? [pageId] : undefined}
              ></Menu>

            </div>
            <div className={s.SATStatus}>
              {!IS_SIIGO && isTrialing && demoDaysRemaining < 0 ? (
                <>
                  <a
                    href={isWorkspaceOwner ? P.SUBSCRIPTION.path : "#"}
                    style={{ color: "#ffc14e" }}
                  >
                    <strong>
                      {demoDaysRemaining} día{demoDaysRemaining === 1 ? "" : "s"} demo restante
                      {demoDaysRemaining === 1 ? "" : "s"}
                    </strong>
                  </a>
                  <Divider style={{ margin: "15px 0" }} />
                </>
              ) : null}
              {!IS_SIIGO ? !subNoCompany && <LastSync /> : null}
              {IS_SIIGO && <LastSync />}
            </div>
          </div>
        </Sider>
      )}
    </>
  );
}

type MenuItem = Required<MenuProps>["items"][number];

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  onClick?: () => void | null,
  children?: MenuItem[],
  id?: string | undefined,
  type?: "group" | "",
  disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    onClick,
    label,
    type,
    id,
    disabled,
  } as MenuItem;
}

CustomMenu.defaultProps = {
  pageId: null,
};

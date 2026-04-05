import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Layout, Button, Space, Select, Dropdown, Grid, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import {
  LogoutOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  DoubleRightOutlined,
  MenuOutlined,
  UsergroupAddOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  StarOutlined,
  CaretDownOutlined,
  QuestionOutlined,
} from "@ant-design/icons";

import CustomMenu from "./CustomMenu/CustomMenu";
import s from "./Workspace.module.scss";
import { authSelector, logout, setRFC } from "@store/authSlice";
import { getCompanies } from "@store/companySlice/getCompanies";
import { companySelector } from "@store/companySlice";
import changeCompany from "@store/authSlice/changeCompany";
import formatSearchLocation from "@utils/formatSearchLocation";
import * as P from "@constants/PageIds";
import HiddenRedirect from "@components/HiddenRedirect";
import LoadingScreen from "@components/ui/LoadingScreen";
import usePermissions from "@hooks/usePermissions";
import WorkspaceBanners from "./WorkspaceBanners/WorkspaceBanners";
import { useAppDispatch } from "@store/store";
import { getSatConfig } from "@store/satSlice/getSatConfig";
import { salesSelector } from "@store/salesSlice";
import { helpMenuItems, userMenuItems } from "./_utils/menuItems";
import CompanyDropdown from "./_components/CompanyDropdown";
import useSubscriptionData from "@hooks/useSubscriptionData";
import moment from "moment";
import { IS_SIIGO } from "@utils/SIIGO/Global";
import EzLogoComponent from "@components/Common/ezaudita/EzLogoComponent";
import SiigoLogoComponent from "@components/Common/Siigo/SiigoLogoComponent";
import SiigoCompanySelectorComponent from "@components/Common/Siigo/SiigoCompanySelectorComponent";
import EzCompanySelectorComponent from "@components/Common/ezaudita/EzCompanySelectorComponent";
import UserEdit from "@components/users/UsersCRUD/UserEdit";
import ProfileModal from "@components/ProfileModal";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

export enum WorkspaceType {
  NORMAL,
  CLEAN,
  BLOCK,
}

type WorkspaceProps = {
  pageId?: string;
  type: keyof typeof WorkspaceType;
};

export type SelectOptionType = {
  label: string;
  value: string;
};

export default function Workspace(props: PropsWithChildren<WorkspaceProps>) {
  const self_uri = window.location.origin;
  const { children, pageId, type } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isWorkspaceOwner } = usePermissions();
  const screens = useBreakpoint();
  const { company, oldCompany, userData, rfc, license, workspace, addEnabled } =
    useSelector(authSelector);
  const companyStore = useSelector(companySelector);
  const { subNoCompany } = useSelector(salesSelector);
  const { companies } = companyStore;
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const [isSiderVisible, setIsSiderVisible] = useState(() => {
    const lastState = localStorage.getItem("h-menu-state");
    if (lastState) {
      if (lastState === "true") {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });
  const [profileModalVisible, setProfileModalVisible] = useState(() => {
    if (userData) {
      const { name, email } = userData.user;
      if (name === null || name === email) {
        return true;
      }
    }
    return false;
  });
  const { currentExtraUsers, currentPlan, dateEnd } = useSubscriptionData();
  const location = useLocation();
  const searchLoc = useMemo(() => formatSearchLocation(location.search), [location.search]);

  const isNormal = WorkspaceType[type] === WorkspaceType.NORMAL;
  const isBLock = WorkspaceType[type] === WorkspaceType.BLOCK;

  const hardCodedName = "";

  useEffect(() => {
    if (company) {
      dispatch(getCompanies());
    }
    // We call this to obtain not_after value and display a message if it's expired
    if (company) {
      dispatch(getSatConfig());
    }
  }, [dispatch, company]);

  useEffect(() => {
    if (company && oldCompany && companies.length > 0) {
      const companyFound = companies.find((c) => c.id === oldCompany);
      if (companyFound) {
        dispatch(setRFC(companyFound.rfc));
      } else {
        dispatch(setRFC(null));
      }
    } else {
      dispatch(setRFC(null));
    }
  }, [companies, company]);

  useEffect(() => {
    function loadPeopleTracking() {
      const data = {
        uid: userData?.user.id,
        email: userData?.user.email,
        username: userData?.user.email,
        name: userData?.user.name,
      };

      window?.InlineManual("boot", data);

      if (userData && userData.user && dateEnd && workspace) {
        const addData = userData.access[workspace];
        const expiration = moment.utc(dateEnd).subtract(1, "day").toISOString();
        const data = {
          uid: userData.user.id,
          plan: currentPlan?.stripe_name,
          roles: [isWorkspaceOwner ? "Owner" : "Invited"],
          expirationdate: expiration,
          add: addEnabled ? 1 : 0,
          isaddinstalled: addData.pasto_installed ? 1 : 0,
          additionalusers: currentExtraUsers,
          paymentpending: license ? (license.latest_invoice ? 1 : 0) : 0,
          hadotherdataerror: "",
        };
        window?.InlineManual("update", data);
      }
    }
    if (userData) {
      loadPeopleTracking();
    }
  }, [
    userData,
    /* , License, dateEnd, workspace  */
  ]);

  const companiesEl = useMemo(() => {
    const els: SelectOptionType[] = [];
    if (companies) {
      companies.forEach((c) => {
        els.push({ value: c.identifier, label: c.name });
      });
    }
    return els;
  }, [companies]);

  const customDropdownRender = (menu: any) => (
    <>
      {menu}
      <Button
        type="link"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => {
          localStorage.removeItem("lastCompany");
          localStorage.removeItem("lastWorkspace");
          window.location.replace("/create-company");
        }}
      >
        <PlusOutlined />
        <span>Nueva empresa</span>
      </Button>
    </>
  );

  const goTo = (path: string) => {
    navigate(`${path}/?cid=${company}`);
  };

  const userMenu = useMemo<MenuProps["items"]>(() => {
    const menuItems: MenuProps["items"] = IS_SIIGO
      ? userMenuItems(userData, hardCodedName, self_uri)
      : [
          {
            key: "profile",
            style: {
              padding: "1rem",
              pointerEvents: "none",
            },
            label: (
              <div>
                <p
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {userData?.user.name}
                </p>
                <p>{userData?.user.email}</p>
              </div>
            ),
          },
        ];

    if (!IS_SIIGO) {
      if (!subNoCompany) {
        menuItems.push({
          label: "Perfil de usuario",
          key: "profileLink",
          onClick: () => goTo(P.SETTINGS.path),
          icon: <UserOutlined />,
        });
      }

      if (isWorkspaceOwner) {
        menuItems.push({
          label: "Suscripción",
          key: "subscription",
          onClick: () => goTo(P.SUBSCRIPTION.path),
          icon: <StarOutlined />,
        });
      }

      if (isWorkspaceOwner && !subNoCompany) {
        menuItems.push({
          label: "Invitar usuario",
          key: "inviteUser",
          onClick: () => setUserModalVisible(true),
          icon: <UsergroupAddOutlined />,
        });
      }
      if (companies.length > 1) {
        menuItems.push({
          label: "Empresas",
          key: "changeCompany",
          onClick: () => {
            localStorage.removeItem("lastCompany");
            localStorage.removeItem("lastWorkspace");
            window.location.replace(P.SELECTCOMPANY.path);
          },
          icon: <UnorderedListOutlined />,
        });
      }

      if (subNoCompany) {
        menuItems.push({
          label: "Empresas",
          key: "changeCompany",
          onClick: () => navigate(P.SELECTCOMPANY.path),
          icon: <UnorderedListOutlined />,
        });
      }

      menuItems.push({
        label: "Cerrar sesión",
        key: "logout",
        onClick: async () => {
          await dispatch(logout());
          window.location.replace("/");
        },
        icon: <LogoutOutlined />,
      });
    }
    return menuItems;
  }, [userData, isWorkspaceOwner, license, companies]);

  const helpMenu: MenuProps["items"] = helpMenuItems;

  if (company && !rfc) return <LoadingScreen />;

  if (searchLoc.workspace && searchLoc.workspace === "hidden") {
    return (
      <Layout className={s.ContentLayout}>
        <HiddenRedirect />
        <Content className={s.Content} style={{ padding: 15 }}>
          {children}
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      {isMenuHovered && screens.md ? (
        <div
          style={{
            position: "absolute",
            width: 100,
            height: 80,
            zIndex: 1000,
            display: "block",
          }}
          onMouseEnter={() => setIsMenuHovered(true)}
          onMouseLeave={() => setIsMenuHovered(false)}
        ></div>
      ) : null}
      {!isMenuHovered && screens.md ? (
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 200,
            marginTop: 20,
            zIndex: 1000,
            display: "block",
          }}
          onMouseEnter={() => setIsMenuHovered(true)}
          onMouseLeave={() => setIsMenuHovered(false)}
        ></div>
      ) : null}

      <Header className={s.Header}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {!screens.md || (!isSiderVisible && isNormal) ? (
            <Tooltip
              id="tooltip_hovered"
              placement="rightTop"
              title="Mostrar"
              style={{ paddingTop: 20 }}
            >
              <Button
                id="ws-burger-menu-trigger"
                shape="circle"
                size="large"
                icon={
                  !screens.md ? (
                    <MenuOutlined id="TOP_MENU_BUTTON" rotate={isMenuHovered ? 90 : 0} />
                  ) : isMenuHovered ? (
                    <DoubleRightOutlined id="TOP_MENU_BUTTON_CLOSE" />
                  ) : (
                    <MenuUnfoldOutlined id="TOP_MENU_BUTTON_OPEN" />
                  )
                }
                onClick={() => {
                  if (screens.md) {
                    setIsSiderVisible(true);
                    setIsMenuHovered(false);
                    localStorage.setItem("h-menu-state", `${true}`);
                  } else {
                    setIsMenuHovered(!isMenuHovered);
                  }
                }}
                style={{ marginRight: 10, border: "none", zIndex: 1001 }}
                onMouseEnter={() => screens.md && setIsMenuHovered(true)}
                onMouseLeave={() => screens.md && setIsMenuHovered(false)}
              />
            </Tooltip>
          ) : null}

          {IS_SIIGO ? <SiigoLogoComponent /> : <EzLogoComponent subNoCompany={subNoCompany} />}
        </div>

        {isNormal ? (
          <Space size="large">
            {companiesEl.length > 0 && screens.md ? (
              IS_SIIGO ? (
                <SiigoCompanySelectorComponent
                  changeCompany={changeCompany}
                  companiesEl={companiesEl}
                  company={company}
                  userData={userData}
                />
              ) : (
                <EzCompanySelectorComponent
                  changeCompany={changeCompany}
                  companiesEl={companiesEl}
                  company={company}
                  userData={userData}
                />
              )
            ) : null}

            {!IS_SIIGO && (
              <>
                <Button
                  shape="circle"
                  size="middle"
                  onClick={() => window?.inline_manual_player.showPanel()}
                  icon={<QuestionOutlined style={{ fontSize: 14 }} />}
                />
                <UserEdit visible={userModalVisible} setVisible={setUserModalVisible} />
              </>
            )}

            {IS_SIIGO && (
              <>
                <div className={s.VerticalDivider}></div>

                <Dropdown
                  menu={{ items: helpMenu }}
                  trigger={["click"]}
                  className={s.SupportDropdown}
                  placement="bottomRight"
                >
                  <Space id="im_help_menu">
                    Ayuda
                    <CaretDownOutlined className={s.HelpCaret} />
                  </Space>
                </Dropdown>
              </>
            )}
            <CompanyDropdown userMenuItems={userMenu} />
          </Space>
        ) : (
          <Space>
            {isBLock && (
              <Select
                style={{ minWidth: 250, maxWidth: 420 }}
                bordered={false}
                defaultValue={company ?? ""}
                size="large"
                onChange={(val) => changeCompany(val, userData, company)}
                showSearch
                optionFilterProp="children"
                options={companiesEl}
                dropdownRender={customDropdownRender}
                filterOption={(input, option) => {
                  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
              />
            )}
            <Button
              id="ws-logout"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Cerrar Sesión
            </Button>
          </Space>
        )}
        {!IS_SIIGO && (
          <ProfileModal visible={profileModalVisible} setVisible={setProfileModalVisible} />
        )}
      </Header>
      <Layout>
        {isNormal && (
          <CustomMenu
            visible={isSiderVisible}
            setVisible={setIsSiderVisible}
            pageId={pageId}
            menuHovered={isMenuHovered}
            setMenuHovered={setIsMenuHovered}
          />
        )}
        <Layout className={s.ContentLayout}>
          <Content className={s.Content} style={{ margin: 15 }}>
            <WorkspaceBanners />
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

Workspace.defaultProps = {
  pageId: null,
};

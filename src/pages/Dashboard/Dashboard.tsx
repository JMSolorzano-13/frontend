import { createContext, useEffect, useMemo } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Space, Spin } from "antd";
import { useSelector } from "react-redux";
import PeriodSelector from "@components/PeriodSelector";
import { authSelector } from "@store/authSlice";
import resetUserConfig from "@store/authSlice/resetUserConfig";
import saveUserConfig from "@store/authSlice/saveUserConfig";
import s from "./Dashboard.module.scss";
import EditWrapper from "./EditWrapper";
import getWidgets from "./widgets";
import { useAppDispatch } from "@store/store";
import { getPeriods } from "@store/common/getPeriods";
import { commonSelector, setEditMode } from "@store/common";
import Title from "antd/lib/typography/Title";

export const EditModeContext = createContext(false);

export default function Dashboard() {
  const { config, isFetchingConfig } = useSelector(authSelector);
  const { periods, editMode } = useSelector(commonSelector);
  const dispatch = useAppDispatch();
  const handleSaveLayout = () => {
    dispatch(saveUserConfig());
    dispatch(setEditMode());
  };

  const handleResetLayout = () => {
    dispatch(resetUserConfig());
    dispatch(setEditMode());
  };

  const widgetsData = useMemo(() => {
    return getWidgets();
  }, []);

  useEffect(() => {
    if (periods.length === 0) {
      dispatch(getPeriods());
    }
  }, [dispatch]);

  const widgetsEl = useMemo(() => {
    const elements: JSX.Element[] = [];
    if (editMode) {
      widgetsData.forEach((w) => {
        elements.push(
          <EditWrapper key={w.id} id={w.id} className={w.className} dataTest={w.id}>
            <w.component key={`Comp-${w.id}`} />
          </EditWrapper>
        );
      });
    } else {
      widgetsData.forEach((w) => {
        if (config?.dashboardIds?.includes(w.id)) {
          elements.push(<w.component key={`Comp-${w.id}`} />);
        }
      });
    }
    return elements;
  }, [editMode, config.dashboardIds, widgetsData]);

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-dashboard">
        Inicio
      </Title>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <PeriodSelector />
        {editMode ? (
          <Space>
            <Button onClick={handleResetLayout}>Cancelar</Button>
            <Button type="primary" onClick={handleSaveLayout}>
              Guardar
            </Button>
          </Space>
        ) : (
          <Button icon={<SettingOutlined />} onClick={() => dispatch(setEditMode())} />
        )}
      </div>
      {isFetchingConfig ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            marginTop: 20,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <EditModeContext.Provider value={editMode}>
          <div className={s.Widgets} style={{ marginTop: 17 }} data-test="widgets">
            {widgetsEl}
          </div>
        </EditModeContext.Provider>
      )}
    </>
  );
}

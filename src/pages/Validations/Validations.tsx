import { createContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Space, Spin } from "antd";
import groups from "./groups";
import EditWrapper from "./EditWrapper";
import { authSelector } from "@store/authSlice";
import { cfdiSelector } from "@store/cfdiSlice";
import PeriodSelector from "@components/PeriodSelector";
import saveUserConfig from "@store/authSlice/saveUserConfig";
import resetUserConfig from "@store/authSlice/resetUserConfig";
import { commonSelector } from "@store/common";
import { useAppDispatch } from "@store/store";
import Title from "antd/lib/typography/Title";
import styles from "./Validations.module.scss";

export const EditModeContext = createContext(false);

export default function Validations() {
  const { error } = useSelector(cfdiSelector);
  const { config, isFetchingConfig } = useSelector(authSelector);
  const { validationIds } = config;
  const { datesValue } = useSelector(commonSelector);
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const handleCancelEdit = () => {
    dispatch(resetUserConfig());
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    dispatch(saveUserConfig());
    setEditMode(false);
  };

  const groupElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    if (editMode) {
      groups.forEach((g) => {
        elements.push(
          <EditWrapper id={g.id} key={g.id}>
            <g.component />
          </EditWrapper>
        );
      });
    } else {
      groups.forEach((g) => {
        if (validationIds.includes(g.id)) {
          elements.push(<g.component key={g.id} />);
        }
      });
    }
    return elements;
  }, [editMode, validationIds]);

  return (
    <>
      <EditModeContext.Provider value={editMode}>
        <Row gutter={[12, 12]}>
          <div className={styles.SearchBarMenu}>
            <Col span={24}>
              <Space>
                <Title
                  level={5}
                  style={{ fontWeight: 400, marginBottom: 10 }}
                  id="title-validaciones"
                >
                  Validaciones - CFDIs con posibles situaciones incorrectas
                </Title>
              </Space>
            </Col>
            <Col span={24}>
              <Row gutter={24} justify="space-between">
                <Col span={24} style={{ display: "flex", justifyContent: "space-between" }}>
                  <PeriodSelector />
                  {editMode ? (
                    <Space>
                      <Button onClick={handleCancelEdit}>Cancelar</Button>
                      <Button type="primary" onClick={handleSaveEdit}>
                        Guardar
                      </Button>
                    </Space>
                  ) : (
                    <Button icon={<SettingOutlined />} onClick={() => setEditMode(true)} />
                  )}
                </Col>
              </Row>
            </Col>
          </div>
          {isFetchingConfig || !datesValue ? (
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
            <>{groupElements}</>
          )}
        </Row>
      </EditModeContext.Provider>
    </>
  );
}

import { authSelector, toggleId } from "@store/authSlice";
import { Col, Switch } from "antd";
import React, { PropsWithChildren, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditWrapper(props: PropsWithChildren<{ id: string }>) {
  const { children, id } = props;
  const dispatch = useDispatch();
  const { config } = useSelector(authSelector);
  const { validationIds } = config;
  const [active, setActive] = useState(() => validationIds.includes(id));

  const statusStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "rgb(227 227 227)",
    padding: 4,
    borderBottom: "1px solid #e4e4e4",
  };

  return (
    <Col span={24}>
      <div style={statusStyle}>
        <Switch
          defaultChecked={active}
          onChange={(toggled) => {
            dispatch(toggleId({ collection: "validationIds", id, toggled }));
            setActive(toggled);
          }}
        />
      </div>
      {children}
    </Col>
  );
}

import { authSelector, toggleId } from "@store/authSlice";
import { Switch } from "antd";
import React, { PropsWithChildren, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditWrapper(
  props: PropsWithChildren<{ id: string; className: string; dataTest: string }>
) {
  const { children, id, className, dataTest } = props;
  const dispatch = useDispatch();
  const { config } = useSelector(authSelector);
  const { dashboardIds } = config;
  const [active, setActive] = useState(() => dashboardIds.includes(id));

  const statusStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-start",
    backgroundColor: "rgb(227 227 227)",
    padding: 4,
    borderBottom: "1px solid #e4e4e4",
  };

  return (
    <div className={className} data-test={dataTest}>
      <div style={statusStyle}>
        <Switch
          defaultChecked={active}
          onChange={(toggled) => {
            dispatch(toggleId({ collection: "dashboardIds", id, toggled }));
            setActive(toggled);
          }}
          data-test={`${dataTest}-widget-switch`}
        />
      </div>
      {children}
    </div>
  );
}

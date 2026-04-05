import React, { useEffect } from "react";
import { Space, Typography } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import * as P from "@constants/PageIds";
import { useSelector } from "react-redux";
import { addSelector } from "@store/addSlice";
import { getSyncSearch } from "@store/addSlice/getSyncSearch";
import { useAppDispatch } from "@store/store";
import { authSelector } from "@store/authSlice";

export default function AddLastSynchDate() {
  const dispatch = useAppDispatch();

  const { syncSearch } = useSelector(addSelector);
  const { company } = useSelector(authSelector);

  useEffect(() => {
    function loadData() {
      dispatch(getSyncSearch());
    }
    loadData();
  }, []);
  return (
    <Space
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-start",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography.Text style={{ textAlign: "end", fontSize: "0.9rem" }}>
          Última sincronización:{" "}
          {syncSearch && syncSearch[syncSearch.length - 1]
            ? moment
              .utc(syncSearch[syncSearch.length - 1].created_at)
              .utcOffset("-06:00")
              .format("DD/MM/YYYY, HH:mm")
            : "-"}
          {" - "}
          <Link to={`${P.ADDLOG.path}/?cid=${company}`}>Ver detalles</Link>
        </Typography.Text>
      </div>
    </Space>
  );
}

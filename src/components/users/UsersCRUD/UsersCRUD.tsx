import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Input, message, Table, Grid } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import s from "./UsersCRUD.module.scss";
import { useDebounce } from "@hooks/useDebounce";
import { filterUsers } from "@utils/filters";
import UserEdit from "./UserEdit";
import getUsers from "@store/userSlice/getUsers";
import { userSelector } from "@store/userSlice";
import { useAppDispatch } from "@store/store";
import usePermissions from "@hooks/usePermissions";
import useGetOwnerData from "@hooks/useGetOwnerData";
import getUsersTableColumns from "./columns";
import { numberPagination, optionsPagination } from "@utils/global/numberPagination";

const { useBreakpoint } = Grid;

export default function UsersCRUD() {
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  const { users, isFetching, error } = useSelector(userSelector);
  const [debouncedSearch, search, setSearch] = useDebounce("");
  const [modalVisible, setModalVisible] = useState(false);
  const { isWorkspaceOwner } = usePermissions();
  const { name, email } = useGetOwnerData();

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const data = useMemo(() => {
    return filterUsers(debouncedSearch, users);
  }, [debouncedSearch, users]);

  function handleClickedButton() {
    if (isWorkspaceOwner) {
      setModalVisible(true);
    } else {
      const contentText = (
        <>
          Solo el usuario principal de la cuenta <b>{name}</b> - <b>{email}</b> puede invitar nuevos
          usuarios
        </>
      );
      message.error(contentText, 7);
    }
  }

  return (
    <div className={s.Main}>
      <div className={s.FilterBar}>
        <Input.Search
          placeholder="Buscar..."
          allowClear
          className={s.SearchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleClickedButton()}>
          {screens.sm ? "Invitar" : ""}
        </Button>
      </div>
      <Table
        rowKey="email"
        size="small"
        columns={getUsersTableColumns(isWorkspaceOwner)}
        scroll={{ x: 10, y: 380 }}
        dataSource={data}
        loading={isFetching}
        pagination={{
          showTotal: (total) =>
            total > 1 ? `${total} resultados en total` : `${total} resultado en total`,
          defaultPageSize: numberPagination,
          pageSizeOptions: optionsPagination,
          showSizeChanger: true,
        }}
      />
      <UserEdit visible={modalVisible} setVisible={setModalVisible} />
    </div>
  );
}

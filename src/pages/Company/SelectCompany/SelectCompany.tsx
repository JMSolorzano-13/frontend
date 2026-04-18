import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Button, Card, Input, message, Table, Grid, Badge, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import * as P from "@constants/PageIds";
import s from "./SelectCompany.module.scss";
import { companySelector } from "@store/companySlice";
import { getCompanies } from "@store/companySlice/getCompanies";
import changeCompany from "@store/authSlice/changeCompany";
import { authSelector, setWasUserChanged } from "@store/authSlice";
import { useAppDispatch } from "@store/store";

const { useBreakpoint } = Grid;

export default function SelectCompany() {
  const dispatch = useAppDispatch();
  const screens = useBreakpoint();
  // const history = useHistory()
  const navigate = useNavigate();
  const location = useLocation();
  const { company, userData, wasUserChanged } = useSelector(authSelector);
  const { isFetching, error, companies } = useSelector(companySelector);

  const [filteredData, setFilteredData] = useState<Company[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (company) {
      const url = location.search.includes("redirect=")
        ? location.search.split("redirect=")[1]
        : null;
      navigate(url ?? `${P.DASHBOARD.path}?cid=${company}`);
    }
  }, [company, navigate, location.search]);

  useEffect(() => {
    dispatch(getCompanies());
  }, [dispatch]);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(setWasUserChanged(false));
    }, 1000);

    return () => clearTimeout(timeOut);
  }, [dispatch]);

  useEffect(() => {
    if (error) message.error(error);
  }, [error]);

  const columns = useMemo(() => {
    const newColumns = [
      {
        title: "Nombre",
        render: (record: Company) => {
          if (record?.workspace?.owner?.id === userData?.user.id) {
            return (
              <div style={{ display: "flex" }}>
                <Tooltip title="Subscriptor" placement="top">
                  <Badge color="blue" />
                </Tooltip>{" "}
                {record.name}
              </div>
            );
          }
          return (
            <div style={{ display: "flex" }}>
              <Tooltip title="Invitado">
                <Badge color="#878787" />
              </Tooltip>{" "}
              {record.name}
            </div>
          );
        },
        width: 450,
      },
      {
        title: "RFC",
        dataIndex: "rfc",
      },
    ];
    return newColumns;
  }, [userData, companies]);

  useEffect(() => {
    setFilteredData(
      _.filter(companies, (value) => {
        return (
          value.name.toUpperCase().search(search.toUpperCase()) !== -1 ||
          value.rfc.toUpperCase().search(search.toUpperCase()) !== -1
        );
      })
    );
  }, [search, companies]);

  return (
    <div className={s.Main}>
      <Card className={s.Card}>
        <h5 id="im-select-company">Seleccionar empresa</h5>
        <div className={s.FilterBar}>
          <Input.Search
            id="select-company-search"
            value={search}
            className={s.SearchInput}
            placeholder="Buscar..."
            allowClear
            onChange={(ev) => setSearch(ev.target.value)}
          />
          <Button
            id="select-company-new"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(P.CREATECOMPANY.path)}
          >
            {screens.sm ? "Nueva" : ""}
          </Button>
        </div>
        <Table
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => changeCompany(record.identifier, userData),
            };
          }}
          columns={columns}
          dataSource={wasUserChanged ? [] : filteredData}
          size="middle"
          rowClassName={s.Row}
          loading={isFetching || wasUserChanged}
        />
        {(companies.length === 0 && !isFetching) && (
          <Button
            className={s.BuySubButton}
            type="primary"
            onClick={() => navigate(P.SUBSCRIPTION.path)}
          >
            Comprar suscripción
          </Button>
        )}
      </Card>
    </div>
  );
}

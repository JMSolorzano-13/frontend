import { useEffect, useState } from "react";
import moment from "moment";
import { syncRequest } from "@store/addSlice/syncRequest";
import { Modal, Typography } from "antd";
import { useSelector } from "react-redux";
import { commonSelector } from "@store/common";
import { buildModalDomain, efosDomainBuilder } from "@utils/domains";
import { authSelector } from "@store/authSlice";
import { fetchTotals } from "@api/cfdi";
import { useAppDispatch } from "@store/store";
import { LoadingOutlined } from "@ant-design/icons";

interface ADDModalProps {
  emittedActiveCount: number;
  emittedCanceledCount: number;
  modalVisible: boolean;
  moduleId: CFDIModule;
  setModalVisible: (value: boolean) => void;
  datesValue: string | null;
  activeRadioDomain: Domain;
  debouncedSearch: string;
  manageCloseModal: (value: boolean) => void;
}

export default function ADDModal(props: ADDModalProps) {
  const {
    emittedActiveCount,
    emittedCanceledCount,
    modalVisible,
    setModalVisible,
    datesValue,
    moduleId,
    activeRadioDomain,
    debouncedSearch,
    manageCloseModal,
  } = props;

  const dispatch = useAppDispatch();
  const [state, setState] = useState({
    issued: {
      available: 0,
      canceled: 0,
    },
    received: {
      available: 0,
      canceled: 0,
    },
  });
  const [fetchingTotals, setFetchingTotals] = useState(false);

  const { periodDates } = useSelector(commonSelector);
  const { company } = useSelector(authSelector);

  const dates = datesValue?.split("|");
  let syncStartDate: string[];
  let syncEndDate: string[];

  if (dates && datesValue !== "Todos") {
    syncStartDate = dates[0].split("T");
    syncEndDate = dates[1].split("T");
  }

  const onOkModal = () => {
    dispatch(
      syncRequest({
        startDate: syncStartDate[0] || "",
        endDate: `${moment(syncEndDate[0]).subtract(1, "day").format("YYYY-MM-DD")}` || "",
      })
    );
    manageCloseModal(false);
  };

  useEffect(() => {
    async function handleLoadTotals() {
      if (modalVisible && periodDates) {
        setFetchingTotals(true);
        const efosDomain = efosDomainBuilder(periodDates as string);
        const modalDomain = buildModalDomain(moduleId, efosDomain, activeRadioDomain);
        const totalsAvailable = await fetchTotals(company as string, {
          domain: modalDomain.available,
          search: debouncedSearch,
        });

        const totalsCanceled = await fetchTotals(company as string, {
          domain: modalDomain.canceled,
          search: debouncedSearch,
        });

        const totalsCanceledBoth = await fetchTotals(company as string, {
          domain: modalDomain.canceledBoth,
          search: debouncedSearch,
        });

        if (moduleId === "issued") {
          setState({
            received: {
              available:
                totalsAvailable.totals.filtered.count + totalsCanceledBoth.totals.filtered.count,
              canceled:
                totalsCanceled.totals.filtered.count + totalsCanceledBoth.totals.filtered.count,
            },
            issued: {
              available: emittedActiveCount,
              canceled: emittedCanceledCount,
            },
          });
        } else {
          setState({
            received: {
              available: emittedActiveCount,
              canceled: emittedCanceledCount,
            },
            issued: {
              available:
                totalsAvailable.totals.filtered.count + totalsCanceledBoth.totals.filtered.count,
              canceled:
                totalsCanceled.totals.filtered.count + totalsCanceledBoth.totals.filtered.count,
            },
          });
        }
        setFetchingTotals(false);
      }
    }
    handleLoadTotals();
  }, [moduleId, modalVisible]);

  return (
    <Modal open={modalVisible} onOk={() => onOkModal()} onCancel={() => setModalVisible(false)}>
      <Typography.Title level={4} style={{ fontWeight: "bold" }}>
        ¿Está seguro que quieres sincronizar todos los CFDIs?
      </Typography.Title>
      <Typography.Text>
        {" "}
        Se estarán mandando a <b>sincronizar</b> todos los <b>CFDIs </b> para{" "}
        <b>todos los tipos de comprobante</b> que se encuentren dentro del periodo
        {dates
          ? ` ${moment(dates[0]).add(1, "day").format("DD/MM/YYYY")} - ${moment(dates[1]).format(
              "DD/MM/YYYY"
            )} `
          : ""}{" "}
        tanto los emitidos como los recibidos
      </Typography.Text>
      <br />
      <br />
      <Typography.Text>
        <b>Emitidos</b>{" "}
      </Typography.Text>
      <ul style={{ marginLeft: 50, listStyleType: "disc" }}>
        <li>
          CFDIs a enviar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? <LoadingOutlined /> : state.issued.available}
          </Typography.Text>
        </li>
        <li>
          CFDIs a cancelar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? <LoadingOutlined /> : state.issued.canceled}
          </Typography.Text>
        </li>
      </ul>
      <Typography.Text>
        <b>Recibidos</b>{" "}
      </Typography.Text>
      <ul style={{ marginLeft: 50, listStyleType: "disc" }}>
        <li>
          CFDIs a enviar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? <LoadingOutlined /> : state.received.available}
          </Typography.Text>
        </li>
        <li>
          CFDIs a cancelar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? <LoadingOutlined /> : state.received.canceled}
          </Typography.Text>
        </li>
      </ul>
      <br />
      <Typography.Text>
        <b>Total</b>{" "}
      </Typography.Text>
      <ul style={{ marginLeft: 50, listStyleType: "disc" }}>
        <li>
          CFDIs a enviar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? (
              <LoadingOutlined />
            ) : (
              state.received.available + state.issued.available
            )}
          </Typography.Text>
        </li>
        <li>
          CFDIs a cancelar:{" "}
          <Typography.Text style={{ fontWeight: "bold" }}>
            {fetchingTotals ? <LoadingOutlined /> : state.received.canceled + state.issued.canceled}
          </Typography.Text>
        </li>
      </ul>
      <br />
    </Modal>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, message, Modal, Tooltip } from "antd";
import { useSelector } from "react-redux";
import CFDIAdvancedFilterSelector from "./CFDIAdvancedFilterSelector";
import { CFDI_Types } from "@constants/Enums";
import { cfdiSelector } from "@store/cfdiSlice";

type Props = {
  filterDomain: Domain;
  setFilterDomain: (domain: Domain) => void;
  moduleId: CFDIModule;
  tab: CFDI_Types;
  openAdvancedFilter: boolean;
  setOpenAdvancedFilter: (open: boolean) => void;
};

export default function CFDIAdvancedFilter(props: Props) {
  const {
    filterDomain,
    setFilterDomain,
    moduleId,
    tab,
    openAdvancedFilter,
    setOpenAdvancedFilter,
  } = props;
  const { isFetching, isFetchingTotals } = useSelector(cfdiSelector);
  const [internalDomain, setInternalDomain] = useState<Domain>(filterDomain);
  const [tempSelector, setTempSelector] = useState("");

  useEffect(() => {
    setInternalDomain(filterDomain);
  }, [filterDomain]);

  const handleOk = () => {
    for (let i = 0; i < internalDomain.length; i += 1) {
      const domain = internalDomain[i];
      for (let j = 0; j < domain.length; j += 1) {
        const val = domain[j];
        if (val === "" || (Array.isArray(val) && val.length === 0)) {
          message.error("Ningún campo puede estar vacío");
          return;
        }
      }
    }
    setFilterDomain(internalDomain);
    setOpenAdvancedFilter(false);
  };

  const handleCancel = () => {
    setOpenAdvancedFilter(false);
    setInternalDomain(filterDomain);
  };

  const changeSingleDomain = (index: number, domain: DomainItem) => {
    const newDomain: Domain = [...internalDomain];
    newDomain[index] = domain;
    setInternalDomain(newDomain);
  };

  const deleteSingleDomain = (index: number) => {
    const newDomain: Domain = [...internalDomain];
    newDomain.splice(index, 1);
    setInternalDomain(newDomain);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && tempSelector !== "") {
        setTempSelector("");
        return;
      }

      if (event.key === "Enter" && tempSelector === "") {
        handleOk();
      }
    };
    if (openAdvancedFilter) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openAdvancedFilter, handleOk]);

  const filters = useMemo(() => {
    const f: JSX.Element[] = [];
    internalDomain.forEach((domain, i) => {
      f.push(
        <CFDIAdvancedFilterSelector
          key={domain[0]}
          index={i}
          domain={domain}
          changeSingleDomain={changeSingleDomain}
          deleteSingleDomain={deleteSingleDomain}
          moduleId={moduleId}
          tab={tab}
          setTempSelector={setTempSelector}
          tempSelector=""
        />
      );
    });

    return f;
  }, [internalDomain]);

  return (
    <>
      <Tooltip title="Filtro avanzado">
        <Button
          type="default"
          icon={<FilterOutlined />}
          disabled={isFetching || isFetchingTotals}
          onClick={() => setOpenAdvancedFilter(true)}
        />
      </Tooltip>
      <Modal
        title="Filtro avanzado"
        open={openAdvancedFilter}
        okText="Aplicar"
        onOk={handleOk}
        closable={false}
        cancelText="Cancelar"
        width={650}
        onCancel={handleCancel}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {filters}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
            <Button
              id="add-filter"
              type="text"
              style={{ marginTop: 10 }}
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setInternalDomain([...internalDomain, ["", "", ""]])}
            >
              Agregar filtro
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

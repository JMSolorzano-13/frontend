import { useEffect, useState } from "react";
import { Button, Divider, Col, Tag, Select, Typography, Row, Switch, Tooltip } from "antd";
import { CheckCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { addSelector } from "@store/addSlice";
import { valueType } from "antd/lib/statistic/utils";
import { companySelector } from "@store/companySlice";
import { authSelector, showAddSectionMenu } from "@store/authSlice";
import { updateCompany } from "@store/addSlice/updateCompany";
import { useNavigate } from "react-router";
import * as P from "@constants/PageIds";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { getADDCompanies } from "@store/addSlice/getCompanies";
import { getCompanies } from "@store/companySlice/getCompanies";
import { getRequestNewCompanies } from "@store/addSlice/getRequestNewCompanies";
import styles from "./FinalStep.module.scss";
import { setADDAutomaticSync } from "@store/addSlice/setADDAutomaticSync";
import { getMetadataSyncRequest } from "@store/addSlice/getMetadataSyncRequest";
import { useAppDispatch } from "@store/store";
import { getUser } from "@api/user";
import { handleSaveCompanyLastUpdate } from "./_utils/Company_Last_Update";

const { Option } = Select;

export default function FinalStep() {
  const [addAutomatic, setAddAutomatic] = useState(false);
  const [edit, setEdit] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [pastoCompany, setPastoCompany] = useState<string | undefined>(undefined);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isCanceled } = useSubscriptionData();

  const { companies, companiesIsFetching, isLoadingADDAutomaticSetter } = useSelector(addSelector);
  const { companies: companyList } = useSelector(companySelector);
  const { company, workspace } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState("");

  const reloadUserData = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      if (workspace) {
        const access = user.access[workspace];
        setLicense(access.pasto_license_key);
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadCompanies() {
      dispatch(getADDCompanies());
      await reloadUserData();
    }
    loadCompanies();
  }, []);

  const handleChange = (value: valueType) => {
    setPastoCompany(value as string);
  };

  const handleReloadCompanies = () => {
    setReloading(true);
    dispatch(getRequestNewCompanies());
    dispatch(getADDCompanies());
    setTimeout(() => {
      setReloading(false);
    }, 18000);
  };

  const activeCompany = companyList.find((item) => item.identifier === company);

  useEffect(() => {
    function handleLoadPastoIdentifier() {
      if (activeCompany && activeCompany.pasto_company_identifier) {
        setPastoCompany(activeCompany.pasto_company_identifier);
      } else {
        setEdit(true);
      }
    }
    handleLoadPastoIdentifier();
  }, [activeCompany]);

  let addActiveCompany;

  if (companies) {
    addActiveCompany = companies.find((item) => item.pasto_company_id === pastoCompany);
  }

  useEffect(() => {
    if (activeCompany && activeCompany.add_auto_sync) {
      setAddAutomatic(true);
    } else {
      setAddAutomatic(false);
    }
  }, []);

  const onSwitchChange = () => {
    setAddAutomatic(!addAutomatic);
    if (activeCompany) {
      dispatch(setADDAutomaticSync({ automaticValue: !addAutomatic }));
    }
  };

  if (companies) {
    addActiveCompany = companies.find((item) => item.pasto_company_id === pastoCompany);
  }

  const reload = () => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  const handleEdit = () => {
    dispatch(getRequestNewCompanies());
    if (edit && pastoCompany) {
      handleSaveCompanyLastUpdate(company);
      dispatch(updateCompany({ pastoCompanyId: pastoCompany }));
      if (activeCompany) {
        setLoading(true);
        setTimeout(() => {
          dispatch(getCompanies());
          dispatch(getADDCompanies());
          setTimeout(() => {
            dispatch(showAddSectionMenu());
            if (activeCompany.pasto_company_identifier || pastoCompany) {
              dispatch(getMetadataSyncRequest());
            }
            setLoading(false);
          }, 4000);
        }, 2000);
      }
    }
    setEdit(!edit);
  };
  return (
    <div>
      <Col
        style={{
          paddingLeft: "3rem",
          minHeight: 80,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Row className={styles.StatusRow}>
          <Typography.Text className={styles.TitleMargins} style={{ fontWeight: 500 }}>
            Estatus de la instalación:
          </Typography.Text>
          <Tag icon={<CheckCircleOutlined />} color="green">
            Instalación confirmada
          </Tag>
        </Row>
        <Row className={styles.RowContainer}>
          <Typography.Text className={styles.MR_20} style={{ fontWeight: 500 }}>
            Número de licencia:
          </Typography.Text>
          <Typography.Title
            level={5}
            className={styles.BlueTitle}
            style={{ margin: "0px 0px 0px 10px" }}
          >
            {license}
          </Typography.Title>
        </Row>
      </Col>
      <Col>
        <Row style={{ marginTop: 20, marginBottom: 5 }}>
          <Typography.Title level={5} className={styles.TitleMargins}>
            Relación de compañías:
          </Typography.Title>{" "}
        </Row>
        <Row>
          <Col className={styles.FinalStepRow}>
            <Typography.Title className={styles.BlueTitle}>
              {activeCompany ? activeCompany.rfc : "RFC No encontrado"} -{" "}
              {activeCompany ? activeCompany.name : "No se encontró la compañia"}
            </Typography.Title>
            <Typography.Text>ezaudita®</Typography.Text>
          </Col>
          <Typography.Text
            style={{ marginLeft: 10, marginRight: 10, fontWeight: 500 }}
            className={styles.TitleMargins}
          >
            Relación con
          </Typography.Text>
          {!edit && pastoCompany && (
            <Col className={styles.FinalStepRow}>
              <Typography.Title className={styles.BlueTitle}>
                {addActiveCompany
                  ? `${addActiveCompany.rfc} - ${addActiveCompany.name}`
                  : "Sin compañia seleccionada"}
              </Typography.Title>
              <Typography.Text>CONTPAQi® Contabilidad - ADD</Typography.Text>
            </Col>
          )}

          {edit ? (
            <Col className={styles.FinalStepRow}>
              <div style={{ width: 532 }}>
                <Select
                  disabled={companies.length === 0 || companiesIsFetching}
                  value={pastoCompany}
                  className={styles.SelectDropDown}
                  // size="small"
                  style={{ width: 480, height: 34, marginRight: 10 }}
                  onChange={handleChange}
                  placeholder="Selecciona tu empresa del ADD"
                >
                  {companies.length > 0
                    ? companies.map((item, key) => (
                        <Option
                          key={`${key}_${item.pasto_company_id}`}
                          value={item.pasto_company_id}
                        >
                          <div style={{ display: "flex", flexDirection: "column", minHeight: 40 }}>
                            <span style={{ fontSize: 14, fontWeight: "regular" }}>{item.name}</span>
                            <span style={{ fontSize: 10, fontWeight: "regular", color: "#5F5F5F" }}>
                              <b>Base de datos:</b> {item.bdd}
                            </span>
                          </div>
                        </Option>
                      ))
                    : null}
                </Select>

                <Tooltip title="Recargar empresas">
                  <Button
                    id="add-refresh-button"
                    onClick={handleReloadCompanies}
                    icon={<SyncOutlined />}
                    disabled={companiesIsFetching || reloading}
                    loading={companiesIsFetching}
                    style={{ marginRight: 10 }}
                  />
                </Tooltip>
              </div>
              <Typography.Text>CONTPAQi® Contabilidad - ADD</Typography.Text>
            </Col>
          ) : null}
          <Button type="primary" onClick={handleEdit} loading={loading} disabled={loading}>
            {edit ? "Confirmar relación" : "Editar relación"}
          </Button>
        </Row>
      </Col>
      <Divider className={styles.Divider} />
      <Col>
        {activeCompany?.pasto_company_identifier ? (
          <>
            <Typography.Title level={5}>Sincronización automática</Typography.Title>
            <Typography.Paragraph>
              Activa la sincronización automática para que ezaudita® diariamente realice
              sincronizaciones con el ADD
            </Typography.Paragraph>
            <Row>
              <Switch
                checked={addAutomatic}
                onChange={() => onSwitchChange()}
                style={{ marginRight: 20 }}
                loading={isLoadingADDAutomaticSetter}
              />
              <Typography.Text style={{ color: "#5F5F5F" }}>
                Actualmente <b>{addAutomatic ? "activa " : "inactiva"}</b>
              </Typography.Text>
            </Row>
          </>
        ) : null}

        {isCanceled ? (
          <div className={styles.RedBanner}>
            <Typography.Text>
              <b>Servicio inactivo: </b> Para reactivarlo, renueva/ajusta los servicios de tu
              suscripción o realiza el pago pendiente desde la sección:
              <Typography.Link onClick={() => navigate(P.SUBSCRIPTION.path)}>
                {" "}
                Suscripción
              </Typography.Link>
              .
            </Typography.Text>
          </div>
        ) : null}
      </Col>
      {companies.length === 0 && (
        <Col>
          <div className={styles.YellowBanner}>
            <Typography.Text>
              No hemos podido obtener el listado de empresas del ADD. Te recomendamos verificar que
              el servidor esté encendido, que tengas conexión a Internet y que el RFC de la empresa
              en ezaudita® coincida con el del ADD. Después de verificar esto, por favor{" "}
              <Typography.Link onClick={reload}>intenta refrescar esta página.</Typography.Link>
            </Typography.Text>
          </div>
        </Col>
      )}
      {/* <Col className={styles.FinalStepContainer} xl={12}>
        {hasADDConfig ? (
          <>
            {" "}
            <Typography.Title level={5}>Conexión activa</Typography.Title>
            <Typography.Paragraph className={styles.ConnectionDescription}>
              Actualmente tienes una conexión con el ADD activa y puedes hacer uso de la sección{" "}
              <Typography.Link onClick={() => navigate(P.ADDISSUED.path)}>
                Conciliación ADD
              </Typography.Link>{" "}
              mostrada en el menú lateral para realizar conciliaciones y sincronizaciones
            </Typography.Paragraph>{" "}
          </>
        ) : null}
        </Col> */}
    </div>
  );
}

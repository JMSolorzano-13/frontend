import { CSSProperties, useEffect, useState } from "react";
import { Col, Descriptions, Row, Skeleton, Divider, Typography, DatePicker, Tag } from "antd";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";
import DefaultTable from "./tables/DefaultTable";
import PPDTable from "./tables/PPDTable";
import DefaultTotals from "./totals/DefaultTotals";
import PPDTotals from "./totals/PPDTotals";
import { IVACFDI } from "@utils/ADD/IVACFDIColumns";
import moment from "moment";
import dayjs from "dayjs";
import { ISRRecordType, UUIDsToUpdateType } from "@pages/ISR/_types/ISRTypes";
import { UpdateUUIDsType } from "@pages/IVA/_types/StateTypes";
import EgressCFDIRelatedTable from "./tables/EgressCFDIRelatedTable";
import "dayjs/locale/es";
import { theme } from "antd";

dayjs.locale("es");

type Props = {
  cfdi: CFDI | undefined;
  cfdiFromRecord?: ISRRecordType | IVACFDI | CFDI | undefined;
  modalType: string;
  visible: boolean;
  isLoading?: boolean;
  newPaymentDate?: string;
  setNewPaymentDate: (date: string) => void;
  ivaType: "IVA" | "ISR" | "Global";
  uuidsToExclude?: UUIDsToUpdateType | UpdateUUIDsType;
  setCFDIToDisplay: (cfdi: string) => void;
  setIsRelatedModal: (related: boolean) => void;
  isRelatedModal: boolean;
  isRelatedCFDI: string;
};

const titleStyle: CSSProperties = {
  fontWeight: 600,
  paddingTop: "10px",
  fontSize: "15px",
};

const itemStyle: CSSProperties = {
  padding: 0,
};

const { useToken } = theme;

export default function CFDIModalBody(props: Props) {
  const {
    cfdi,
    modalType,
    visible,
    isLoading,
    cfdiFromRecord,
    setNewPaymentDate,
    newPaymentDate,
    ivaType,
    uuidsToExclude,
    setCFDIToDisplay,
    setIsRelatedModal,
    isRelatedModal,
  } = props;
  const { token } = useToken();
  const CFDIToDisplay = cfdi;
  const [excluded, setExcluded] = useState(false);
  const excludeFromIVA = cfdiFromRecord?.ExcludeFromIVA ?? CFDIToDisplay?.ExcludeFromIVA;
  const excludeFromISR = cfdiFromRecord?.ExcludeFromISR ?? CFDIToDisplay?.ExcludeFromISR;

  useEffect(() => {
    function checkForExclusion() {
      if (cfdiFromRecord && excluded !== cfdiFromRecord.ExcludeFromIVA) {
        setExcluded(!!cfdiFromRecord.ExcludeFromIVA);
      }
    }
    checkForExclusion();
  }, [cfdiFromRecord]);

  const isValidForIVA = moment(CFDIToDisplay?.Fecha).isAfter("2022-12-01");

  const isInListToExclude = uuidsToExclude?.filter((e) => {
    return e.uuid === CFDIToDisplay?.UUID;
  });

  return (
    <>
      <Row
        id="details_modal_body"
        gutter={16}
        style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: 12 }}
      >
        <Col xs={24} md={12}>
          <h6 style={titleStyle}>Emisor</h6>
          <Descriptions
            size="small"
            labelStyle={{ fontWeight: 500 }}
            layout="horizontal"
            contentStyle={{ padding: 0 }}
          >
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active={true} paragraph={{ rows: 0, width: 100 }} />
              ) : modalType === "normal" ? (
                CFDIToDisplay?.NombreEmisor
              ) : (
                cfdi?.NombreEmisor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : modalType === "normal" ? (
                CFDIToDisplay?.RfcEmisor
              ) : (
                cfdi?.RfcEmisor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Lugar de expedición">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                CFDIToDisplay?.LugarExpedicion
              ) : (
                cfdi?.LugarExpedicion
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Régimen fiscal">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                `${
                  CFDIToDisplay?.RegimenFiscalEmisor ? CFDIToDisplay?.RegimenFiscalEmisor : ""
                } - ${
                  CFDIToDisplay?.c_regimen_fiscal_emisor?.name
                    ? CFDIToDisplay?.c_regimen_fiscal_emisor?.name
                    : ""
                }`
              ) : (
                `${cfdi?.RegimenFiscalEmisor ? cfdi?.RegimenFiscalEmisor : ""} - ${
                  cfdi?.c_regimen_fiscal_emisor?.name ? cfdi?.c_regimen_fiscal_emisor?.name : ""
                }`
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col xs={24} md={12}>
          <h6 style={titleStyle}>Receptor</h6>
          <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
            <Descriptions.Item style={itemStyle} span={3} label="Nombre">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                CFDIToDisplay?.NombreReceptor
              ) : (
                cfdi?.NombreReceptor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="RFC">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                CFDIToDisplay?.RfcReceptor
              ) : (
                cfdi?.RfcReceptor
              )}
            </Descriptions.Item>
            <Descriptions.Item style={itemStyle} span={3} label="Domicilio fiscal">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                `${
                  CFDIToDisplay?.DomicilioFiscalReceptor
                    ? CFDIToDisplay?.DomicilioFiscalReceptor
                    : ""
                }`
              ) : (
                `${
                  CFDIToDisplay?.DomicilioFiscalReceptor
                    ? CFDIToDisplay?.DomicilioFiscalReceptor
                    : ""
                }`
              )}
            </Descriptions.Item>

            <Descriptions.Item style={itemStyle} span={3} label="Régimen fiscal">
              {isLoading && modalType === "ppd" ? (
                <Skeleton active paragraph={{ rows: 0, width: 100 }} />
              ) : !modalType ? (
                `${
                  CFDIToDisplay?.RegimenFiscalReceptor ? CFDIToDisplay?.RegimenFiscalReceptor : ""
                } - ${
                  CFDIToDisplay?.c_regimen_fiscal_receptor.name
                    ? CFDIToDisplay?.c_regimen_fiscal_receptor?.name
                    : ""
                }`
              ) : (
                `${cfdi?.RegimenFiscalReceptor ? cfdi?.RegimenFiscalReceptor : ""} - ${
                  cfdi?.c_regimen_fiscal_receptor?.name ? cfdi?.c_regimen_fiscal_receptor?.name : ""
                }`
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      {modalType === "ppd" && cfdi?.payments ? (
        <>
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col xs={24} md={12}>
              <Descriptions
                size="small"
                labelStyle={{ fontWeight: 500 }}
                layout="horizontal"
                contentStyle={{ padding: 0 }}
              >
                <Descriptions.Item style={itemStyle} span={3} label="Folio Fiscal">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.UUID
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="Fecha de emisión">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    formatDisplay(cfdi?.Fecha, DisplayType.PUREDATETIME)
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="Fecha de Pago">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    formatDisplay(cfdi?.payments[0]?.FechaPago, DisplayType.PUREDATETIME)
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="No. de certificado digital">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.NoCertificado
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="Numero de operación">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.NumOperacion
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Descriptions
                size="small"
                labelStyle={{ fontWeight: 500 }}
                layout="horizontal"
                contentStyle={{ padding: 0 }}
              >
                <Descriptions.Item style={itemStyle} span={3} label="Nombre">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.NomBancoOrdExt
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="RFC emisor cuenta ordenante">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.RfcEmisorCtaOrd
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="Cuenta ordenante">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.CtaOrdenante
                  )}
                </Descriptions.Item>
                <Descriptions.Item
                  style={itemStyle}
                  span={3}
                  label="RFC emisor cuenta beneficiario"
                >
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.RfcEmisorCtaBen
                  )}
                </Descriptions.Item>
                <Descriptions.Item style={itemStyle} span={3} label="Cuenta beneficiario">
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    cfdi?.payments[0]?.CtaBeneficiario
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <h6 style={titleStyle}>Folio fiscal</h6>
              <Descriptions
                size="small"
                labelStyle={{ fontWeight: 500 }}
                layout="horizontal"
                contentStyle={{ padding: 0 }}
              >
                <Descriptions.Item style={itemStyle} span={3}>
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : modalType === "normal" ? (
                    CFDIToDisplay?.UUID
                  ) : (
                    cfdi?.UUID
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={8}>
              <h6 style={titleStyle}>Fecha / Hora de emisión</h6>
              <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
                <Descriptions.Item style={itemStyle} span={3}>
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : (
                    (formatDisplay(
                      modalType === "normal" ? CFDIToDisplay?.Fecha : cfdi?.Fecha,
                      DisplayType.PUREDATETIME
                    ) as string)
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>

            <Col xs={24} md={8}>
              <h6 style={titleStyle}>No. de certificado digital</h6>
              <Descriptions size="small" labelStyle={{ fontWeight: 500 }} layout="horizontal">
                <Descriptions.Item style={itemStyle} span={3}>
                  {isLoading && modalType === "ppd" ? (
                    <Skeleton active paragraph={{ rows: 0, width: 100 }} />
                  ) : !modalType ? (
                    CFDIToDisplay?.NoCertificado
                  ) : (
                    cfdi?.NoCertificado
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </>
      )}

      {modalType === "normal" || !cfdi?.payments ? (
        <>
          <DefaultTable
            cfdi={cfdi}
            cfdiFromRecord={cfdiFromRecord}
            visible={visible}
            isLoading={isLoading}
            isRelatedModal={isRelatedModal}
          />
          <DefaultTotals cfdi={cfdi} />
        </>
      ) : (
        <>
          <PPDTable
            cfdi={cfdi}
            loading={isLoading}
            setCFDIToDisplay={setCFDIToDisplay}
            setIsRelatedModal={setIsRelatedModal}
          />
          <PPDTotals cfdi={cfdi} loading={isLoading} />
        </>
      )}

      <Row gutter={16}>
        {modalType === "normal" ? (
          <>
            <Col xs={24} md={8} lg={6} xxl={5}>
              <h6 style={titleStyle}>Forma de pago</h6>
              <Descriptions.Item style={itemStyle} span={3}>
                {modalType === "normal" ? cfdi?.FormaPago : cfdi?.payments[0].FormaDePagoP}{" "}
                {cfdi?.c_forma_pago?.name ? `- ${cfdi?.c_forma_pago?.name}` : ""}
              </Descriptions.Item>
            </Col>

            <Col xs={24} md={8} lg={7} xxl={6}>
              <h6 style={titleStyle}>Método de pago</h6>
              <Descriptions.Item style={itemStyle} span={3}>
                {modalType === "normal" ? CFDIToDisplay?.MetodoPago : cfdi?.MetodoPago}{" "}
                {cfdi?.c_metodo_pago?.name ? `- ${cfdi?.c_metodo_pago?.name}` : ""}
              </Descriptions.Item>
            </Col>
          </>
        ) : null}

        <Col xs={24} md={8} lg={7} xxl={6}>
          <h6 style={titleStyle}>Uso del CFDI</h6>
          <Descriptions.Item style={itemStyle} span={3}>
            {isLoading && modalType === "ppd" ? (
              <Skeleton active paragraph={{ rows: 0, width: 100 }} />
            ) : modalType === "normal" ? (
              `${cfdi?.UsoCFDIReceptor ? cfdi?.UsoCFDIReceptor : ""} - ${
                cfdi?.c_uso_cfdi?.name?.replace(".", "")
                  ? cfdi?.c_uso_cfdi?.name?.replace(".", "")
                  : ""
              }`
            ) : (
              `${cfdi?.UsoCFDIReceptor ? cfdi?.UsoCFDIReceptor : ""} - ${
                cfdi?.c_uso_cfdi?.name?.replace(".", "")
                  ? cfdi?.c_uso_cfdi?.name?.replace(".", "")
                  : ""
              }`
            )}
          </Descriptions.Item>
        </Col>
        <Divider />
        {cfdi?.TipoDeComprobante === "E" ? (
          <>
            <Col xs={24} style={{ marginTop: -18, marginBottom: -30 }}>
              <h6 style={titleStyle}>CFDIs de ingreso relacionados</h6>
              {cfdi.cfdi_origin && cfdi?.cfdi_origin.length > 0 ? (
                <EgressCFDIRelatedTable
                  cfdiRelated={cfdi?.cfdi_origin}
                  setCFDIToDisplay={setCFDIToDisplay}
                  setIsRelatedModal={setIsRelatedModal}
                />
              ) : (
                <p style={{ color: "#878787", marginTop: 10, marginLeft: 10, marginBottom: 18 }}>
                  Ningún ingreso relacionado
                </p>
              )}
            </Col>
            <Divider />
          </>
        ) : null}

        {CFDIToDisplay?.TipoDeComprobante === "E" ||
        (CFDIToDisplay?.TipoDeComprobante === "I" &&
          isValidForIVA &&
          cfdi?.Version === "4.0" &&
          cfdi.MetodoPago === "PUE") ||
        ((CFDIToDisplay?.TipoDeComprobante === "P" || CFDIToDisplay?.TipoDeComprobante === "E") &&
          isValidForIVA &&
          cfdi?.Version === "4.0") ? (
          <Col xs={24} md={24} lg={24} style={{ marginLeft: -20 }}>
            <h6 style={titleStyle}>Información adicional del CFDI</h6>
            <span
              style={{ marginTop: 10, display: "flex", alignItems: "center", paddingBottom: 5 }}
            >
              Considerado para el cálculo de: {"  "}
              {(CFDIToDisplay?.TipoDeComprobante !== "P" ||
                (CFDIToDisplay?.TipoDeComprobante === "P" && CFDIToDisplay?.is_issued)) && (
                <>
                  <Tag style={{ marginLeft: 5, marginRight: 0, borderColor: "white" }}>
                    <span>
                      IVA -
                      <Typography.Text
                        style={
                          excludeFromIVA
                            ? { fontWeight: "bold", color: "#878787" }
                            : { fontWeight: "bold", color: token.colorPrimary }
                        }
                      >
                        {excludeFromIVA ? " No" : " Sí"}
                      </Typography.Text>
                    </span>
                  </Tag>
                  {CFDIToDisplay?.TipoDeComprobante !== "E" && " / "}
                </>
              )}
              {CFDIToDisplay?.TipoDeComprobante !== "E" && (
                <>
                  <Tag style={{ borderColor: "white" }}>
                    <span>
                      ISR -{" "}
                      <Typography.Text
                        style={
                          excludeFromISR
                            ? { fontWeight: "bold", color: "#878787" }
                            : { fontWeight: "bold", color: token.colorPrimary }
                        }
                      >
                        {excludeFromISR ? "No" : "Sí"}
                      </Typography.Text>
                    </span>
                  </Tag>
                </>
              )}
            </span>

            {(CFDIToDisplay.TipoDeComprobante === "I" || CFDIToDisplay.TipoDeComprobante === "E") &&
            CFDIToDisplay.MetodoPago === "PUE" &&
            CFDIToDisplay.Version === "4.0" &&
            isValidForIVA ? (
              <>
                <span style={{ display: "flex", gap: 5 }}>
                  Periodo utilizado para el cálculo IVA
                  <div id="modal_date_picker" style={{ width: "fit-content" }}>
                    <DatePicker
                      size="small"
                      picker="month"
                      disabled={
                        (isInListToExclude && isInListToExclude.length > 0) ||
                        (ivaType === "IVA"
                          ? CFDIToDisplay.ExcludeFromIVA
                          : CFDIToDisplay.ExcludeFromISR)
                      }
                      disabledDate={(current) => {
                        return (
                          current < moment("12/01/2022") ||
                          moment(`01/01/${moment().get("year") + 1}`) < current
                        );
                      }}
                      format={"MM/YYYY"}
                      defaultValue={dayjs(CFDIToDisplay?.PaymentDate)}
                      onChange={(_, stringDate) => {
                        if (stringDate) {
                          if (Array.isArray(stringDate)) {
                            const [startDate, endDate] = stringDate;
                            setNewPaymentDate(
                              `${startDate.split("/")[0]}/${endDate.split("/")[0]}`
                            );
                          } else {
                            const dateSplitted = stringDate.split("/");
                            setNewPaymentDate(`${dateSplitted[0]}/${dateSplitted[1]}`);
                          }
                        } else {
                          setNewPaymentDate("");
                        }
                      }}
                      value={
                        newPaymentDate && newPaymentDate !== ""
                          ? dayjs(
                              `${newPaymentDate.split("/")[0]}/01/${newPaymentDate.split("/")[1]}`
                            )
                          : dayjs(CFDIToDisplay?.PaymentDate)
                      }
                    />
                  </div>
                </span>
              </>
            ) : null}
          </Col>
        ) : null}
      </Row>
    </>
  );
}

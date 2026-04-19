import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import forge from "node-forge";
import { UploadChangeParam } from "antd/lib/upload";
import { RcFile, UploadFile } from "antd/lib/upload/interface";
import moment from "moment";
import s from "./CreateCompany.module.scss";
import { createCompany } from "@api/company";
import { authSelector, setCompany, setUserData } from "@store/authSlice";
import convertBase64 from "@utils/convertBase64";
import normFile from "@utils/normFile";
import * as P from "@constants/PageIds";
import http from "@api/_http";
import useGetOwnerData from "@hooks/useGetOwnerData";
import { companySelector } from "@store/companySlice";
import { IS_SIIGO } from "@utils/SIIGO/Global";

export default function CreateCompany() {
  const dispatch = useDispatch();
  // const history = useHistory()
  const navigate = useNavigate();
  const { email, ownerWorkspace } = useGetOwnerData();
  const { userData, defaultWorkspace } = useSelector(authSelector);
  const { companies } = useSelector(companySelector);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [displayErrorMessage, setDisplayErrorMessage] = useState(false);

  useEffect(() => {
    if (certFile) {
      convertBase64(certFile).then((certString) => {
        const cerKey = forge.util.decode64(certString as string);
        const asnObj = forge.asn1.fromDer(cerKey);
        const pem = forge.pki.certificateFromAsn1(asnObj);

        const nameObject = pem.subject.attributes.find((el) => el.name === "commonName");

        const rfcObject = pem.subject.attributes.find((el) => el.type === "2.5.4.45")
          ?.value as string;

        const rfcString = rfcObject?.split(" ")[0];

        form.setFieldsValue({
          companyName: nameObject?.value,
          rfc: rfcString,
          validStartDate: moment(pem.validity.notBefore),
          validEndDate: moment(pem.validity.notAfter),
        });
      });
    }
  }, [certFile]);
  const onFinish = async () => {
    setLoading(true);
    if (keyFile && certFile && defaultWorkspace) {
      try {
        const password = form.getFieldValue("password");
        const base64Key = (await convertBase64(keyFile)) as string;
        const base64Cert = (await convertBase64(certFile)) as string;

        const res = await createCompany(defaultWorkspace.id, defaultWorkspace.oldId, {
          base64Cert,
          base64Key,
          password,
        });
        const newUserData: UserData = await (await http.get("/User")).data;
        await dispatch(setUserData(newUserData));

        await dispatch(
          setCompany(String(res[0]?.identifier ?? res[0]?.id ?? "")),
        );
        message.success("Compañía creada con éxito");
        setLoading(false);

        // history.push(P.DASHBOARD.path)
        if (companies.length > 1) {
          navigate(P.SELECTCOMPANY.path);
        } else {
          navigate(P.DASHBOARD.path);
        }
        localStorage.removeItem("subNoCompany");
        window.location.reload();
      } catch (error: any) {
        const errorMessage = error.response?.data?.Message;
        const errorMessageCode = error.response?.status;
        const errorCode = error?.code;

        switch (true) {
          case errorMessage === "Invalid private key, maybe the passphrase is wrong":
            message.error(
              "Error al crear empresa, la contraseña de tu e.firma fue rechazada, verifica e intenta de nuevo",
              5
            );
            break;
          case errorCode === "ERR_NETWORK":
            message.error(
              "La creación de la empresa se ha interrumpido; por favor intenta de nuevo.",
              10
            );
            setLoading(false);
            break;
          case errorMessageCode === 408 ||
            errorMessageCode === 504 ||
            errorMessage.includes("Request Timeout") ||
            errorMessage.includes("408 Request Timeout") ||
            errorMessage.includes("The server timed out waiting for the request"):
            message.error(
              "La creación de la empresa se ha interrumpido; por favor intenta de nuevo.", 10
            );
            setLoading(false);
            break;
          case errorMessage.includes("You have reached the maximum number of companies"):
            message.info(
              "No es posible agregar la nueva empresa, se ha alcanzado el máximo de empresas permitidos en tu suscripción",
              5
            );
            break;
          case errorMessage === "Certificate is not a FIEL":
            message.error(
              "Error al crear empresa, los archivos enviados, no corresponde a los de una e.firma, verifica que no sean de un certificado de facturación",
              7
            );
            break;
          case errorMessage === "Certificate is expired. Please upload a new one.":
            message.error(
              "Error al actualizar la FIEL, el certificado está expirado, verifica que la FIEL esté vigente.",
              7
            );
            break;
          case errorMessage === "Certificate is not yet valid. Please upload a new one.":
            message.error(
              "Error al actualizar la FIEL, el certificado aún no es válido, verifica que la FIEL esté vigente.",
              7
            );
            break;
          case errorMessage.includes("is not active"):
            message.error(
              "La suscripción no está activa, activa tu suscripción para poder crear una empresa",
              7
            );
            break;
          case errorMessage.includes("already in Workspace"):
            message.error(
              "No fue posible crear la compañía. La compañía ya existe en el workspace"
            );
            break;
          case errorMessage.includes("La llave privada no corresponde al certificado."):
            message.error(
              "El archivo de certificado (.cer) y el archivo llave (.key), no corresponden, verifica que son los archivos correctos."
            );
            break;
          case errorMessage.includes("The private key does not match the certificate"):
            message.error(
              "El archivo .key no corresponde al certificado (.cer) cargado; verifica que estés utilizando los archivos correctos e intenta de nuevo."
            );
            break;
          case errorMessage.includes("Not a proper certificate"):
            message.error(
              "El archivo que intentas utilizar no es un certificado (.cer) o se encuentra dañado; selecciona los archivos correctos e intenta de nuevo."
            );
            break;
          case errorMessage.includes("Attempting to create company with RFC") ||
            errorMessage.includes("already in freemium workspaces"):
            message.error("Error al crear la compañía");
            setDisplayErrorMessage(true);
            break;
          default:
            message.error("Error al crear la compañía");
            break;
        }
        setLoading(false);
      }
    }
  };

  const handleKeyBefore = (file: RcFile) => {
    if (file.name.split(".")[1] === "key") {
      return false;
    }
    message.error("Archivo inválido, favor de utilizar una llave");
    return Upload.LIST_IGNORE;
  };

  const handleKeyUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    try {
      setKeyFile(info.fileList[0].originFileObj as File);
    } catch (error) {
      console.warn("Setting key as null");
      setKeyFile(null);
    }
  };

  const handleCertBefore = (file: RcFile) => {
    if (file.name.split(".")[1] === "cer") {
      return false;
    }
    message.error("Archivo inválido, favor de utilizar un certificado");
    return Upload.LIST_IGNORE;
  };

  const handleCertUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    try {
      setCertFile(info.fileList[0].originFileObj as File);
    } catch (error) {
      console.warn("Setting cert as null");
      setCertFile(null);
    }
  };

  const removeSatCert = () => {
    setCertFile(null);
    form.setFieldsValue({
      rfc: "",
      companyName: "",
      validStartDate: null,
      validEndDate: null,
    });
  };

  const removeKeyFile = () => {
    setKeyFile(null);
  };

  const rfcToCreate = form.getFieldValue("rfc");
  const htmlMailtoBody = `<b style="font-size: 11px">
  <i>Conserva como parte del correo el siguiente mensaje%2c este ayudará al equipo de <span style="color: #4682B4">ezaudita</span> a brindarte una solución ágil.</i>
  </b> <br><br>
  <span style="font-size: 12px"><b>Cuenta: ${email}</b></span> -
  <span style="font-size: 12px"><b>WorkspaceID: ${ownerWorkspace}</b></span> <br>
  <span style="font-size: 12px">El RFC ${rfcToCreate} ya existe en otras cuentas freemium.</span>`;

  const mailtoValue = `mailto: ventas@ezaudita.com&subject=RFC freemium duplicado&body=${htmlMailtoBody}`;

  return (
    <div className={s.Main}>
      <Card className={s.Card}>
        <h5 id="im-create-company">Crear empresa</h5>
        {displayErrorMessage ? (
          <Alert
            style={{ marginTop: -15, marginBottom: 20 }}
            message={
              IS_SIIGO ? (
                <span>
                  El RFC ya se encuentra en uso en al menos una cuenta con plan de prueba. Es
                  necesario contratar un plan para poder dar de alta el RFC.
                </span>
              ) : (
                <span>
                  El RFC ya se encuentra en uso en al menos una cuenta con plan de prueba. Es
                  necesario contratar un plan para poder dar de alta el RFC, por favor contacta a{" "}
                  <a style={{ color: "#0070bb" }} href={mailtoValue}>
                    ventas@ezaudita.com
                  </a>
                </span>
              )
            }
            type="warning"
            closable
          />
        ) : null}
        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>
          <Row gutter={24}>
            <Col xs={12} md={8}>
              <Form.Item
                label="Certificado de la FIEL"
                name="SATCert"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: "El certificado del SAT es requerido",
                  },
                ]}
              >
                <Upload
                  name="cert"
                  accept=".cer"
                  beforeUpload={handleCertBefore}
                  onChange={handleCertUpload}
                  maxCount={1}
                  disabled={loading}
                  onRemove={removeSatCert}
                >
                  <Button id="upload-cert-button" icon={<UploadOutlined />}>
                    Subir
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={12} md={8}>
              <Form.Item
                name="SATKey"
                label="Key"
                required
                rules={[{ required: true, message: "La llave del SAT es requerida" }]}
              >
                <Upload
                  name="key"
                  accept=".key"
                  beforeUpload={handleKeyBefore}
                  onChange={handleKeyUpload}
                  maxCount={1}
                  onRemove={removeKeyFile}
                >
                  <Button id="upload-key-button" icon={<UploadOutlined />} className={s.Button}>
                    Subir
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={20} sm={12} md={8}>
              <Form.Item
                id="newcompany-password-input"
                name="password"
                label="Contraseña de la FIEL"
                required
                rules={[
                  {
                    required: true,
                    message: "Contraseña de certificado es requerida",
                  },
                ]}
              >
                <Input.Password id="newcompany-password-input" type="password" />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="companyName" label="Nombre">
                <Input id="newcompany-name-input" type="text" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="rfc" label="RFC">
                <Input id="newcompany-rfc-input" type="text" disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name="validStartDate" label="Válido desde">
                <DatePicker style={{ width: "100%" }} placeholder="" disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="validEndDate" label="Válido hasta">
                <DatePicker style={{ width: "100%" }} placeholder="" disabled />
              </Form.Item>
            </Col>
          </Row>
          <div className={s.BottomActions}>
            <Space>
              {Object.keys(userData?.access ?? {}).length > 0 ? (
                <Button
                  id="newcompany-cancel-button"
                  type="default"
                  onClick={() => navigate("/select-company")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              ) : null}
              <Button
                id="newcompany-submit-button"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Crear
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}

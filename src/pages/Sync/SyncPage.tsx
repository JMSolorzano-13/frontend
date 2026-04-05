import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Form, message } from "antd";
import forge from "node-forge";
import { satSelector } from "@store/satSlice";
import { getSatConfig } from "@store/satSlice/getSatConfig";
import convertBase64 from "@utils/convertBase64";
import { authSelector } from "@store/authSlice";
import { useAppDispatch } from "@store/store";
import SATLog from "@pages/Settings/SATSettings/SATLog";

const { Title } = Typography;

export default function SATSettings() {
  const dispatch = useAppDispatch();
  const { configError } = useSelector(satSelector);
  const { rfc } = useSelector(authSelector);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getSatConfig());
  }, []);

  useEffect(() => {
    if (configError) message.error(configError);
  }, [configError]);

  useEffect(() => {
    if (certFile) {
      convertBase64(certFile).then((certString) => {
        const cerKey = forge.util.decode64(certString as string);
        const asnObj = forge.asn1.fromDer(cerKey);
        const pem = forge.pki.certificateFromAsn1(asnObj);

        const rfcObject = pem.subject.attributes.find((el) => el.type === "2.5.4.45")
          ?.value as string;

        const rfcString = rfcObject?.split(" ")[0];

        if (rfc !== rfcString) {
          message.error("El RFC del certificado no coincide con el RFC de la compañía actual");
          form.setFieldsValue({
            cert: [],
          });
          setCertFile(null);
        }
      });
    }
  }, [certFile]);

  return (
    <>
      <Title level={5} style={{ fontWeight: 400 }} id="title-descargas-cfdis">
        Descargas de CFDIs sincronizados desde el SAT
      </Title>
      <div className="bg-white p-6">
        <SATLog />
      </div>
    </>
  );
}

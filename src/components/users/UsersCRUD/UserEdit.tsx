import { Button, Form, message, Modal, Select, Switch } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { updatePermissions } from "@api/user";
import usePermissions from "@hooks/usePermissions";
import { companySelector } from "@store/companySlice";
import { getCompanies } from "@store/companySlice/getCompanies";
import getUsers from "@store/userSlice/getUsers";
import { useAppDispatch } from "@store/store";
import { userSelector } from "@store/userSlice";
import { useNavigate } from "react-router-dom";
import useSubscriptionData from "@hooks/useSubscriptionData";
import { salesSelector } from "@store/salesSlice";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  userValues?: {
    emails: string[];
    roles: string[];
    companies: number[];
  };
  editMode?: boolean;
};

export default function UserEdit(props: Props) {
  const { visible, setVisible, userValues, editMode } = props;
  const { canInviteWithPayroll } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const companyStore = useSelector(companySelector);
  const { users } = useSelector(userSelector);
  const { subNoCompany } = useSelector(salesSelector);
  const { maxUsers } = useSubscriptionData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (companyStore.companies.length === 0 && !subNoCompany) {
      dispatch(getCompanies());
    }
  }, [dispatch, companyStore.companies]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        userValues
          ? {
              emails: userValues.emails,
              companies: userValues.companies,
              payrollAccess: userValues.roles.includes("PAYROLL"),
            }
          : { payrollAccess: canInviteWithPayroll }
      );
    }
  }, [visible]);

  const onCancel = () => {
    if (loading) return;
    setVisible(false);
    form.resetFields();
  };

  const onFinish = async (values: {
    emails: string[];
    companies: number[];
    payrollAccess?: boolean;
  }) => {
    const { emails, companies, payrollAccess } = values;

    if (maxUsers === users.length && !editMode) {
      message.info({
        content: (
          <span>
            Ya no tienes espacios para invitar a más usuarios, contrata usuarios adicionales desde
            la sección de{" "}
            <a style={{ color: "#0070b3" }} onClick={() => navigate("/subscription")}>
              Suscripción
            </a>
          </span>
        ),
        duration: 5,
      });
      return;
    }

    setLoading(true);
    try {
      const roles = ["OPERATOR"];
      if (!editMode) {
        if (payrollAccess) roles.push("PAYROLL");

        const identifiers = companies
          .map((id) => {
            const company = companyStore.companies.find((company) => company.id === id);
            return company ? company.identifier : null;
          })
          .filter((identifier) => identifier !== null);

        const permissions = identifiers.reduce((acc, c) => {
          if (c) {
            acc[c] = roles;
          }
          return acc;
        }, {} as { [key: string]: string[] });

        await updatePermissions({
          emails: emails.map((email) => {
            return email.toLowerCase();
          }),
          permissions,
        });
        message.success("Usuario invitado");
        dispatch(getUsers());
        setVisible(false);
        form.resetFields();
      } else {
        if (payrollAccess) roles.push("PAYROLL");
        const permissions: { [key: string]: string[] } = {};
        companyStore.companies.forEach((c) => {
          if (companies.includes(c.id)) {
            permissions[c.identifier] = roles;
          } else {
            permissions[c.identifier] = [];
          }
        });
        if (companies.length === 0) {
          message.error("Seleccione al menos una empresa");
        } else {
          await updatePermissions({
            emails,
            permissions,
          });
          message.success("Usuario actualizado");
          dispatch(getUsers());
          setVisible(false);
          form.resetFields();
        }
      }
    } catch (error: any) {
      const errorMessage = error.message;
      switch (true) {
        case errorMessage.includes("You have reached the maximum number of enrolls"):
          message.info(
            "No es posible agregar más usuarios a tu empresa, ha llegado al máximo de usuarios permitidos en tu suscripción",
            5
          );
          break;
        case errorMessage.includes("is linked to another workspace or company"):
          message.error(
            "Este correo ya se encuentra como invitado a empresas de una cuenta distinta, para permitir la invitación a empresas de esta cuenta, es necesario que primero sea desvinculado de la cuenta a la que actualmente tiene permisos",
            20
          );
          break;
        default:
          message.error(`Error al ${editMode ? "actualizar" : "invitar"} usuario`);
          break;
      }
    }
    setLoading(false);
  };

  const companiesOptions = useMemo(() => {
    const els: JSX.Element[] = [];
    companyStore.companies.forEach((company) => {
      els.push(
        <Select.Option key={company.id} value={company.id}>
          {company.name}
        </Select.Option>
      );
    });

    return els;
  }, [companyStore.companies]);

  return (
    <Modal
      title={editMode ? "Editar usuario" : "Invitar usuario"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading} data-test="cancel-button">
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
          data-test="save-button"
        >
          {editMode ? "Guardar" : "Invitar"}
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Correos" name="emails">
          <Select
            mode="tags"
            dropdownStyle={{ display: "none" }}
            disabled={editMode || loading}
            allowClear
            data-test="emails-input"
          />
        </Form.Item>
        <Form.Item label="Empresas" name="companies">
          <Select
            mode="multiple"
            disabled={companyStore.isFetching || loading}
            allowClear
            filterOption={(input, option) => {
              const optionText = typeof option?.children === "string" ? option.children : "";
              return optionText.toLowerCase().includes(input.toLowerCase());
            }}
            dropdownRender={(menu) => (
              <div style={{ maxHeight: 190, overflowY: "auto" }}>{menu}</div>
            )}
            data-test="companies-input"
          >
            {companiesOptions}
          </Select>
        </Form.Item>
        {canInviteWithPayroll ? (
          <Form.Item label="Acceso a nóminas" name="payrollAccess" valuePropName="checked">
            <Switch disabled={loading} />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
}

UserEdit.prototype.defaultProps = {
  userValues: undefined,
  editMode: false,
};

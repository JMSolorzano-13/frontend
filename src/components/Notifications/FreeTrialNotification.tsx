import { closeBanner } from "@store/satSlice";
import { useAppDispatch } from "@store/store";
import { SIIGO_PORTAL_URL_SHOP } from "@utils/SIIGO/urls";
import { Alert } from "antd";

interface params {
  remainingDays: number;
}

const FreeTrialNotification = ({ remainingDays }: params) => {
  console.log({ free: remainingDays });
  const dispatch = useAppDispatch();

  return (
    <Alert
      message={
        <span>
          <strong>Prueba gratuita.</strong> Disfruta de todos los beneficios durante {remainingDays}{" "}
          días sin costo. Cuando estés listo, elige el plan que mejor se adapte a tu negocio.{" "}
          <a rel="noreferrer" href={SIIGO_PORTAL_URL_SHOP} className="text-primary cursor-pointer">
            Comprar plan
          </a>
        </span>
      }
      type="success"
      style={{ marginBottom: 10 }}
      onClose={() => dispatch(closeBanner())}
      showIcon
      closable
    />
  );
};

export default FreeTrialNotification;

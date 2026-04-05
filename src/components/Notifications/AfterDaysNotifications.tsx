import { closeBanner } from "@store/satSlice";
import { useAppDispatch } from "@store/store";
import { SIIGO_PORTAL_URL_SHOP } from "@utils/SIIGO/urls";
import { Alert } from "antd";

interface params {
  remainingDays: number;
}
const AfterDaysNotifications = ({ remainingDays }: params) => {
  console.log({ after: remainingDays });
  const dispatch = useAppDispatch();
  return (
    <Alert
      type="warning"
      style={{ marginBottom: 10 }}
      onClose={() => dispatch(closeBanner())}
      showIcon
      closable
      message={
        <span>
          <strong>Tu prueba gratuita está por vencerse.</strong> Disfruta de {remainingDays} días
          más sin costo. Cuando estés listo, elige el plan que mejor se adapte a tu negocio.{" "}
          <a rel="noreferrer" href={SIIGO_PORTAL_URL_SHOP} className="text-primary cursor-pointer">
            Comprar plan
          </a>
        </span>
      }
    />
  );
};

export default AfterDaysNotifications;

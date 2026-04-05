import { Typography, Grid } from "antd";
import IVACard from "./IVACard";
import IVACardPerformance from "./IVACardPerformance";

interface IVAViewCardsProps {
  iva: any;
  datesDifference: boolean;
  manageRightDate: (amount: number) => string;
  is_not_big: boolean;
}

const { useBreakpoint } = Grid;
export const IVAViewCards = ({
  iva,
  datesDifference,
  manageRightDate,
  is_not_big,
}: IVAViewCardsProps) => {
  const { lg, xl, xxl } = useBreakpoint();

  if (!is_not_big && (lg || xl || xxl)) {
    return (
      <div className={"flex justify-between gap-x-5 px-6"}>
        <IVACardPerformance
          amount={
            iva.response
              ? datesDifference
                ? iva.response.exercise.transferred.total
                : iva.response.period.transferred.total
              : 0
          }
          modalType="transferred"
          to="period_transferred"
        />
        <IVACardPerformance
          primary={false}
          amount={
            iva.response
              ? datesDifference
                ? iva.response.exercise.creditable.total
                : iva.response.period.creditable.total
              : 0
          }
          modalType="creditable"
          subtitle="pagado"
          to="period_creditable"
        />
        <div className="border-r my-3" />
        <div className={`flex gap-x-10 items-center justify-between`}>
          <Typography.Text className="font-bold" style={{ fontSize: 16, marginLeft: 30 }}>
            IVA a cargo
          </Typography.Text>

          <Typography.Text style={{ fontSize: 18, fontWeight: 500 }}>
            {iva.response?.period.diff === 0 && !datesDifference
              ? "No Disponible"
              : manageRightDate(
                  datesDifference
                    ? (iva.response?.exercise.diff as number)
                    : (iva.response?.period.diff as number)
                )}
          </Typography.Text>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={"flex flex-1 flex-col gap-3"}>
        <IVACard
          amount={
            iva.response
              ? datesDifference
                ? iva.response.exercise.transferred.total
                : iva.response.period.transferred.total
              : 0
          }
          modalType="transferred"
          to="period_transferred"
        />
        <IVACard
          primary={false}
          amount={
            iva.response
              ? datesDifference
                ? iva.response.exercise.creditable.total
                : iva.response.period.creditable.total
              : 0
          }
          modalType="creditable"
          subtitle="pagado"
          to="period_creditable"
        />
        <div className="border-t mx-10 my-3" />
      </div>

      <div className={`flex items-center justify-between`}>
        <Typography.Text className="font-bold" style={{ fontSize: 16, marginLeft: 30 }}>
          IVA a cargo
        </Typography.Text>

        <Typography.Text style={{color: "black", fontSize: 20, fontWeight: 500 }}>
          {iva.response?.period.diff === 0 && !datesDifference
            ? "No Disponible"
            : manageRightDate(
                datesDifference
                  ? (iva.response?.exercise.diff as number)
                  : (iva.response?.period.diff as number)
              )}
        </Typography.Text>
      </div>
    </>
  );
};

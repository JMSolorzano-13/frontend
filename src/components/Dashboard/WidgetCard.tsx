import { DisplayType, formatDisplay } from "@utils/formatDisplay";

type WidgetCardType = {
  first?: boolean;
  title: string;
  period?: number;
  excercise?: number;
};

export default function WidgetCard({ first, title, period, excercise }: WidgetCardType) {
  return (
    <div className={`flex-1 text-white py-4 px-10 ${first ? "bg-primary" : "bg-secondary"}`}>
      <h5 className="text-3xl mb-3">{title}</h5>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h5 className="font-normal">Del periodo</h5>
          <h5>{formatDisplay(period || 0, DisplayType.MONEY) as string}</h5>
        </div>
        <div className="flex justify-between">
          <h5 className="font-normal">Acumulado del ejercicio</h5>
          <h5>{formatDisplay(excercise || 0, DisplayType.MONEY) as string}</h5>
        </div>
      </div>
    </div>
  );
}

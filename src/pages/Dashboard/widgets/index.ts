import { FeaturedTopicData } from "./FeaturedTopic/FeaturedTopic";
import { LineChartTotalsData } from "./LineChartTotals/LineChartTotals";
import { TotalsData } from "./Totals/Totals";
import { NominalIncomeData } from "./NominalIncome/NominalIncome";
import { ImprovedIVAData } from "./IVAWidget/IVAWidget";

type WidgetType = {
  id: string;
  component: () => JSX.Element;
  className: string;
};

const getWidgets = (): WidgetType[] => {
  return [TotalsData, LineChartTotalsData, NominalIncomeData, ImprovedIVAData, FeaturedTopicData];
};

export default getWidgets;

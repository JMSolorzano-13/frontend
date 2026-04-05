import { DisplayType, formatDisplay } from "@utils/formatDisplay";

type RelatedEgressPropsType = {
  active_egresos: {
    Total: number;
  }[];
};

export const GetTotalEgressCFDI = (props: RelatedEgressPropsType) => {
  const { active_egresos } = props;

  const filteredEgresseUUIDs = active_egresos?.reduce((acc, value) => acc + value?.Total, 0);

  return <span>{formatDisplay(filteredEgresseUUIDs, DisplayType.MONEY) as string}</span>;
};

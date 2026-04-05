import { Skeleton } from "antd";
import s from "./WidgetCard.module.scss";
import { DisplayType, formatDisplay } from "@utils/formatDisplay";

export default function WidgetCardOld(props: WidgetCardType) {
  const { style, title, data, value } = props;

  return (
    <div className={[s.Block, style].join(" ")}>
      <h5 className={s.Header}>{title}</h5>
      {data ? (
        <h2>{formatDisplay(value, DisplayType.MONEY) as string}</h2>
      ) : (
        <h2>
          <Skeleton paragraph={false} active />
        </h2>
      )}
    </div>
  );
}

import { Card } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import s from "./FeaturedTopic.module.scss";
import { authSelector } from "@store/authSlice";
import groups from "@pages/Validations/groups";

function FeaturedTopic() {
  const { config } = useSelector(authSelector);
  const { validationIds } = config;

  const groupElements = useMemo(() => {
    const elements: JSX.Element[] = [];
    groups.forEach((g) => {
      if (validationIds.includes(g.id)) {
        elements.push(<g.component key={g.id} />);
      }
    });

    return elements;
  }, [validationIds]);

  return (
    <Card className={s.Widget}>
      <h3 className="text-3xl mb-4">Validaciones</h3>
      {groupElements}
    </Card>
  );
}

export const FeaturedTopicData = {
  id: "featuredTopic",
  component: FeaturedTopic,
  className: s.Widget,
};

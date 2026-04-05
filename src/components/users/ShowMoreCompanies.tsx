import { Tag, Tooltip } from "antd";
import { useMemo, useState } from "react";

type Companies = {
  id: number;
  name: string;
};

export const ShowMoreCompanies = ({ companies }: { companies: Companies[] }) => {
  const [showMore, setShowMore] = useState(false);
  const showMoreCompanies = useMemo(
    () => companies.slice(0, showMore ? companies.length : 3),
    [showMore, companies]
  );

  return (
    <>
      {showMoreCompanies.map((company, index) => (
        <div key={company.id} style={{ display: "flex" }}>
          <Tag color="orange">{company.name}</Tag>
          {index === showMoreCompanies.length - 1 && companies.length > 3 && (
            <Tooltip title={showMore ? "Mostrar menos" : "Mostrar más"}>
              <Tag
                style={{ cursor: "pointer" }}
                color="orange"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "-" : "+"}
              </Tag>
            </Tooltip>
          )}
        </div>
      ))}
    </>
  );
};

import { Tag, Tooltip } from "antd";

interface Props {
  value: string;
  characters: number;
}

export const GetColumnModify = ({ value, characters }: Props) => {
  return (
    <>
      {value?.length > characters ? (
        <Tooltip title={value}>
          <Tag
            style={{
              backgroundColor: "transparent",
              border: "none",
              margin: 0,
              padding: 0,
              fontSize: "14px",
            }}
          >
            {`${value?.slice(0, characters)}...`}
          </Tag>
        </Tooltip>
      ) : (
        <span style={{ fontSize: "14px" }}>{value}</span>
      )}
    </>
  );
};

interface PropsColor {
  value: string;
  characters: number;
  color: string;
}

export const GetColumnExport = ({ value, characters, color }: PropsColor) => {
  return (
    <>
      {value?.length > characters ? (
        <Tooltip title={value}>
          <Tag color={color}>{`${value.slice(0, characters)}...`}</Tag>
        </Tooltip>
      ) : (
        <Tag color={color}>{value}</Tag>
      )}
    </>
  );
};

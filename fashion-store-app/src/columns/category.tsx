import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  {
    dataIndex: "code",
    width: 120,
    fixed: "left",
    isPrimary: true,
    render: (code, record) => <span>{code}</span>,
  },
  { dataIndex: "name", width: 150, isPrimary: false },
  {
    dataIndex: "created_by",
    width: 100,
    isPrimary: false,
    render: (text, record) => record?.created_by || "-",
  },
  {
    dataIndex: "created_at",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
  },
  {
    dataIndex: "updated_by",
    width: 100,
    isPrimary: false,
    render: (text, record) => record?.updated_by || "-",
  },
  {
    dataIndex: "updated_at",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
  },
];

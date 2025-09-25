import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  { dataIndex: "username", width: 150, isPrimary: false },
  { dataIndex: "email", width: 200, isPrimary: false },
  { dataIndex: "firstName", width: 150, isPrimary: false },
  { dataIndex: "lastName", width: 150, isPrimary: false },
  { dataIndex: "role", width: 100, isPrimary: false },
  { dataIndex: "status", width: 100, isPrimary: false },
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

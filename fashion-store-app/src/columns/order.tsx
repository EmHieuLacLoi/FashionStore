import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { formatNumber } from "@utils/formatNumber";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  { dataIndex: "code", width: 150, isPrimary: false },
  {
    dataIndex: "user_id",
    width: 100,
    isPrimary: false,
    render: (text, record) => record?.user_id || "-",
  },
  {
    dataIndex: "total_amount",
    width: 120,
    isPrimary: false,
    render: (text, record) => formatNumber(record?.total_amount || 0),
  },
  {
    dataIndex: "status",
    width: 120,
    isPrimary: false,
    render: (text, record) => record?.status || "-",
  },
  {
    dataIndex: "address",
    width: 200,
    isPrimary: false,
    render: (text, record) => record?.address || "-",
  },
  {
    dataIndex: "phone_number",
    width: 120,
    isPrimary: false,
    render: (text, record) => record?.phone_number || "-",
  },
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

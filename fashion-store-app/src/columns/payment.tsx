import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { formatNumber } from "@utils/formatNumber";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  {
    dataIndex: "order_id",
    width: 100,
    isPrimary: false,
    render: (text, record) => record?.order_id || "-",
  },
  {
    dataIndex: "amount",
    width: 120,
    isPrimary: false,
    render: (text, record) => formatNumber(record?.amount || 0),
  },
  {
    dataIndex: "payment_method",
    width: 150,
    isPrimary: false,
    render: (text, record) => record?.payment_method || "-",
  },
  {
    dataIndex: "status",
    width: 120,
    isPrimary: false,
    render: (text, record) => record?.status || "-",
  },
  {
    dataIndex: "transaction_id",
    width: 150,
    isPrimary: false,
    render: (text, record) => record?.transaction_id || "-",
  },
  {
    dataIndex: "payment_date",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
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

import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { formatNumber } from "@utils/formatNumber";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  { dataIndex: "name", width: 200, isPrimary: false },
  { dataIndex: "description", width: 250, isPrimary: false },
  {
    dataIndex: "price",
    width: 120,
    isPrimary: false,
    render: (text, record) => formatNumber(record?.price || 0),
  },
  {
    dataIndex: "original_price",
    width: 120,
    isPrimary: false,
    render: (text, record) => record?.original_price ? formatNumber(record.original_price) : "-",
  },
  {
    dataIndex: "stock_quantity",
    width: 120,
    isPrimary: false,
    render: (text, record) => record?.stock_quantity || 0,
  },
  {
    dataIndex: "category_name",
    width: 150,
    isPrimary: false,
    render: (text, record) => record?.category_name || "-",
  },
  {
    dataIndex: "is_available",
    width: 100,
    isPrimary: false,
    render: (text, record) => record?.is_available ? "Available" : "Unavailable",
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

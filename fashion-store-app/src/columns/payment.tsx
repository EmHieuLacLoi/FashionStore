import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { formatNumber } from "@utils/formatNumber";
import { PaymentStatusColor } from "@constants/PaymentStatus";
import { PaymentMethodLabel } from "@constants/PaymentMethod";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  {
    dataIndex: "order_code",
    width: 150,
    isPrimary: false,
    render: (text, record) => record?.order_code || "-",
  },
  {
    dataIndex: "amount",
    width: 120,
    isPrimary: false,
    dataType: "number",
    render: (text, record) => formatNumber(record?.amount || 0),
  },
  {
    dataIndex: "payment_method",
    width: 190,
    isPrimary: false,
    render: (text, record) =>
      PaymentMethodLabel(t)[record?.payment_method || 0].label,
  },
  {
    dataIndex: "status",
    width: 150,
    isPrimary: false,
    render: (text, record) => PaymentStatusColor(t)[record?.status || 0].label,
  },
  {
    dataIndex: "payment_date",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
  },
  {
    dataIndex: "updated_by",
    width: 120,
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

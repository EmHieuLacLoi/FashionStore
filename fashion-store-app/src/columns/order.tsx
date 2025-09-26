import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { formatNumber } from "@utils/formatNumber";
import { OrderStatusColor } from "@constants/OrderStatus";

interface DetailHandler {
  onDetailClick: (record: any) => void;
}

export const columns = (
  t: TFunction,
  detailHandler: DetailHandler
): ColumnModelBaseTable[] => [
  {
    dataIndex: "code",
    width: 150,
    isPrimary: false,
    render: (code, record) => (
      <span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            detailHandler.onDetailClick(record);
          }}
        >
          {code}
        </a>
      </span>
    ),
  },
  {
    dataIndex: "user_name",
    width: 180,
    isPrimary: false,
    render: (text, record) => record?.user_name || "-",
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
    render: (text, record) => OrderStatusColor(t)[record?.status].label || "-",
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
    dataIndex: "created_at",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
  },
  {
    dataIndex: "updated_at",
    width: 150,
    dataType: "datetime",
    isPrimary: false,
  },
];

import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import type { TFunction } from "i18next";
import { ActiveStatusColor } from "@constants/ActiveStatus";
import { RoleStatusColor } from "@constants/Role";

export const columns = (t: TFunction): ColumnModelBaseTable[] => [
  { dataIndex: "username", width: 150, isPrimary: false },
  { dataIndex: "full_name", width: 150, isPrimary: false },
  { dataIndex: "email", width: 200, isPrimary: false, dataType: "email" },
  {
    dataIndex: "phone_number",
    width: 150,
    isPrimary: false,
    dataType: "phone",
  },
  {
    dataIndex: "address",
    width: 200,
    isPrimary: false,
  },
  {
    dataIndex: "role",
    width: 100,
    isPrimary: false,
    render: (text, record) => RoleStatusColor(t)[record.role].label,
  },
  {
    dataIndex: "status",
    width: 100,
    isPrimary: false,
    render: (text, record) => ActiveStatusColor(t)[record.status].label,
  },
];

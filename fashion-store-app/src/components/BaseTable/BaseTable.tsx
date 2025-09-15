import {
  Button,
  Space,
  Table,
  Tooltip,
  Row,
  Col,
  Modal,
  message,
  Input,
  Empty,
} from "antd";
import type { GetProp } from "antd/es";
import React, { useEffect, useMemo, useState, useRef } from "react";
import type { ColumnType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { formatNumber } from "@utils/formatNumber";
import "./BaseTable.scss";

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

export interface ColumnModelBaseTable extends ColumnType<any> {
  dataType?:
    | "time"
    | "datetime"
    | "date"
    | "number"
    | "phone"
    | "email"
    | "float"
    | "boolean"
    | "option"
    | "image"
    | undefined;
  isPrimary: boolean;
}

interface BaseTableProps {
  data: any[];
  props?: Omit<TableProps<any>, "dataSource" | "columns">;
  entity: string;
  handleEdit?: (data: any) => void;
  handleDelete?: (data: any) => void;
  action?: ColumnType | false;
  customActions?: (record: any) => React.ReactNode;
  getTableChange?: (data: any) => void;
  create?: (data: string) => void;
  detail?: (data: any) => void;
  search?: (data: any) => void;
  onDelete?: (data: any) => any;
  onMultipleDelete?: (data: any) => any;
  isHiddenDeleteMultiple?: boolean;
  Filter?: React.ComponentType<any>;

  columnsConfig?: ColumnModelBaseTable[];
  initialFilterValues?: any;
  total?: number;
  loading?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  size?: TableProps<any>["size"];
  keyName?: string;
  hideEditButton?: boolean | ((record: any) => boolean);
  hideDeleteButton?: boolean | ((record: any) => boolean);
  hideCreateButton?: boolean | ((record: any) => boolean);
  hidePagination?: boolean;
  hideAction?: boolean;
  hideSearchButton?: boolean;
  hideCancelButton?: boolean | ((record: any) => boolean);
  onCancel?: (data: any, reason: string) => any;
  handleCancel?: (data: any) => void;
  hideMultipleDeleteButton?: boolean;
  getCheckboxProps?: (record: any) => any;
}

const BaseTable: React.FC<BaseTableProps> = ({
  data,
  props,
  entity,
  handleEdit,
  handleDelete,
  action,
  customActions,
  create,
  detail,
  search,
  onDelete,
  onMultipleDelete,
  Filter,

  columnsConfig,
  initialFilterValues,
  total,
  loading,
  onChange,
  pageSizeOptions = ["10", "20", "50", "100"],
  size = "small",
  keyName,
  hidePagination = false,
  hideAction = false,
  hideSearchButton = false,
  hideMultipleDeleteButton = false,
  onCancel,
  handleCancel,
  getCheckboxProps,
}) => {
  const { t, i18n } = useTranslation();
  const tableRef = useRef<any>(null);
  const [columnModel, setColumnModel] = useState<ColumnModelBaseTable[]>(
    columnsConfig || []
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const filterRef = useRef<any>(null);

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState<number>(
    parseInt(pageSizeOptions[0], 10)
  );

  const [currentFilterValues, setCurrentFilterValues] = useState(
    initialFilterValues || {}
  );

  useEffect(() => {
    if (initialFilterValues) {
      setCurrentFilterValues(initialFilterValues);
    }
  }, [initialFilterValues]);

  const actionDefault: ColumnModelBaseTable = {
    title: t("common.action.table"),
    key: "action",
    fixed: "right",
    isPrimary: true,
    onHeaderCell: () => ({
      style: { textAlign: "center" },
    }),
    onCell: () => ({
      style: { textAlign: "center", backgroundColor: "#fff" },
    }),
    width: 70,
    render: (_, record) => (
      <Space size="small">
        (
        <Tooltip title={t("common.button.edit")}>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit && handleEdit(record)}
            disabled={selectedRowKeys.includes(record.id)}
          />
        </Tooltip>
        ) (
        <Tooltip title={t("common.button.cancelled")}>
          <Button
            type="text"
            icon={<StopOutlined />}
            onClick={() => handleCancelRecord(record)}
            disabled={selectedRowKeys.includes(record.id)}
          />
        </Tooltip>
        ) (
        <Tooltip title={t("common.button.delete")}>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteRecord(record)}
            disabled={selectedRowKeys.includes(record.id)}
            className={
              selectedRowKeys.includes(record.id)
                ? "!text-red-300"
                : "!text-red-500"
            }
          />
        </Tooltip>
        ){customActions && customActions(record)}
      </Space>
    ),
  };

  useEffect(() => {
    if (!columnsConfig) {
      const fetchColumns = async () => {
        try {
          const module = await import(`@configs/columns/${entity}.tsx`);
          setColumnModel(module.columns || []);
        } catch (error) {
          console.error(
            `Không tìm thấy file column cho entity: ${entity}`,
            error
          );
          setColumnModel([]);
        }
      };
      fetchColumns();
    }
  }, [entity, columnsConfig]);

  const columns = useMemo(() => {
    const processedColumns = columnModel.map((item) => {
      const newCol: ColumnType<any> = {
        ...item,
        width: item.width ?? 100,
        title: t(`${entity}.attribute.${item.dataIndex}`),
        onHeaderCell: () => ({
          style: { textAlign: "center" },
        }),
        onCell: () => {
          let textAlign: "left" | "center" | "right" = "left";
          let display: "flex" | "" = "";
          let justifyContent: "center" | "" = "";
          if (
            item.dataType &&
            (item?.dataType === "datetime" ||
              item?.dataType === "date" ||
              item?.dataType === "boolean" ||
              item?.dataType === "time")
          ) {
            textAlign = "center";
          } else if (item.dataType === "number") {
            textAlign = "right";
          } else if (item.dataType === "image") {
            display = "flex";
            justifyContent = "center";
          }
          return {
            style: { textAlign, display, justifyContent, height: 52 },
          };
        },
      };
      if (!item.render) {
        if (item.dataType && ["int", "float"].includes(item.dataType)) {
          newCol.render = (number) => {
            const decimalPlaces = item.dataType === "float" ? 2 : 0;
            return <span>{formatNumber(number, decimalPlaces)}</span>;
          };
          newCol.align = "right";
        } else if (item.dataType === "time") {
          newCol.render = (date) =>
            date ? dayjs(date).format("HH:mm:ss") : "-";
          newCol.align = "center";
        } else if (item.dataType === "date") {
          newCol.render = (date) =>
            date ? dayjs(date).format("DD/MM/YYYY") : "-";
          newCol.align = "center";
        } else if (item.dataType === "datetime") {
          newCol.render = (date) =>
            date ? dayjs(date).format("HH:mm DD/MM/YYYY") : "-";
          newCol.align = "center";
        } else if (item.dataType === "phone") {
          newCol.render = (phone) =>
            phone ? (
              <a href={`tel:${phone}`} style={{ color: "#1677ff" }}>
                {phone}
              </a>
            ) : (
              ""
            );
        } else if (item.dataType === "email") {
          newCol.render = (email) =>
            email ? (
              <a href={`mailto:${email}`} style={{ color: "#1677ff" }}>
                {email}
              </a>
            ) : (
              ""
            );
        }
        if (item.isPrimary) {
          newCol.render = (value, record) =>
            value ? (
              <div
                onClick={() => detail && detail(record)}
                style={{ color: "#1677ff", cursor: "pointer" }}
              >
                {value}
              </div>
            ) : (
              ""
            );
        }
      }

      return newCol;
    });

    if (action !== false) {
      processedColumns.push(action || actionDefault);
    }

    return processedColumns;
  }, [
    entity,
    columnModel,
    action,
    handleEdit,
    handleDelete,
    handleCancel,
    selectedRowKeys,
    i18n.language,
  ]);
  // #endregion
  const showDeleteConfirm = (
    recordName: string,
    id: string | number,
    onDelete: (id: string | number) => void
  ) => {
    Modal.confirm({
      title: t("common.delete.delete_confirm_title"),
      content: t("common.delete.delete_single_content", {
        key: recordName,
        entity: t(`${entity}.name`),
      }),
      okText: t("common.delete.confirm"),
      cancelText: t("common.delete.cancel"),
      okButtonProps: {
        style: {
          backgroundColor: "#d9534f",
          borderColor: "#d43f3a",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          color: "#333",
        },
      },
      onOk() {
        onDelete(id);
      },
    });
  };

  const showCancelConfirm = (
    recordName: string,
    onCancel: (data: any, reason: string) => void
  ) => {
    let inputValue = "";
    Modal.confirm({
      title: t("common.cancellation.cancel_confirm_title"),
      content: (
        <div>
          <div>
            {t("common.cancellation.cancel_single_content", {
              key: recordName,
            })}
          </div>
          <Input.TextArea
            style={{ margin: "16px 0", width: "100%" }}
            placeholder={t("common.cancellation.reason")}
            onChange={(e) => {
              inputValue = e.target.value;
            }}
            rows={4}
            showCount
            maxLength={255}
            autoComplete="off"
          />
        </div>
      ),
      okText: t("common.cancellation.confirm"),
      cancelText: t("common.cancellation.cancel"),
      okButtonProps: {
        style: {
          backgroundColor: "#1677ff",
          borderColor: "#1677ff",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          color: "#333",
        },
      },
      onOk() {
        onCancel(data, inputValue);
      },
    });
  };

  const showMultipleDeleteConfirm = (onDelete: () => void) => {
    Modal.confirm({
      title: t("common.delete.delete_confirm_title"),
      content: t("common.delete.delete_multiple_content"),
      okText: t("common.delete.confirm"),
      cancelText: t("common.delete.cancel"),
      okButtonProps: {
        style: {
          backgroundColor: "#d9534f",
          borderColor: "#d43f3a",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          color: "#333",
        },
      },
      onOk() {
        onDelete();
      },
    });
  };

  const handleCancelRecord = (record: any) => {
    const key = keyName ? record[keyName] : record.code;
    if (onCancel) {
      showCancelConfirm(key, async (inputValue) => {
        try {
          const rest = await onCancel(record, inputValue);
          if (rest && rest.error_status === 1) {
            message.success(t("common.cancellation.cancel_success", { key }));
          } else {
            message.error(t("common.cancellation.cancel_failed"));
          }
        } catch (error) {
          message.destroy();
          message.error(t("common.cancellation.cancel_failed"));
        }
      });
    }
  };

  const handleDeleteRecord = (record: any) => {
    const key = keyName ? record[keyName] : record.code;
    if (onDelete) {
      showDeleteConfirm(key, record.id, async (id) => {
        try {
          const rest = await onDelete(id);
          if (rest && rest.error_status === 1) {
            message.success(t("common.delete.delete_success", { key }));
          } else {
            message.error(t("common.delete.delete_failed"));
          }
        } catch (error) {
          message.destroy();
          message.error(t("common.delete.delete_failed"));
        }
      });
    }
  };

  const handleMultipleDeleteRecord = () => {
    if (onMultipleDelete) {
      showMultipleDeleteConfirm(async () => {
        try {
          const rest = await onMultipleDelete(selectedRowKeys);
          if (rest && rest.error_status === 1) {
            message.success(
              t("common.delete.delete_multiple_success", {
                count: selectedRowKeys.length,
              })
            );
            setSelectedRowKeys([]);
          } else {
            message.error(t("common.delete.delete_failed"));
          }
        } catch (error) {
          message.destroy();
          message.error(t("common.delete.delete_failed"));
        }
      });
    }
  };

  const handleTableChange = (page: number, size?: number) => {
    setCurrent(page);
    if (size) setPageSize(size);
    onChange && onChange(page, size || pageSize);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleSearch = async () => {
    if (search && filterRef.current) {
      try {
        const values = await filterRef.current.getFields();
        setCurrentFilterValues(values);
        search(values);
      } catch (error) {
        console.error("Error getting filter fields:", error);
      }
    }
  };

  const paginationConfig: TablePaginationConfig = {
    current,
    pageSize,
    total,
    showSizeChanger: true,
    pageSizeOptions,
    showTotal: (totalCount, range) => (
      <span>
        {`${t("common.table.showing")} ${range[0]}-${range[1]} ${t(
          "common.table.of"
        )} ${totalCount} ${t("common.table.items")}`}
      </span>
    ),
    onChange: handleTableChange,
    onShowSizeChange: (_, size) => handleTableChange(current, size),
    locale: {
      items_per_page: `${t("common.table.items")}`,
      jump_to: `${t("common.table.jump_to")}`,
      jump_to_confirm: `${t("common.table.jump_to_confirm")}`,
      page: `${t("common.table.page")}`,
    },
  };

  const [tableHeight, setTableHeight] = useState(700);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (tableRef.current) {
        const height = tableRef.current.offsetHeight;
        setTableHeight(height);
      }
    });

    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <div className="page-container" ref={tableRef}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Row align={"middle"} justify={"space-between"}>
              <Col className="header-page"> {t(`${entity}.name`)}</Col>
              <Col>
                {selectedRowKeys.length == 0 ? (
                  <Space size="small">
                    (
                    <Button
                      onClick={() => create && create("create")}
                      size="middle"
                      type="primary"
                      icon={<PlusOutlined />}
                      className="btn-create"
                    >
                      {t("common.button.create")}
                    </Button>
                    )
                  </Space>
                ) : (
                  <Space size="small">
                    <span>
                      {t("common.selected", { value: selectedRowKeys.length })}
                    </span>
                    (
                    <Button
                      onClick={() => handleMultipleDeleteRecord()}
                      size="middle"
                      icon={<DeleteOutlined />}
                    >
                      {t("common.button.delete")}
                    </Button>
                    )
                  </Space>
                )}
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ display: "flex" }}>
            {Filter && (
              <Filter
                ref={filterRef}
                handleSearch={search}
                initialValues={currentFilterValues}
              />
            )}
            {!hideSearchButton && (
              <Space size="small" className="space-search-btn">
                <Button
                  onClick={() => handleSearch()}
                  icon={<SearchOutlined />}
                  className="btn-create search-btn"
                >
                  {t("common.button.search")}
                </Button>
              </Space>
            )}
          </Col>

          <Col span={24} className="content-page">
            <div
              className="table-content-wrapper"
              style={{ paddingTop: "16px" }}
              ref={tableRef}
            >
              <Table
                rowKey="id"
                rowSelection={
                  !hidePagination && !hideAction && !hideMultipleDeleteButton
                    ? {
                        selectedRowKeys,
                        onChange: onSelectChange,
                        getCheckboxProps: getCheckboxProps
                          ? getCheckboxProps
                          : (record: any) => ({
                              disabled: record.disabled,
                            }),
                      }
                    : undefined
                }
                columns={columns}
                bordered
                size={size}
                scroll={{
                  y: tableHeight < 800 ? 52 * 9 : 52 * 13,
                }}
                dataSource={data}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={t("common.empty")}
                    />
                  ),
                }}
                pagination={!hidePagination ? paginationConfig : false}
                loading={loading}
                {...props}
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BaseTable;

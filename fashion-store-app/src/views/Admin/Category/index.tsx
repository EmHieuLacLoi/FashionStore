import type { Category } from "@models/category.interface";
import { message } from "antd";
import { useEffect, useState } from "react";
import FormComponent from "./form";
import { useTranslation } from "react-i18next";
import { useGetCategoryList, useDeleteCategory } from "@hooks/CategoryHooks";
import BaseTable from "@components/BaseTable/BaseTable";
import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import { columns } from "@columns/category";
import SearchAction from "./search";

const CategoryView = () => {
  const [actionType, setActionType] = useState<"create" | "update" | "delete">(
    "create"
  );
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [enabledTable, setEnabledTable] = useState<boolean>(false);

  const { t } = useTranslation();

  const [data, setData] = useState<Category[]>([]);

  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total?: number;
  }>({
    current: 1,
    pageSize: 20,
  });

  const [searchParams, setSearchParams] = useState<any>({});
  const [lastSearchParams, setLastSearchParams] = useState({});
  const { isFetching: tableLoading, refetch } = useGetCategoryList(
    {
      page: pagination.current - 1,
      size: pagination.pageSize,
      sort: "id,desc",
      ...searchParams,
    },
    {
      enabled: enabledTable,
      onSuccess: (res: any) => {
        const result = res.data.content;
        setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
        setData(result);
      },
      onError: (error: unknown) => {
        console.error(error);
        message.destroy();
        message.error(t("common.error.system_error"));
      },
    }
  );

  const create = (key: string) => {
    if (key === "create") {
      setShowModalCreate(true);
      setActionType("create");
    }
  };

  const [currentDetailData, setCurrentDetailData] = useState<any>({});

  const handleSearch = (values: any) => {
    const updatedValues = { ...values };
    setLastSearchParams(updatedValues);
    setSearchParams(updatedValues);
    setPagination((prev) => ({ ...prev, current: 1 }));
    refetch();
  };

  const columnsConfig: ColumnModelBaseTable[] = columns(t);

  const handleEditData = (record: Category) => {
    setCurrentDetailData(record);
    setActionType("update");
    setShowModalCreate(true);
  };

  const handleDeleteData = (record: Category) => {
    setCurrentDetailData(record);
    setActionType("delete");
    setShowModalCreate(true);
  };

  const useDelete = useDeleteCategory();
  const onDelete = async (id: number) => {
    try {
      const res = await useDelete.mutateAsync(id);
      if (res && res?.data?.error_status == 1) {
        return res;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <BaseTable
        entity={"environment"}
        data={data}
        loading={tableLoading}
        onChange={(page, pageSize) => {
          setPagination((prev) => ({
            ...prev,
            current: page,
            pageSize,
          }));
          refetch();
        }}
        search={handleSearch}
        Filter={SearchAction}
        initialFilterValues={lastSearchParams}
        total={pagination.total}
        columnsConfig={columnsConfig}
        create={create}
        handleEdit={handleEditData}
        handleDelete={handleDeleteData}
        onDelete={onDelete}
        keyName={"code"}
        hideMultipleDeleteButton={true}
      />
      <FormComponent
        handleCancel={() => {
          setShowModalCreate(false);
          setCurrentDetailData(undefined);
        }}
        showModal={showModalCreate}
        dataEdit={currentDetailData}
        type={actionType}
      />
    </>
  );
};

export default CategoryView;

import type { Product } from "@models/product.interface";
import { message } from "@utils/antd-static";
import { useEffect, useState } from "react";
import FormComponent from "./form";
import { useTranslation } from "react-i18next";
import { useGetProductList, useDeleteProduct } from "@hooks/ProductHooks";
import BaseTable from "@components/BaseTable/BaseTable";
import type { ColumnModelBaseTable } from "@components/BaseTable/BaseTable";
import { columns } from "@columns/product";
import SearchAction from "./search";

const ProductView = () => {
  const [actionType, setActionType] = useState<"create" | "update" | "delete">(
    "create"
  );
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);

  const { t } = useTranslation();

  const [dataResult, setDataResult] = useState<Product[]>([]);

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
  const {
    data,
    isFetching: tableLoading,
    refetch,
  } = useGetProductList(
    {
      page: pagination.current - 1,
      size: pagination.pageSize,
      sort: "id,desc",
      ...searchParams,
    },
    {
      enabled: true,
      onSuccess: (res: any) => {
        const result = res.data.content;
        setPagination((prev) => ({ ...prev, total: res.data.totalElements }));
        setDataResult(result);
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

  const handleEditData = (record: Product) => {
    setCurrentDetailData(record);
    setActionType("update");
    setShowModalCreate(true);
  };

  const handleDeleteData = (record: Product) => {
    setCurrentDetailData(record);
    setActionType("delete");
    setShowModalCreate(true);
  };

  const useDelete = useDeleteProduct();
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

  useEffect(() => {
    setDataResult(data?.data?.content);
    setPagination((prev) => ({ ...prev, total: data?.data?.totalElements }));
  }, [data]);

  return (
    <>
      <BaseTable
        entity={"product"}
        data={dataResult}
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
        keyName={"name"}
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

export default ProductView;

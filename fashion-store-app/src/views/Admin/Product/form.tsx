import moment from "moment";
import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Col,
  InputNumber,
  Switch,
  Divider,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  ProductServerStateKeysEnum,
  useCreateProduct,
  useUpdateProduct,
} from "@hooks/ProductHooks";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { MinusOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { message } from "@utils/antd-static";
import "./form.scss";
import { useGetCategoryList } from "@hooks/CategoryHooks";
import type { RcFile, UploadProps, UploadFile } from "antd/es/upload";
import { uploadImage } from "@services/UploadService";
import { useGlobalContext } from "../../../GlobalContext";

interface FormComponentProps {
  dataEdit?: any;
  showModal: boolean;
  handleCancel?: () => void;
  type: "create" | "update" | "delete";
}

const FormComponent: React.FC<FormComponentProps> = ({
  dataEdit,
  showModal,
  handleCancel,
  type,
}) => {
  const { t } = useTranslation();
  const [loadingFetch, setLoadingFetch] = useState(false);
  const { cloudinaryUrl } = useGlobalContext();
  const [form] = Form.useForm();
  const insertMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<any>([]);
  const { data: categoryList } = useGetCategoryList(
    { size: 9999999999 },
    { enabled: true }
  );

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const handleCancelPreview = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleBeforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(t("product.title.only_upload"));
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error(t("product.title.max_size"));
    }

    return isJpgOrPng && isLt5M ? true : Upload.LIST_IGNORE;
  };

  const handleCustomRequest = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadImage(formData);

      if (response && response?.url) {
        const fullUrl = response.url;

        const publicId = fullUrl.split("/upload/")[1];
        onSuccess(publicId);

        message.success(
          t("product.title.upload_success", { value: file.name })
        );
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      message.error(t("product.title.upload_fail", { value: file.name }));
      onError(error);
    }
  };

  const handleChange: UploadProps["onChange"] = (info) => {
    let newFileList = [...info.fileList];

    newFileList = newFileList.map((file) => {
      if (file.response) {
        const publicId = file.response;
        file.url = `${cloudinaryUrl}/${publicId}`;
      }
      return file;
    });

    setFileList(newFileList);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    if (categoryList) {
      setCategories(categoryList?.data?.content);
    }
  }, [categoryList]);

  const transformDates = (
    data: any,
    keyMapping: { [targetKey: string]: string },
    isForCreate = false
  ) => {
    return Object.keys(keyMapping).reduce((acc, targetKey) => {
      const sourceKey = keyMapping[targetKey];
      const dateValue = data[sourceKey];
      if (dateValue) {
        const m = moment(dateValue);
        acc[targetKey] = m.isValid()
          ? isForCreate
            ? m.format("YYYY-MM-DDTHH:mm:ss")
            : m
          : null;
      }
      return acc;
    }, {} as any);
  };

  useEffect(() => {
    if (!dataEdit || !cloudinaryUrl || type !== "update") {
      if (type === "create") {
        form.resetFields();
        setFileList([]);
      }
      return;
    }

    if (dataEdit && type === "update") {
      const mapping: { [key: string]: any } = {};

      const transformedDataBase = {
        ...dataEdit,
        ...transformDates(dataEdit, mapping),
      };

      const transformedData = transformedDataBase;
      form.setFieldsValue({
        ...transformedData,
      });

      if (dataEdit?.image_url) {
        try {
          const imagePublicIds = JSON.parse(dataEdit?.image_url);

          if (Array.isArray(imagePublicIds)) {
            const initialFileList: UploadFile[] = imagePublicIds.map(
              (publicId: string, index: number) => {
                const name = publicId.substring(publicId.lastIndexOf("/") + 1);
                return {
                  uid: `-${index + 1}`,
                  name: name,
                  status: "done",
                  url: `${cloudinaryUrl}/${publicId}`,
                  response: publicId,
                };
              }
            );
            setFileList(initialFileList);
            form.setFieldsValue({ images: initialFileList });
          }
        } catch (e) {
          console.error("Lỗi khi parse image_url:", e);
          setFileList([]);
          form.setFieldsValue({ images: [] });
        }
      } else {
        setFileList([]);
        form.setFieldsValue({ images: [] });
      }
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [dataEdit, type, form, cloudinaryUrl]);

  const submitForm = async () => {
    setLoadingFetch(true);
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      formData.name = formData.name.trim();
      formData.description = formData.description.trim();

      if (formData.variants) {
        formData.variants = formData.variants.map((variant: any) => {
          variant.color = variant.color.trim();
          variant.size = variant.size.trim();
          return variant;
        });
      }

      const imagePublicIds = formData.images
        .map((file: any) => {
          return file.response || "";
        })
        .filter(Boolean);

      delete formData.images;

      const payload = {
        ...formData,
        image_url: JSON.stringify(imagePublicIds),
      };

      let res: any;
      if (type === "create") {
        res = await insertMutation.mutateAsync(payload);
      } else {
        res = await updateMutation.mutateAsync({
          ...dataEdit,
          ...payload,
        });
      }
      if (res && (res.error_status === 1 || res.data?.error_status === 1)) {
        message.success(
          t(`common.message.${type}_success`, { value: t(`product.name`) })
        );
        queryClient.invalidateQueries({
          queryKey: [ProductServerStateKeysEnum.Items],
        });
        closeForm();
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) })
        );
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response?.data?.error_message) {
        message.destroy();
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) }) +
            ": " +
            error?.response?.data?.error_message
        );
      } else {
        message.error(
          t(`common.message.${type}_fail`, { value: t(`product.name`) })
        );
      }
    } finally {
      setLoadingFetch(false);
    }
  };

  const closeForm = () => {
    handleCancel && handleCancel();
    form.resetFields();
  };

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      footer={false}
      onCancel={closeForm}
      width={800}
      className="custom-modal"
    >
      <div
        className="text-[18px] font-semibold p-4"
        style={{ maxWidth: "95%", marginBottom: "4px" }}
      >
        {t(`product.title.${type}`)} {dataEdit?.name || ""}
      </div>

      <div className="max-h-[600px] custom-scrollbar px-4">
        <Form form={form} layout="vertical" className="compact-form">
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                label={t("product.form.name")}
                name="name"
                rules={[
                  {
                    required: true,
                    message: t("product.form.namePlaceholder"),
                  },
                ]}
              >
                <Input
                  placeholder={t("product.form.namePlaceholder")}
                  maxLength={255}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={t("product.form.category")}
                name="category_id"
                rules={[
                  {
                    required: true,
                    message: t("product.form.categoryPlaceholder"),
                  },
                ]}
              >
                <Select
                  placeholder={t("product.form.categoryPlaceholder")}
                  style={{ width: "100%" }}
                  options={categories?.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("product.form.price")}
                name="price"
                dependencies={["original_price"]}
                rules={[
                  {
                    required: true,
                    message: t("product.form.pricePlaceholder"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const originalPrice = getFieldValue("original_price");

                      if (!value || !originalPrice) {
                        return Promise.resolve();
                      }
                      if (Number(value) <= Number(originalPrice)) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(t("product.form.priceTooHigh"))
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  placeholder={t("product.form.pricePlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("product.form.originalPrice")}
                name="original_price"
              >
                <InputNumber
                  placeholder={t("product.form.originalPricePlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value?.replace(/\$\s?|(,*)/g, "") as any}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("product.form.stockQuantity")}
                name="stock_quantity"
                dependencies={["variants"]}
                rules={[
                  {
                    required: true,
                    message: t("product.form.stockQuantityPlaceholder"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const variants = getFieldValue("variants") || [];

                      const variantsSum = variants.reduce(
                        (sum: number, variant: any) =>
                          sum + (variant?.stock_quantity || 0),
                        0
                      );

                      if (variants.length === 0) {
                        if (Number(value) === 0 || !value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(t("product.form.stockMismatchNoVariant"))
                        );
                      }

                      if (Number(value) === variantsSum) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          t("product.form.stockMismatch", {
                            sum: variantsSum,
                          })
                        )
                      );
                    },
                  }),
                ]}
              >
                <InputNumber
                  placeholder={t("product.form.stockQuantityPlaceholder")}
                  min={0}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label={t("product.form.isAvailable")}
                name="is_available"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("product.form.images")}
                name="images"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[
                  {
                    required: true,
                    message: t("product.form.imagesPlaceholder"),
                  },
                ]}
              >
                <Upload
                  listType="picture-card"
                  onPreview={handlePreview}
                  customRequest={handleCustomRequest}
                  beforeUpload={handleBeforeUpload}
                  onChange={handleChange}
                  onRemove={(file) => {
                    const newFileList = fileList.filter(
                      (item) => item.uid !== file.uid
                    );
                    setFileList(newFileList);
                  }}
                  maxCount={5}
                >
                  {fileList.length >= 5 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>
                        {t("product.form.upload")}
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={t("product.form.description")}
                name="description"
              >
                <Input.TextArea
                  placeholder={t("product.form.descriptionPlaceholder")}
                  maxLength={1000}
                  autoComplete="off"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">{t("product.form.variant")}</Divider>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                <div className="max-h-[72px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 mb-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={[16, 0]} align="top">
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          label={t("product.form.color")}
                          name={[name, "color"]}
                          rules={[
                            {
                              required: true,
                              message: t("product.form.colorPlaceholder"),
                            },
                          ]}
                        >
                          <Input
                            placeholder={t("product.form.colorPlaceholder")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          label={t("product.form.size")}
                          name={[name, "size"]}
                          rules={[
                            {
                              required: true,
                              message: t("product.form.sizePlaceholder"),
                            },
                          ]}
                        >
                          <Input
                            placeholder={t("product.form.sizePlaceholder")}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          {...restField}
                          label={t("product.form.stockQuantityVariant")}
                          name={[name, "stock_quantity"]}
                          dependencies={["variants"]}
                          rules={[
                            {
                              required: true,
                              message: t(
                                "product.form.stockQuantityVariantPlaceholder"
                              ),
                            },
                          ]}
                        >
                          <InputNumber
                            min={0}
                            style={{ width: "100%" }}
                            placeholder="0"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Form.Item label=" ">
                          <Button
                            type="text"
                            icon={<MinusOutlined />}
                            onClick={() => remove(name)}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                </div>

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t("product.form.addVariant")}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </div>

      <div className="flex gap-2 pt-2 justify-end p-4">
        <Button disabled={loadingFetch} onClick={closeForm} type="text">
          {t("common.button.cancel")}
        </Button>
        <Button loading={loadingFetch} onClick={submitForm} type="primary">
          {t("common.button.save")} <SaveOutlined />
        </Button>
      </div>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancelPreview}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default FormComponent;

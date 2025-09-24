import React, { useRef, useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Line,
  Text,
  Group,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import {
  Layout,
  Menu,
  Button,
  Input,
  ColorPicker,
  Slider,
  Upload,
  Divider,
  Switch,
  message,
} from "antd";
import {
  FormatPainterFilled,
  FormatPainterOutlined,
  FontSizeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UploadOutlined,
  SwapOutlined,
} from "@ant-design/icons";

import frontImg from "@assets/images/front.svg";
import backImg from "@assets/images/back.svg";
import type { RcFile } from "antd/es/upload";
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;
interface DesignText {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  rotation: number;
}

interface DesignImage {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement | null;
  rotation: number;
}

interface DesignLine {
  points: number[];
  color: string;
  width: number;
  isEraser: boolean;
}

interface DesignSide {
  lines: DesignLine[];
  texts: DesignText[];
  images: DesignImage[];
}

interface DesignState {
  front: DesignSide;
  back: DesignSide;
}

const TransformerComponent: React.FC<{
  selectedShapeName: string;
  shapesRef: React.MutableRefObject<any[]>;
}> = ({ selectedShapeName, shapesRef }) => {
  const trRef = useRef<any>(null);

  React.useEffect(() => {
    if (trRef.current) {
      const selectedNode = shapesRef.current.find(
        (node) => node.name() === selectedShapeName
      );

      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
      } else {
        trRef.current.nodes([]);
      }

      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeName, shapesRef.current.length]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

const DesignPage = () => {
  const [tshirtFrontImage] = useImage(frontImg);
  const [tshirtBackImage] = useImage(backImg);

  const { t } = useTranslation();

  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");

  const [designState, setDesignState] = useState<DesignState>({
    front: { lines: [], texts: [], images: [] },
    back: { lines: [], texts: [], images: [] },
  });

  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [currentWidth, setCurrentWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

  const [newText, setNewText] = useState(
    localStorage.getItem("language") === "vi" ? "Văn bản" : "Text"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const currentDesign = designState[currentSide];
  const { lines, texts, images } = currentDesign;

  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  const shapeNodesRef = useRef<any[]>([]);

  const currentTshirtImage =
    currentSide === "front" ? tshirtFrontImage : tshirtBackImage;

  const updateDesignState = (newSideDesign: DesignSide) => {
    setDesignState({
      ...designState,
      [currentSide]: newSideDesign,
    });
  };

  const handleMouseDown = (e: any) => {
    if (selectedId) return;

    isDrawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();

    const newLines = [
      ...lines,
      {
        points: [pos.x, pos.y],
        color: isErasing ? "#ffffff" : currentColor,
        width: currentWidth,
        isEraser: isErasing,
      },
    ];

    updateDesignState({ ...currentDesign, lines: newLines });
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const newLines = lines.slice(0, lines.length - 1).concat(lastLine);
    updateDesignState({ ...currentDesign, lines: newLines });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleStageClick = (e: any) => {
    if (
      e.target === e.target.getStage() ||
      e.target.name() === "tshirt-background"
    ) {
      setSelectedId(null);
      return;
    }
    const id = e.target.name();
    if (id) {
      setSelectedId(id);
    }
  };

  const CLIP_AREAS = {
    front: {
      x: 120,
      y: 90,
      width: 260,
      height: 490,
    },
    back: {
      x: 120,
      y: 50,
      width: 260,
      height: 520,
    },
  };

  const dragBoundHandler = (pos: { x: number; y: number }, node: any) => {
    const currentClipArea = CLIP_AREAS[currentSide];

    const LIMIT_X = currentClipArea.x;
    const LIMIT_Y = currentClipArea.y;
    const LIMIT_W = currentClipArea.width;
    const LIMIT_H = currentClipArea.height;

    const objectWidth = node.width() * node.scaleX();
    const objectHeight = node.height() * node.scaleY();

    const newX = Math.max(pos.x, LIMIT_X);
    const finalX = Math.min(newX, LIMIT_X + LIMIT_W - objectWidth);

    const newY = Math.max(pos.y, LIMIT_Y);
    const finalY = Math.min(newY, LIMIT_Y + LIMIT_H - objectHeight);

    return {
      x: finalX,
      y: finalY,
    };
  };

  const addText = () => {
    if (!newText.trim()) return;
    const newId = `text-${Date.now()}`;
    const newTexts = [
      ...texts,
      {
        id: newId,
        x: 150,
        y: 150,
        text: newText,
        fontSize: 30,
        color: "#000000",
        rotation: 0,
      },
    ];
    updateDesignState({ ...currentDesign, texts: newTexts });
    setSelectedId(newId);
  };

  const deleteSelected = () => {
    if (!selectedId) return;

    const isText = texts.some((t) => t.id === selectedId);

    if (isText) {
      const newTexts = texts.filter((t) => t.id !== selectedId);
      updateDesignState({ ...currentDesign, texts: newTexts });
    } else {
      const newImages = images.filter((img) => img.id !== selectedId);
      updateDesignState({ ...currentDesign, images: newImages });
    }

    setSelectedId(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewText(value);

    if (selectedId && texts.some((t) => t.id === selectedId)) {
      const newTexts = texts.map((t) =>
        t.id === selectedId ? { ...t, text: value } : t
      );
      updateDesignState({ ...currentDesign, texts: newTexts });
    }
  };

  const handleImageUpload = (file: RcFile): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error(`${file.name} ${t("design_page.upload_size_limit")}`);
        resolve(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const newId = `image-${Date.now()}`;
          const newImages = [
            ...images,
            {
              id: newId,
              x: 150,
              y: 150,
              width: 100,
              height: 100,
              image: img,
              rotation: 0,
            },
          ];
          updateDesignState({ ...currentDesign, images: newImages });
          setSelectedId(newId);

          resolve(false);
        };
        img.onerror = () => {
          message.error(t("design_page.upload_failed"));
          reject();
          resolve(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragEnd = (e: any, type: "text" | "image") => {
    const id = e.target.name();
    const newX = e.target.x();
    const newY = e.target.y();

    if (type === "text") {
      const newTexts = texts.map((t) =>
        t.id === id ? { ...t, x: newX, y: newY } : t
      );
      updateDesignState({ ...currentDesign, texts: newTexts });
    } else {
      const newImages = images.map((img) =>
        img.id === id ? { ...img, x: newX, y: newY } : img
      );
      updateDesignState({ ...currentDesign, images: newImages });
    }
  };

  const handleTransformEnd = (e: any, type: "text" | "image") => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newRotation = node.rotation();

    const id = node.name();

    const isText = type === "text";

    const originalText = isText
      ? (texts.find((t) => t.id === id) as DesignText | undefined)
      : undefined;

    const originalImage = !isText
      ? (images.find((img) => img.id === id) as DesignImage | undefined)
      : undefined;

    if (!originalText && !originalImage) return;

    node.scaleX(1);
    node.scaleY(1);

    const newX = node.x();
    const newY = node.y();

    if (isText && originalText) {
      let newFontSize = originalText.fontSize;

      newFontSize = Math.max(5, Math.round(newFontSize * scaleX));

      node.fontSize(newFontSize);

      const newTexts = texts.map((t) =>
        t.id === id
          ? {
              ...t,
              x: newX,
              y: newY,
              rotation: newRotation,
              fontSize: newFontSize,
            }
          : t
      );
      updateDesignState({ ...currentDesign, texts: newTexts });
    } else if (originalImage) {
      const newWidth = originalImage.width * scaleX;
      const newHeight = originalImage.height * scaleY;

      const newImages = images.map((img) =>
        img.id === id
          ? {
              ...img,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
              rotation: newRotation,
            }
          : img
      );
      updateDesignState({ ...currentDesign, images: newImages });
    }
  };

  const handleExportAll = () => {
    setSelectedId(null);
    const originalSide = currentSide;

    const stage = stageRef.current;
    if (!stage) return;

    setCurrentSide("front");

    setTimeout(() => {
      const frontUri = stage.toDataURL({ pixelRatio: 2 });
      setCurrentSide("back");

      setTimeout(() => {
        if (!stageRef.current) return;
        const backUri = stageRef.current.toDataURL({ pixelRatio: 2 });

        const finalCanvas = document.createElement("canvas");
        const ctx = finalCanvas.getContext("2d");

        const FINAL_W = 1000;
        const FINAL_H = 1200;
        const SPACING = 50;

        finalCanvas.width = FINAL_W * 2 + SPACING;
        finalCanvas.height = FINAL_H;

        const frontImgObj = new Image();
        frontImgObj.onload = () => {
          ctx?.drawImage(frontImgObj, 0, 0, FINAL_W, FINAL_H);

          const backImgObj = new Image();
          backImgObj.onload = () => {
            ctx?.drawImage(backImgObj, FINAL_W + SPACING, 0, FINAL_W, FINAL_H);

            const finalUri = finalCanvas.toDataURL("image/png", 1.0);
            const link = document.createElement("a");
            link.download = "tshirt-design.png";
            link.href = finalUri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            message.success(t("design_page.export_success"));

            setCurrentSide(originalSide);
          };
          backImgObj.src = backUri;
        };
        frontImgObj.src = frontUri;
      }, 100);
    }, 100);
  };

  const handleExportJSON = () => {
    const jsonState = {
      front: {
        lines: designState.front.lines,
        texts: designState.front.texts,
        images: designState.front.images.map((img) => ({
          ...img,
          image: `image-data-${img.id}`,
        })),
      },
      back: {
        lines: designState.back.lines,
        texts: designState.back.texts,
        images: designState.back.images.map((img) => ({
          ...img,
          image: `image-data-${img.id}`,
        })),
      },
    };

    const json = JSON.stringify(jsonState, null, 2);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "tshirt-design.json";
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success("Xuất trạng thái JSON thành công!");
  };

  const renderDesignElements = (
    textsToRender: DesignText[],
    imagesToRender: DesignImage[]
  ) => {
    shapeNodesRef.current = [];

    return (
      <>
        {textsToRender.map((t) => (
          <Text
            key={t.id}
            name={t.id}
            text={t.text}
            x={t.x}
            y={t.y}
            fontSize={t.fontSize}
            fill={t.color}
            draggable
            dragBoundFunc={function (this: any, pos: { x: number; y: number }) {
              return dragBoundHandler(pos, this);
            }}
            rotation={t.rotation}
            onClick={handleStageClick}
            onTap={handleStageClick}
            onDragEnd={(e) => handleDragEnd(e, "text")}
            onTransformEnd={(e) => handleTransformEnd(e, "text")}
            ref={(node) => {
              if (
                node &&
                !shapeNodesRef.current.some((n) => n.name() === t.id)
              ) {
                shapeNodesRef.current.push(node);
              }
            }}
          />
        ))}

        {imagesToRender.map(
          (img) =>
            img.image && (
              <KonvaImage
                key={img.id}
                name={img.id}
                image={img.image}
                x={img.x}
                y={img.y}
                width={img.width}
                height={img.height}
                draggable
                dragBoundFunc={function (
                  this: any,
                  pos: { x: number; y: number }
                ) {
                  return dragBoundHandler(pos, this);
                }}
                rotation={img.rotation}
                onClick={handleStageClick}
                onTap={handleStageClick}
                onDragEnd={(e) => handleDragEnd(e, "image")}
                onTransformEnd={(e) => handleTransformEnd(e, "image")}
                ref={(node) => {
                  if (
                    node &&
                    !shapeNodesRef.current.some((n) => n.name() === img.id)
                  ) {
                    shapeNodesRef.current.push(node);
                  }
                }}
              />
            )
        )}
      </>
    );
  };

  const linesToRender = lines.map((line) => {
    const strokeColor = line.isEraser ? "#ffffff" : line.color;
    const strokeWidth = line.isEraser ? line.width + 10 : line.width;

    return (
      <Line
        key={line.points.join("")}
        points={line.points}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={"source-over"}
      />
    );
  });

  const textSelected = texts.some((t) => t.id === selectedId);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={350}
        theme="light"
        style={{
          padding: "16px",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          {t("design_page.title")}
        </h1>

        <Menu
          mode="horizontal"
          selectedKeys={[currentSide]}
          onSelect={({ key }) => {
            setSelectedId(null);
            setCurrentSide(key as "front" | "back");
          }}
          style={{ marginBottom: "20px", borderBottom: "1px solid #f0ff0" }}
        >
          <Menu.Item key="front" icon={<SwapOutlined />}>
            {t("design_page.front")}
          </Menu.Item>
          <Menu.Item key="back" icon={<SwapOutlined />}>
            {t("design_page.back")}
          </Menu.Item>
        </Menu>

        <div style={{ padding: "0 8px 16px 8px" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
            {t("design_page.setting_pencil")}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "500" }}>{t("design_page.color")}:</span>
            <ColorPicker
              value={currentColor}
              onChange={(_, hex) => setCurrentColor(hex)}
              size="large"
            />
          </div>
          <div style={{ marginBottom: "12px" }}>
            <span style={{ fontWeight: "500" }}>
              {t("design_page.width_pencil")}:
            </span>
            <Slider
              min={1}
              max={20}
              value={currentWidth}
              onChange={setCurrentWidth}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span style={{ fontWeight: "500" }}>
              {t("design_page.erase_mode")}:
            </span>
            <Switch
              checkedChildren={<FormatPainterFilled />}
              unCheckedChildren={<FormatPainterOutlined />}
              checked={isErasing}
              onChange={setIsErasing}
            />
          </div>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={() => updateDesignState({ ...currentDesign, lines: [] })}
            block
          >
            {t("design_page.clear_all_lines")}
          </Button>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ padding: "0 8px 16px 8px" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
            {t("design_page.new_text")}
          </p>
          <Input
            prefix={<FontSizeOutlined />}
            placeholder={t("design_page.new_text")}
            value={newText}
            onChange={handleTextChange}
            style={{ marginBottom: "8px" }}
          />
          <Button
            type="primary"
            onClick={addText}
            disabled={!newText.trim()}
            block
          >
            {t("design_page.add_text")}
          </Button>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ padding: "0 8px 16px 8px" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
            {t("design_page.upload_image")}
          </p>
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={handleImageUpload}
          >
            <Button icon={<UploadOutlined />} block>
              {t("design_page.upload_image")}
            </Button>
          </Upload>
        </div>

        <Divider style={{ margin: "16px 0" }} />

        <div style={{ padding: "0 8px 16px 8px" }}>
          <p style={{ fontWeight: "600", marginBottom: "8px" }}>
            {t("design_page.action_export_delete")}
          </p>
          <Button
            type="dashed"
            danger
            icon={<DeleteOutlined />}
            onClick={deleteSelected}
            disabled={!selectedId}
            block
            style={{ marginBottom: "8px" }}
          >
            {t("design_page.delete_selected")}{" "}
            {selectedId
              ? textSelected
                ? t("design_page.text")
                : t("design_page.image")
              : t("design_page.selected_object")}
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExportAll}
            block
            style={{ marginBottom: "8px" }}
          >
            {t("design_page.export_all")}
          </Button>
          <Button
            type="default"
            icon={<UploadOutlined />}
            onClick={handleExportJSON}
            block
          >
            {t("design_page.export_json")}
          </Button>
        </div>
      </Sider>

      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "24px",
          backgroundColor: "#f0f2f5",
        }}
      >
        <div
          style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <Stage
            ref={stageRef}
            width={500}
            height={600}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseup={handleMouseUp}
            onClick={handleStageClick}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              setSelectedId(null);
            }}
          >
            <Layer>
              <KonvaImage
                image={currentTshirtImage}
                width={500}
                height={600}
                name="tshirt-background"
              />

              <Group
                clipX={CLIP_AREAS[currentSide].x}
                clipY={CLIP_AREAS[currentSide].y}
                clipWidth={CLIP_AREAS[currentSide].width}
                clipHeight={CLIP_AREAS[currentSide].height}
                name="design-area"
              >
                {linesToRender}
              </Group>

              {renderDesignElements(texts, images)}

              <TransformerComponent
                selectedShapeName={selectedId || ""}
                shapesRef={shapeNodesRef}
              />
            </Layer>
          </Stage>
        </div>
      </Content>
    </Layout>
  );
};

export default DesignPage;

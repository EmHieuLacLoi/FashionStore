import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Layout,
  Card,
  Button,
  Space,
  Typography,
  Segmented,
  Upload,
  Input,
  ColorPicker,
  Tooltip,
  message,
} from "antd";
import {
  Stage,
  Layer,
  Rect,
  Text as KText,
  Image as KImage,
  Line,
  Group,
  Transformer,
} from "react-konva";
import {
  UploadOutlined,
  FontSizeOutlined,
  EditOutlined,
  SelectOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text } = Typography;

type Side = "front" | "back";
type Tool = "select" | "image" | "text" | "draw";

type BaseNode = {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  visible?: boolean;
  locked?: boolean;
};
type ImageNode = BaseNode & {
  type: "image";
  src: string;
  width: number;
  height: number;
  scaleX?: number;
  scaleY?: number;
};
type TextNode = BaseNode & {
  type: "text";
  text: string;
  fontSize: number;
  fill: string;
};
type DrawNode = BaseNode & {
  type: "draw";
  points: number[];
  stroke: string;
  strokeWidth: number;
};
type Node = ImageNode | TextNode | DrawNode;

type DesignState = { front: Node[]; back: Node[] };

// Simple hook to load images
function useHtmlImage(src?: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  React.useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);
  return image as HTMLImageElement | null;
}

const SHIRT_BOUNDS = { x: 60, y: 20, width: 480, height: 580 };
// Vùng tương tác (hình chữ nhật ở giữa, từ vai trở xuống)
const INTERACT_AREA = {
  x: SHIRT_BOUNDS.x + 120,
  y: SHIRT_BOUNDS.y + 80,
  width: SHIRT_BOUNDS.width - 240,
  height: SHIRT_BOUNDS.height - 140,
};

const DesignPage: React.FC = () => {
  const [side, setSide] = useState<Side>("front");
  const [tool, setTool] = useState<Tool>("select");
  const [design, setDesign] = useState<DesignState>({ front: [], back: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("Your text");
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState<number>(4);
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const nodes = design[side];

  const setNodes = (updater: (prev: Node[]) => Node[]) => {
    setDesign((prev) => ({ ...prev, [side]: updater(prev[side]) }));
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const id = `img-${Date.now()}`;
      setNodes((prev) => [
        ...prev,
        {
          id,
          type: "image",
          src,
          x: INTERACT_AREA.x + 40,
          y: INTERACT_AREA.y + 40,
          width: 200,
          height: 200,
          scaleX: 1,
          scaleY: 1,
        },
      ]);
      setSelectedId(id);
    };
    reader.readAsDataURL(file);
    return false; // prevent auto upload
  };

  const addText = () => {
    const id = `txt-${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "text",
        text: textInput,
        x: INTERACT_AREA.x + 60,
        y: INTERACT_AREA.y + 60,
        fontSize: 24,
        fill: "#111",
      },
    ]);
    setSelectedId(id);
  };

  const startDrawRef = useRef<boolean>(false);
  const lastDrawTs = useRef<number>(0);
  const onMouseDown = (e: any) => {
    if (tool !== "draw") return;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    startDrawRef.current = true;
    const id = `draw-${Date.now()}`;
    const within = isWithinInteract(pos.x, pos.y);
    const clamped = clampToInteract(pos.x, pos.y);
    const p = within ? pos : clamped;
    setNodes((prev) => [
      ...prev,
      {
        id,
        type: "draw",
        x: 0,
        y: 0,
        points: [p.x, p.y],
        stroke: brushColor as string,
        strokeWidth: brushSize,
      },
    ]);
    setSelectedId(id);
  };
  const onMouseMove = (e: any) => {
    if (tool !== "draw" || !startDrawRef.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const now = performance.now();
    if (now - lastDrawTs.current < 16) return; // throttle ~60fps
    lastDrawTs.current = now;
    const p = clampToInteract(pos.x, pos.y);
    setNodes((prev) => {
      const next = [...prev];
      const idx = next.findIndex((n) => n.id === selectedId);
      if (idx >= 0 && next[idx].type === "draw") {
        const dn = next[idx] as DrawNode;
        next[idx] = { ...dn, points: [...dn.points, p.x, p.y] };
      }
      return next;
    });
  };
  const onMouseUp = () => {
    startDrawRef.current = false;
  };

  const isWithinInteract = (x: number, y: number) =>
    x >= INTERACT_AREA.x &&
    x <= INTERACT_AREA.x + INTERACT_AREA.width &&
    y >= INTERACT_AREA.y &&
    y <= INTERACT_AREA.y + INTERACT_AREA.height;
  const clampToInteract = (x: number, y: number) => ({
    x: Math.min(
      Math.max(x, INTERACT_AREA.x),
      INTERACT_AREA.x + INTERACT_AREA.width
    ),
    y: Math.min(
      Math.max(y, INTERACT_AREA.y),
      INTERACT_AREA.y + INTERACT_AREA.height
    ),
  });

  const onSelect = (id?: string) => {
    setSelectedId(id ?? null);
  };

  const onDragEnd = (id: string, x: number, y: number) => {
    const clamped = clampToInteract(x, y);
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, x: clamped.x, y: clamped.y } : n))
    );
  };

  const onTransformEnd = (node: any, n: Node) => {
    const konvaNode = node as any;
    const newAttrs: Partial<Node> = {
      x: konvaNode.x(),
      y: konvaNode.y(),
      rotation: konvaNode.rotation(),
    } as any;
    if (n.type === "image") {
      (newAttrs as any).scaleX = konvaNode.scaleX();
      (newAttrs as any).scaleY = konvaNode.scaleY();
    }
    if (n.type === "text") {
      // font size via transformer is not trivial; keep rotation/position only
    }
    setNodes((prev) =>
      prev.map((it) => (it.id === n.id ? ({ ...it, ...newAttrs } as Node) : it))
    );
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedId));
    setSelectedId(null);
  };

  const exportPNG = () => {
    const uri = stageRef.current?.toDataURL({ pixelRatio: 2 });
    if (!uri) return;
    const a = document.createElement("a");
    a.href = uri;
    a.download = `tshirt-${side}.png`;
    a.click();
    message.success("Đã xuất ảnh PNG");
  };

  const ShirtBackground = React.memo(() => {
    const src = side === "front" ? "/front.svg" : "/back.svg";
    const bgImg = useHtmlImage(src);
    return (
      <Group>
        {/* Background image (front/back) */}
        {bgImg ? (
          <KImage
            image={bgImg}
            x={SHIRT_BOUNDS.x}
            y={SHIRT_BOUNDS.y}
            width={SHIRT_BOUNDS.width}
            height={SHIRT_BOUNDS.height}
            listening={false}
          />
        ) : (
          <Rect
            x={SHIRT_BOUNDS.x}
            y={SHIRT_BOUNDS.y}
            width={SHIRT_BOUNDS.width}
            height={SHIRT_BOUNDS.height}
            cornerRadius={30}
            fill="#f7f7f7"
            stroke="#bfbfbf"
            strokeWidth={3}
            listening={false}
          />
        )}
        {/* (Guide removed as requested) */}
      </Group>
    );
  });

  const NodeRenderer: React.FC<{ node: Node; isSelected: boolean }> = ({
    node,
    isSelected,
  }) => {
    const shapeRef = useRef<any>(null);
    const image = useHtmlImage(node.type === "image" ? node.src : undefined);

    React.useEffect(() => {
      if (isSelected && shapeRef.current && trRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, [isSelected]);

    if (node.type === "image") {
      return (
        <>
          <KImage
            ref={shapeRef}
            image={image as any}
            x={node.x}
            y={node.y}
            rotation={node.rotation || 0}
            scaleX={node.scaleX ?? 1}
            scaleY={node.scaleY ?? 1}
            width={node.width}
            height={node.height}
            draggable
            dragBoundFunc={(pos) => ({
              x: Math.min(
                Math.max(pos.x, INTERACT_AREA.x),
                INTERACT_AREA.x + INTERACT_AREA.width
              ),
              y: Math.min(
                Math.max(pos.y, INTERACT_AREA.y),
                INTERACT_AREA.y + INTERACT_AREA.height
              ),
            })}
            onClick={() => onSelect(node.id)}
            onTap={() => onSelect(node.id)}
            onDragEnd={(e: any) => onDragEnd(node.id, e.target.x(), e.target.y())}
            onTransformEnd={(e: any) => onTransformEnd(e.target, node)}
          />
          {isSelected && (
            <Transformer
              ref={trRef}
              rotateEnabled
              keepRatio
              boundBoxFunc={(oldBox, newBox) => {
                const withinX =
                  newBox.x >= INTERACT_AREA.x &&
                  newBox.x + newBox.width <= INTERACT_AREA.x + INTERACT_AREA.width;
                const withinY =
                  newBox.y >= INTERACT_AREA.y &&
                  newBox.y + newBox.height <= INTERACT_AREA.y + INTERACT_AREA.height;
                return withinX && withinY ? newBox : oldBox;
              }}
              enabledAnchors={[
                "middle-left",
                "middle-right",
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
            />
          )}
        </>
      );
    }

    if (node.type === "text") {
      return (
        <>
          <KText
            ref={shapeRef}
            text={node.text}
            x={node.x}
            y={node.y}
            fontSize={node.fontSize}
            fill={node.fill}
            rotation={node.rotation || 0}
            draggable
            dragBoundFunc={(pos) => ({
              x: Math.min(
                Math.max(pos.x, INTERACT_AREA.x),
                INTERACT_AREA.x + INTERACT_AREA.width
              ),
              y: Math.min(
                Math.max(pos.y, INTERACT_AREA.y),
                INTERACT_AREA.y + INTERACT_AREA.height
              ),
            })}
            onClick={() => onSelect(node.id)}
            onTap={() => onSelect(node.id)}
            onDragEnd={(e: any) => onDragEnd(node.id, e.target.x(), e.target.y())}
            onTransformEnd={(e: any) => onTransformEnd(e.target, node)}
          />
          {isSelected && (
            <Transformer
              ref={trRef}
              boundBoxFunc={(oldBox, newBox) => {
                const withinX =
                  newBox.x >= SHIRT_BOUNDS.x &&
                  newBox.x + newBox.width <= SHIRT_BOUNDS.x + SHIRT_BOUNDS.width;
                const withinY =
                  newBox.y >= SHIRT_BOUNDS.y &&
                  newBox.y + newBox.height <= SHIRT_BOUNDS.y + SHIRT_BOUNDS.height;
                return withinX && withinY ? newBox : oldBox;
              }}
              enabledAnchors={[
                "middle-left",
                "middle-right",
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
            />
          )}
        </>
      );
    }

    // draw
    return (
      <Line
        points={(node as DrawNode).points}
        stroke={(node as DrawNode).stroke}
        strokeWidth={(node as DrawNode).strokeWidth}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: 24 }}>
        <Card>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  Tùy chỉnh áo thun (2D)
                </Title>
                <Segmented
                  options={[
                    { label: "Mặt trước", value: "front" },
                    { label: "Mặt sau", value: "back" },
                  ]}
                  value={side}
                  onChange={(val) => setSide(val as Side)}
                />
              </Space>

              <Space wrap>
                <Tooltip title="Chọn (di chuyển/biến đổi)">
                  <Button
                    type={tool === "select" ? "primary" : "default"}
                    icon={<SelectOutlined />}
                    onClick={() => setTool("select")}
                  />
                </Tooltip>
                <Upload
                  beforeUpload={handleUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Tooltip title="Thêm ảnh">
                    <Button
                      type={tool === "image" ? "primary" : "default"}
                      icon={<UploadOutlined />}
                      onClick={() => setTool("image")}
                    />
                  </Tooltip>
                </Upload>
                <Tooltip title="Thêm chữ">
                  <Button
                    type={tool === "text" ? "primary" : "default"}
                    icon={<FontSizeOutlined />}
                    onClick={() => {
                      setTool("text");
                      addText();
                    }}
                  />
                </Tooltip>
                <Tooltip title="Vẽ tự do">
                  <Button
                    type={tool === "draw" ? "primary" : "default"}
                    icon={<EditOutlined />}
                    onClick={() => setTool("draw")}
                  />
                </Tooltip>
                <Tooltip title="Xóa đối tượng được chọn">
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={removeSelected}
                    disabled={!selectedId}
                  />
                </Tooltip>
                <Tooltip title="Xuất PNG">
                  <Button icon={<DownloadOutlined />} onClick={exportPNG} />
                </Tooltip>
              </Space>
            </div>

            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Space>
                <Text>Text:</Text>
                <Input
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  style={{ width: 240 }}
                />
              </Space>
              <Space>
                <Text>Màu bút:</Text>
                <ColorPicker
                  value={brushColor}
                  onChange={(c) => setBrushColor(c.toHexString())}
                />
                <Text>Cỡ bút:</Text>
                <Input
                  type="number"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value) || 1)}
                  style={{ width: 80 }}
                />
              </Space>
            </Space>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Stage
                ref={stageRef}
                width={600}
                height={640}
                onMouseDown={(e: any) => onMouseDown(e)}
                onMouseMove={(e: any) => onMouseMove(e)}
                onMouseUp={() => onMouseUp()}
                style={{ background: "transparent" }}
              >
                {/* Background layer: non-interactive, not part of hit graph */}
                <Layer listening={false} hitGraphEnabled={false}>
                  <ShirtBackground />
                </Layer>

                {/* Content layer: draw directly over the shirt */}
                <Layer onClick={() => onSelect(undefined)} perfectDrawEnabled={false}>
                  {nodes.map((n) => (
                    <NodeRenderer
                      key={n.id}
                      node={n}
                      isSelected={selectedId === n.id}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default DesignPage;

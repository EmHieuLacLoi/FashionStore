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
// Đảm bảo các đường dẫn này là chính xác trong project của bạn
import frontImg from "@assets/images/front.svg";
import backImg from "@assets/images/back.svg";

// --- 1. Định nghĩa Types ---
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

// --- 2. Component Transformer (Khung điều khiển Resize/Rotate) ---

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

      // Yêu cầu vẽ lại layer một cách an toàn
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selectedShapeName, shapesRef.current.length]);

  return (
    <Transformer
      ref={trRef}
      boundBoxFunc={(oldBox, newBox) => {
        // giới hạn kích thước tối thiểu
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

// --- 3. Component DesignPage Chính ---
const DesignPage = () => {
  // --- States và Assets ---
  const [tshirtFrontImage] = useImage(frontImg);
  const [tshirtBackImage] = useImage(backImg);

  const [currentSide, setCurrentSide] = useState<"front" | "back">("front");

  const [designState, setDesignState] = useState<DesignState>({
    front: { lines: [], texts: [], images: [] },
    back: { lines: [], texts: [], images: [] },
  });

  const [currentColor, setCurrentColor] = useState("#ff0000");
  const [currentWidth, setCurrentWidth] = useState(5);
  const [isErasing, setIsErasing] = useState(false);

  const [newText, setNewText] = useState("Nhập text");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Lấy dữ liệu thiết kế hiện tại
  const currentDesign = designState[currentSide];
  const { lines, texts, images } = currentDesign;

  // --- Refs ---
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);
  // Ref để lưu trữ các node Konva của Text và Image đang hiển thị
  const shapeNodesRef = useRef<any[]>([]);

  // Lấy ảnh nền áo hiện tại
  const currentTshirtImage =
    currentSide === "front" ? tshirtFrontImage : tshirtBackImage;

  // Hàm cập nhật State chung
  const updateDesignState = (newSideDesign: DesignSide) => {
    setDesignState({
      ...designState,
      [currentSide]: newSideDesign,
    });
  };

  // --- Konva Handlers (Vẽ và Tẩy) ---

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

  // ✅ HÀM GIỚI HẠN VÙNG KÉO THẢ (DRAG BOUND)
  const dragBoundHandler = (pos: { x: number; y: number }, node: any) => {
    // ✅ Lấy VÙNG GIỚI HẠN hiện tại
    const currentClipArea = CLIP_AREAS[currentSide];

    const LIMIT_X = currentClipArea.x;
    const LIMIT_Y = currentClipArea.y;
    const LIMIT_W = currentClipArea.width;
    const LIMIT_H = currentClipArea.height;

    // Kích thước của đối tượng đang kéo (không đổi)
    const objectWidth = node.width() * node.scaleX();
    const objectHeight = node.height() * node.scaleY();

    // Giới hạn Trái & Phải
    const newX = Math.max(pos.x, LIMIT_X);
    const finalX = Math.min(newX, LIMIT_X + LIMIT_W - objectWidth);

    // Giới hạn Trên & Dưới
    const newY = Math.max(pos.y, LIMIT_Y);
    const finalY = Math.min(newY, LIMIT_Y + LIMIT_H - objectHeight);

    return {
      x: finalX,
      y: finalY,
    };
  };

  // --- Chức năng Thêm/Xóa/Cập nhật Đối tượng ---

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

    // Cập nhật text của đối tượng đang chọn
    if (selectedId && texts.some((t) => t.id === selectedId)) {
      const newTexts = texts.map((t) =>
        t.id === selectedId ? { ...t, text: value } : t
      );
      updateDesignState({ ...currentDesign, texts: newTexts });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Cập nhật vị trí sau khi kéo thả (cho Text và Image)
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

  // Cập nhật kích thước sau khi transform (cho Text và Image)
  // Cập nhật kích thước sau khi transform (cho Text và Image)
  const handleTransformEnd = (e: any, type: "text" | "image") => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newRotation = node.rotation();

    const id = node.name();

    // Tìm đối tượng gốc từ state hiện tại
    const isText = type === "text";

    // Gán kiểu cụ thể để TypeScript không bị nhầm lẫn
    const originalText = isText
      ? (texts.find((t) => t.id === id) as DesignText | undefined)
      : undefined;

    const originalImage = !isText
      ? (images.find((img) => img.id === id) as DesignImage | undefined)
      : undefined;

    if (!originalText && !originalImage) return;

    // Reset scale Konva về 1
    node.scaleX(1);
    node.scaleY(1);

    const newX = node.x();
    const newY = node.y();

    if (isText && originalText) {
      // --- XỬ LÝ TEXT ---
      let newFontSize = originalText.fontSize;

      // Tính toán FontSize mới (sử dụng scaleX vì Text thường resize đồng đều)
      // Giới hạn font tối thiểu là 5
      newFontSize = Math.max(5, Math.round(newFontSize * scaleX));

      // Cập nhật lại Konva Node để Konva tính lại kích thước bounding box
      node.fontSize(newFontSize);

      // Cập nhật State Text
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
      // --- XỬ LÝ IMAGE ---

      // Tính toán Width/Height mới
      const newWidth = originalImage.width * scaleX;
      const newHeight = originalImage.height * scaleY;

      // Cập nhật State Image
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

  // --- Chức năng Xuất Ảnh Tổng Hợp (2 ảnh) ---

  const handleExportAll = () => {
    // 1. Lấy ảnh mặt trước
    setSelectedId(null);
    const frontUri = stageRef.current.toDataURL({ pixelRatio: 2 });

    // 2. Tạm thời chuyển sang mặt sau để render
    const originalSide = currentSide;
    setCurrentSide("back");

    // Dùng setTimeout để đảm bảo Konva đã render mặt sau
    setTimeout(() => {
      if (!stageRef.current) return;

      // 3. Lấy ảnh mặt sau
      const backUri = stageRef.current.toDataURL({ pixelRatio: 2 });

      // 4. Gộp 2 ảnh vào 1 Canvas mới
      const finalCanvas = document.createElement("canvas");
      const ctx = finalCanvas.getContext("2d");

      const FINAL_W = 1000; // 500 * 2 (pixelRatio)
      const FINAL_H = 1200; // 600 * 2
      const SPACING = 50;

      finalCanvas.width = FINAL_W * 2 + SPACING;
      finalCanvas.height = FINAL_H;

      const frontImgObj = new Image();
      frontImgObj.onload = () => {
        ctx?.drawImage(frontImgObj, 0, 0, FINAL_W, FINAL_H);

        const backImgObj = new Image();
        backImgObj.onload = () => {
          ctx?.drawImage(backImgObj, FINAL_W + SPACING, 0, FINAL_W, FINAL_H);

          // Xuất ảnh cuối cùng
          const finalUri = finalCanvas.toDataURL("image/png", 1.0);
          const link = document.createElement("a");
          link.download = "tshirt-design-front-back.png";
          link.href = finalUri;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 5. Quay lại mặt thiết kế ban đầu
          setCurrentSide(originalSide);
        };
        backImgObj.src = backUri;
      };
      frontImgObj.src = frontUri;
    }, 100);
  };

  // Chức năng xuất trạng thái để lưu (JSON)
  const handleExportJSON = () => {
    const jsonState = {
      front: {
        lines: designState.front.lines,
        texts: designState.front.texts,
        images: designState.front.images.map((img) => ({
          ...img,
          // Chỉ lưu placeholder, không lưu dữ liệu ảnh base64
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
  };

  // --- Render Functions ---

  // Hàm render các đối tượng Text và Image
  const renderDesignElements = (
    textsToRender: DesignText[],
    imagesToRender: DesignImage[]
  ) => {
    // ✅ Xóa sạch refs trước khi render để chỉ chứa các Node của mặt hiện tại
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
              // Thêm node vào danh sách refs của mặt đang hiển thị
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
                  // Thêm node vào danh sách refs của mặt đang hiển thị
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

  // Xử lý các Line cho Eraser
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
        globalCompositeOperation={
          line.isEraser ? "destination-out" : "source-over"
        }
      />
    );
  });

  const textSelected = texts.some((t) => t.id === selectedId);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Thiết Kế Áo Phông Của Bạn -{" "}
        {currentSide === "front" ? "Mặt Trước" : "Mặt Sau"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* --- Thanh Công Cụ (Toolbox) --- */}
        <div className="lg:w-1/3 bg-white p-4 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">
            Chọn Mặt Thiết Kế
          </h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => {
                setSelectedId(null);
                setCurrentSide("front");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                currentSide === "front"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Mặt Trước
            </button>
            <button
              onClick={() => {
                setSelectedId(null);
                setCurrentSide("back");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                currentSide === "back"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Mặt Sau
            </button>
          </div>

          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Công Cụ</h2>

          {/* 1. Cài đặt Bút */}
          <div className="mb-4 p-3 border rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <span role="img" aria-label="pen">
                🎨
              </span>{" "}
              Bút Vẽ & Tẩy
            </h3>
            <div className="flex items-center space-x-4 mb-2">
              <label className="text-sm">Màu:</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-12 h-8"
              />
            </div>
            <div className="mb-3">
              <label className="text-sm block">
                Độ Dày: <span className="font-bold">{currentWidth}px</span>
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={currentWidth}
                onChange={(e) => setCurrentWidth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => setIsErasing(!isErasing)}
              className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
                isErasing
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {isErasing ? "✅ Tắt Tẩy" : "🧼 Chế Độ Tẩy"}
            </button>
          </div>

          {/* 2. Thêm Văn Bản (Text) */}
          <div className="mb-4 p-3 border rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <span role="img" aria-label="text">
                🖋️
              </span>{" "}
              Thêm Văn Bản
            </h3>
            <input
              type="text"
              value={newText}
              onChange={handleTextChange}
              placeholder="Nhập nội dung văn bản..."
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <button
              onClick={addText}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold transition duration-200"
              disabled={!newText.trim()}
            >
              ➕ Thêm Text
            </button>
          </div>

          {/* 3. Thêm Logo/Ảnh */}
          <div className="mb-4 p-3 border rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <span role="img" aria-label="image">
                🖼️
              </span>{" "}
              Tải Ảnh Lên
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            />
          </div>

          {/* 4. Thao tác Chung */}
          <div className="p-3 border rounded-md">
            <h3 className="font-medium mb-2 flex items-center">
              <span role="img" aria-label="actions">
                ⚙️
              </span>{" "}
              Thao Tác
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  updateDesignState({ ...currentDesign, lines: [] })
                }
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 font-semibold transition duration-200"
              >
                🗑️ Xóa Vẽ
              </button>
              <button
                onClick={deleteSelected}
                disabled={!selectedId}
                className={`py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                  selectedId
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                ❌ Xóa {selectedId ? (textSelected ? "Text" : "Ảnh") : ""}
              </button>
              <button
                onClick={handleExportAll}
                className="col-span-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-semibold transition duration-200"
              >
                🖼️ Xuất Cả 2 Mặt (PNG)
              </button>
              <button
                onClick={handleExportJSON}
                className="col-span-2 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 font-semibold transition duration-200"
              >
                📤 Xuất Trạng Thái (JSON)
              </button>
            </div>
          </div>
        </div>

        {/* --- Khu vực Canvas --- */}
        <div className="lg:w-2/3 flex justify-center items-start p-4 bg-white rounded-lg shadow-xl overflow-hidden">
          <Stage
            ref={stageRef}
            width={500}
            height={600}
            className="border border-gray-300 shadow-lg"
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
              {/* 1. Áo (Nền) */}
              <KonvaImage
                image={currentTshirtImage} // Dùng ảnh tùy thuộc vào currentSide
                width={500}
                height={600}
                name="tshirt-background"
              />

              {/* 2. Các Nét Vẽ & Tẩy (Giữ nguyên vùng clip) */}
              <Group
                clipX={CLIP_AREAS[currentSide].x} // Sử dụng giá trị mới
                clipY={CLIP_AREAS[currentSide].y} // Sử dụng giá trị mới
                clipWidth={CLIP_AREAS[currentSide].width} // Sử dụng giá trị mới
                clipHeight={CLIP_AREAS[currentSide].height} // Sử dụng giá trị mới
                name="design-area"
              >
                {linesToRender}
              </Group>

              {/* 3 & 4. Văn Bản (Text) và Ảnh/Logo */}
              {renderDesignElements(texts, images)}

              {/* 5. Transformer (Điều khiển) */}
              <TransformerComponent
                selectedShapeName={selectedId || ""}
                shapesRef={shapeNodesRef}
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default DesignPage;

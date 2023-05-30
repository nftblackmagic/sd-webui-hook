import React, { FC, useRef, useEffect, useState, use } from "react";
import { contain, cover } from "../utils/canvas";

interface ImageMaskCanvasProps {
  imageHandler: (image: string | null) => void;
  imageSizeHandler?: (imageSize: { width: number; height: number }) => void;
  maskImageHandler?: (image: string | null) => void;
  containCrop?: boolean;
}

const ImageMaskCanvas: FC<ImageMaskCanvasProps> = (
  props: ImageMaskCanvasProps
) => {
  const [isPainting, setIsPainting] = useState(false);
  const { imageHandler, maskImageHandler, imageSizeHandler, containCrop } =
    props;
  const [mousePosition, setMousePosition] = useState<
    { x: number; y: number } | undefined
  >(undefined);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const maskContextRef = useRef<CanvasRenderingContext2D | null>(null);

  const startPaint = (event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  };

  const paint = (event: MouseEvent) => {
    if (isPainting) {
      const newMousePosition = getCoordinates(event);
      if (mousePosition && newMousePosition) {
        drawLine(mousePosition, newMousePosition);
        setMousePosition(newMousePosition);
      }
    }
  };

  const exitPaint = () => {
    if (isPainting) {
      saveMask();
    }
    setIsPainting(false);
    setMousePosition(undefined);
  };

  const getCoordinates = (
    event: MouseEvent
  ): { x: number; y: number } | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const drawLine = (
    originalMousePosition: { x: number; y: number },
    newMousePosition: { x: number; y: number }
  ) => {
    if (!contextRef.current || !maskContextRef.current) {
      return;
    }

    const context: CanvasRenderingContext2D = contextRef.current;
    const maskContext: CanvasRenderingContext2D = maskContextRef.current;

    context.strokeStyle = "black";
    context.lineJoin = "round";
    context.lineWidth = 20;
    maskContext.strokeStyle = "white";
    maskContext.lineJoin = "round";
    maskContext.lineWidth = 20;

    context.beginPath();
    context.moveTo(originalMousePosition.x, originalMousePosition.y);
    context.lineTo(newMousePosition.x, newMousePosition.y);
    context.closePath();

    context.stroke();

    maskContext.beginPath();
    maskContext.moveTo(originalMousePosition.x, originalMousePosition.y);
    maskContext.lineTo(newMousePosition.x, newMousePosition.y);
    maskContext.closePath();

    maskContext.stroke();
  };

  const resetCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    const maskContext = maskContextRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (context && canvas && maskContext && maskCanvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);

      if (image) {
        const { offsetX, offsetY, width, height } = contain(
          canvas.width,
          canvas.height,
          image.width,
          image.height
        );

        context.drawImage(image, offsetX, offsetY, width, height);
      }
    }
  };

  const clearCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    const maskContext = maskContextRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (context && canvas && maskContext && maskCanvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      setImage(null);
      setMaskImage(null);
    }
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      img.onload = function () {
        const context = contextRef.current;
        const canvas = canvasRef.current;
        const maskContext = maskContextRef.current;
        const maskCanvas = maskCanvasRef.current;
        if (context && canvas && maskContext && maskCanvas) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          maskContext.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
          if (img) {
            const { offsetX, offsetY, width, height } = contain(
              canvas.width,
              canvas.height,
              img.width,
              img.height
            );
            context.drawImage(img, offsetX, offsetY, width, height);
            const dataURL = canvas.toDataURL();
            if (containCrop) {
              imageHandler(dataURL);
              if (imageSizeHandler) {
                imageSizeHandler({
                  width: canvas.width,
                  height: canvas.height,
                });
              }
            }
          }
        }
      };
      setImage(img);

      if (!containCrop) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function () {
          const csv: string | ArrayBuffer | null = reader.result;
          var finalCsv = "";
          if (typeof csv === "string") {
            finalCsv = csv;
          } else if (csv instanceof ArrayBuffer) {
            finalCsv = csv.toString();
          }
          imageHandler(finalCsv);
          if (imageSizeHandler) {
            console.log(
              "about to call imageSizeHandler",
              img.width,
              img.height
            );
            imageSizeHandler({ width: img.width, height: img.height });
          }
        };
      }
    }
  };

  const saveMask = () => {
    const context = contextRef.current;
    const maskContext = maskContextRef.current;
    const canvas = canvasRef.current;

    if (!context || !maskContext || !image || !canvas) {
      return;
    }

    const maskCanvas = document.createElement("canvas");

    var maskImageData = maskContext.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;

    if (!containCrop) {
      const { offsetX, offsetY, width, height } = contain(
        canvas.width,
        canvas.height,
        image.width,
        image.height
      );

      maskImageData = maskContext.getImageData(offsetX, offsetY, width, height);

      maskCanvas.width = image.width;
      maskCanvas.height = image.height;
    }

    const maskCanvasContext = maskCanvas.getContext("2d");
    if (!maskCanvasContext) {
      return;
    }

    maskCanvasContext.drawImage(
      maskContext.canvas,
      0,
      0,
      maskCanvas.width,
      maskCanvas.height
    );

    const maskDataURL = maskCanvas.toDataURL();

    // console.log(maskDataURL);
    setMaskImage(maskDataURL);
    if (maskImageHandler) {
      console.log("about to call maskImageHandler");
      maskImageHandler(maskDataURL);
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !maskCanvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext("2d");
    const maskCanvas: HTMLCanvasElement = maskCanvasRef.current;
    const maskContext = maskCanvas.getContext("2d");
    if (!context || !maskContext) {
      return;
    }
    contextRef.current = context;
    maskContextRef.current = maskContext;

    canvas.addEventListener("mousedown", startPaint);
    canvas.addEventListener("mousemove", paint);
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);

    return () => {
      canvas.removeEventListener("mousedown", startPaint);
      canvas.removeEventListener("mousemove", paint);
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  return (
    <div>
      <input type="file" onChange={uploadImage} accept="image/*" />
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        style={{ display: "block" }}
      />
      <canvas
        ref={maskCanvasRef}
        width={512}
        height={512}
        style={{ display: "none" }}
      />
      <button onClick={resetCanvas}>Reset</button>
      <button onClick={clearCanvas}>Clear</button>
      <button onClick={saveMask}>Save Mask</button>
    </div>
  );
};

export default ImageMaskCanvas;
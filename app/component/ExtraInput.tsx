import { useEffect, useState } from "react";
import ImageMaskCanvas from "./ImageMaskCanvas";
import { useSelector } from "../hook/useSelector.hook";
import { useDispatch } from "react-redux";
import { setSettings } from "../redux/Features/ExtraState/ExtraSlice";

const upscalerOptions = [
  {
    name: "None",
    model_name: null,
    model_path: null,
    model_url: null,
    scale: 4,
  },
  {
    name: "Lanczos",
    model_name: null,
    model_path: null,
    model_url: null,
    scale: 4,
  },
  {
    name: "Nearest",
    model_name: null,
    model_path: null,
    model_url: null,
    scale: 4,
  },
  {
    name: "ESRGAN_4x",
    model_name: "ESRGAN_4x",
    model_path:
      "https://github.com/cszn/KAIR/releases/download/v1.0/ESRGAN.pth",
    model_url: null,
    scale: 4,
  },
  {
    name: "R-ESRGAN 4x+",
    model_name: null,
    model_path:
      "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth",
    model_url: null,
    scale: 4,
  },
  {
    name: "R-ESRGAN 4x+ Anime6B",
    model_name: null,
    model_path:
      "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth",
    model_url: null,
    scale: 4,
  },
];

export const ExtraInput = () => {
  const [image, setImage] = useState<string | null>("");
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );
  const [resize, setResize] = useState<1 | 2 | 4>(2);
  const [upscaler1, setUpscaler1] = useState("None");
  const [upscaler2, setUpscaler2] = useState("None");

  const settings = useSelector((state) => state.extra.settings);

  const dispatch = useDispatch();

  const imageHandler = (image: string | null) => {
    setImage(image);
  };
  const imageSizeHandler = (imageSize: { width: number; height: number }) => {
    setImageSize(imageSize);
  };

  useEffect(() => {
    if (image) {
      dispatch(
        setSettings({
          ...settings,
          image,
        })
      );
    }
  }, [image]);

  useEffect(() => {
    if (resize) {
      dispatch(
        setSettings({
          ...settings,
          upscaling_resize: resize,
        })
      );
    }
  }, [resize]);

  useEffect(() => {
    if (upscaler1) {
      dispatch(
        setSettings({
          ...settings,
          upscaler_1: upscaler1,
        })
      );
    }
  }, [upscaler1]);

  return (
    <div>
      <ImageMaskCanvas
        imageHandler={imageHandler}
        imageSizeHandler={imageSizeHandler}
      />
      <div>
        <label>Resize</label>
        <input
          type="radio"
          name="resize"
          value="1"
          onChange={() => setResize(1)}
          checked={resize === 1}
        />
        <label>1</label>
        <input
          type="radio"
          name="resize"
          value="2"
          onChange={() => setResize(2)}
          checked={resize === 2}
        />
        <label>2</label>
        <input
          type="radio"
          name="resize"
          value="4"
          onChange={() => setResize(4)}
          checked={resize === 4}
        />
        <label>4</label>
      </div>
      <div>
        <label>Upscaler 1</label>
        <select
          value={upscaler1}
          onChange={(e) => setUpscaler1(e.target.value)}
        >
          {upscalerOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

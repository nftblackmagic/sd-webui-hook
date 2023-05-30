import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageMaskCanvas from "./ImageMaskCanvas";
import { useSelector } from "../hook/useSelector.hook";
import { setSettings as setTxt2imgSettings } from "../redux/Features/Txt2imgState/Txt2imgSlice";
import { setSettings as setImg2imgSettings } from "../redux/Features/Img2imgState/Img2imgSlice";
import { ControlNetModels } from "../utils/controlModel";

export const ControlNetInput = ({ mode }: { mode: number }) => {
  const dispatch = useDispatch();
  const settings =
    mode == 0
      ? useSelector((state) => state.txt2img.settings)
      : useSelector((state) => state.img2img.settings);
  const setSettings = mode == 0 ? setTxt2imgSettings : setImg2imgSettings;
  const [isEnabled, setIsEnabled] = useState(false);
  const [moduleSelected, setModuleSelected] = useState("lineart");
  const [modelSelected, setModelSelected] = useState(
    "control_v11p_sd15_lineart [43d4be0d]"
  );
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const modules = Object.keys(ControlNetModels);

  const imageHandler = (image: string | null) => {
    setImage(image);
  };

  const imageSizeHandler = (imageSize: { width: number; height: number }) => {
    setImageSize(imageSize);
  };

  const handleModuleChange = (e: any) => {
    setModuleSelected(e.target.value);
  };

  useEffect(() => {
    if (isEnabled) {
      dispatch(
        setSettings({
          ...settings,
          alwayson_scripts: {
            controlnet: {
              args: [
                {
                  module: moduleSelected,
                  model: modelSelected,
                  input_image: image,
                },
              ],
            },
          },
        })
      );
    }
  }, [isEnabled, moduleSelected, modelSelected, image]);

  useEffect(() => {
    if (imageSize.width > 0 && imageSize.height > 0) {
      console.log("imageSize", imageSize);
      dispatch(
        setSettings({
          ...settings,
          width: imageSize.width,
          height: imageSize.height,
        })
      );
    }
  }, [imageSize]);

  return (
    <div>
      ControlNetInput component:
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={() => setIsEnabled(!isEnabled)}
      />
      {modules.map((module) => (
        <div key={module}>
          <input
            type="radio"
            name="module"
            value={module}
            checked={module == moduleSelected}
            onChange={handleModuleChange}
          />
          {module}
        </div>
      ))}
      <ImageMaskCanvas
        imageHandler={imageHandler}
        imageSizeHandler={imageSizeHandler}
      />
    </div>
  );
};

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageMaskCanvas from "./ImageMaskCanvas";
import { useSelector } from "../hook/useSelector.hook";
import { setSettings as setTxt2imgSettings } from "../redux/Features/Txt2imgState/Txt2imgSlice";
import { setSettings as setImg2imgSettings } from "../redux/Features/Img2imgState/Img2imgSlice";

const modules = [
  "none",
  "canny",
  "depth",
  "depth_leres",
  "depth_leres++",
  "hed",
  "hed_safe",
  "mediapipe_face",
  "mlsd",
  "normal_map",
  "openpose",
  "openpose_hand",
  "openpose_face",
  "openpose_faceonly",
  "openpose_full",
  "clip_vision",
  "color",
  "pidinet",
  "pidinet_safe",
  "pidinet_sketch",
  "pidinet_scribble",
  "scribble_xdog",
  "scribble_hed",
  "segmentation",
  "threshold",
  "depth_zoe",
  "normal_bae",
  "oneformer_coco",
  "oneformer_ade20k",
  "lineart",
  "lineart_coarse",
  "lineart_anime",
  "lineart_standard",
  "shuffle",
  "tile_resample",
  "inpaint",
  "invert",
  "lineart_anime_denoise",
];

const models = [
  "control_v11e_sd15_ip2p [c4bb465c]",
  "control_v11e_sd15_shuffle [526bfdae]",
  "control_v11f1e_sd15_tile [a371b31b]",
  "control_v11f1p_sd15_depth [cfd03158]",
  "control_v11p_sd15_canny [d14c016b]",
  "control_v11p_sd15_inpaint [ebff9138]",
  "control_v11p_sd15_lineart [43d4be0d]",
  "control_v11p_sd15_mlsd [aca30ff0]",
  "control_v11p_sd15_normalbae [316696f1]",
  "control_v11p_sd15_openpose [cab727d4]",
  "control_v11p_sd15_scribble [d4ba51ff]",
  "control_v11p_sd15_seg [e1f51eb9]",
  "control_v11p_sd15_softedge [a8575a2a]",
  "control_v11p_sd15s2_lineart_anime [3825e83e]",
];

export const ControlNetInput = ({ mode }: { mode: number }) => {
  const dispatch = useDispatch();
  const settings =
    mode == 0
      ? useSelector((state) => state.txt2img.settings)
      : useSelector((state) => state.img2img.settings);
  const setSettings = mode == 0 ? setTxt2imgSettings : setImg2imgSettings;
  const [isEnabled, setIsEnabled] = useState(false);
  const [moduleSelected, setModuleSelected] = useState("openpose_face");
  const [modelSelected, setModelSelected] = useState(
    "control_v11p_sd15_openpose [cab727d4]"
  );
  const [image, setImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const imageHandler = (image: string | null) => {
    setImage(image);
  };

  const imageSizeHandler = (imageSize: { width: number; height: number }) => {
    setImageSize(imageSize);
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
      {isEnabled && (
        <>
          <select
            value={moduleSelected}
            onChange={(e) => setModuleSelected(e.target.value)}
          >
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>

          <select
            value={modelSelected}
            onChange={(e) => setModelSelected(e.target.value)}
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
          <ImageMaskCanvas
            imageHandler={imageHandler}
            imageSizeHandler={imageSizeHandler}
          />
        </>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import ImageMaskCanvas from "./ImageMaskCanvas";
import { useSelector } from "../hook/useSelector.hook";
import { useDispatch } from "react-redux";
import { setSettings } from "../redux/Features/Img2imgState/Img2imgSlice";

export const Img2imgImageInput = () => {
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.img2img.settings);

  const [image, setImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  const imageHandler = (image: string | null) => {
    setImage(image);
  };

  const maskImageHandler = (image: string | null) => {
    setMaskImage(image);
  };

  const imageSizeHandler = (imageSize: { width: number; height: number }) => {
    setImageSize(imageSize);
  };

  useEffect(() => {
    if (image) {
      dispatch(
        setSettings({
          ...settings,
          init_images: [image],
          height: imageSize.height,
          width: imageSize.width,
        })
      );
    }
  }, [image, imageSize]);

  useEffect(() => {
    if (maskImage) {
      dispatch(
        setSettings({
          ...settings,
          mask: maskImage,
        })
      );
    }
  }, [maskImage]);

  return (
    <div>
      <ImageMaskCanvas
        imageHandler={imageHandler}
        maskImageHandler={maskImageHandler}
        imageSizeHandler={imageSizeHandler}
        containCrop={false}
      />
      {/* {image && <img src={`${image}`} width="256" height="256" alt={`image`} />}
      {maskImage && (
        <img src={`${maskImage}`} width="256" height="256" alt={`maskImage`} />
      )} */}
    </div>
  );
};

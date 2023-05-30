"use client";

import { ControlNetInput } from "../component/ControlNetInput";
import { Img2imgImageInput } from "../component/Img2imgImageInput";
import { PromptContainer } from "../component/PromptContainer";
import { useImg2img } from "../hook/useImg2img.hook";
import { useTxt2img } from "../hook/useTxt2img.hook";
import { useEffect, useState } from "react";

export default function Page() {
  const [images, setImages] = useState<any[]>([]);

  const {
    images: generatedImages,
    result,
    loading,
    error,
    txt2img,
  } = useTxt2img({
    url: "http://0.0.0.0:7861",
    port: "",
  });

  const {
    images: generatedImages2,
    result: result2,
    loading: loading2,
    error: error2,
    img2img,
  } = useImg2img({
    url: "http://0.0.0.0:7861",
    port: "",
  });

  const handleTxt2imgClick = () => {
    txt2img();
  };

  const handleImg2imgClick = () => {
    img2img();
  };

  useEffect(() => {
    if (generatedImages.length > 0) {
      setImages(generatedImages);
      console.log("images", generatedImages);
    }
  }, [generatedImages]);

  useEffect(() => {
    if (generatedImages2.length > 0) {
      setImages(generatedImages2);
      console.log("images", generatedImages2);
    }
  }, [generatedImages2]);
  return (
    <>
      <div>
        txt2img generation
        <PromptContainer mode={0} />
        <ControlNetInput mode={0} />
        {/* <ImageUpload /> */}
        <button onClick={handleTxt2imgClick}>txt2img</button>
        {loading && <div>loading...</div>}
        {error && <div>{error}</div>}
        {images.length > 0 &&
          images.map((image, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${image}`}
              width="256"
              height="256"
              alt={`image-${index}`}
            />
          ))}
      </div>
      <div>
        <h1> img2img generation </h1>
        <PromptContainer mode={1} />
        <ControlNetInput mode={1} />
        <Img2imgImageInput />
        <button onClick={handleImg2imgClick}>img2img</button>
        {loading2 && <div>loading...</div>}
        {error2 && <div>{error}</div>}
        {images.length > 0 &&
          images.map((image, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${image}`}
              width="256"
              height="256"
              alt={`image-${index}`}
            />
          ))}
      </div>
    </>
  );
}

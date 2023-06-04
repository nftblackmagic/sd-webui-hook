"use client";

import { useState } from "react";
import ImageMaskCanvas from "./ImageMaskCanvas";
import { PromptContainer } from "./PromptContainer";
import { ControlNetInput } from "./ControlNetInput";
import { Img2imgImageInput } from "./Img2imgImageInput";
import { ImageGallery } from "./ImageGallery";

export default function Test() {
  const [image, setImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);
  const handleImageUpload = (image: string | null) => {
    setImage(image);
  };
  const handleMaskImage = (image: string | null) => {
    setMaskImage(image);
  };

  return (
    <div>
      Test component
      {/* <ImageMaskCanvas
        imageHandler={handleImageUpload}
        maskImageHandler={handleMaskImage}
      />
      {image && <img src={`${image}`} width="256" height="256" alt={`image`} />}
      {maskImage && (
        <img src={`${maskImage}`} width="256" height="256" alt={`maskImage`} />
      )} */}
      {/* <ControlNetInput /> */}
      {/* <Img2imgImageInput /> */}
      <ImageGallery
        result={{
          images: [],
        }}
      />
    </div>
  );
}

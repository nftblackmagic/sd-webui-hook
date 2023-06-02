"use client";

import { set } from "lodash";
import { CommonInput } from "../component/CommonInput";
import { ControlNetInput } from "../component/ControlNetInput";
import { ExtraInput } from "../component/ExtraInput";
import { Img2imgImageInput } from "../component/Img2imgImageInput";
import { PromptContainer } from "../component/PromptContainer";
import { useExtra } from "../hook/useExtra.hook";
import { useImg2img } from "../hook/useImg2img.hook";
import { useProgress } from "../hook/useProgress.hook";
import { useTxt2img } from "../hook/useTxt2img.hook";
import { useEffect, useState } from "react";
import { clear } from "console";

export default function Page() {
  const [images, setImages] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loadingImages, setLoadingImages] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const {
    images: generatedImages,
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

  const {
    images: generatedImages3,
    result: result3,
    loading: loading3,
    error: error3,
    extra,
  } = useExtra({
    url: "http://0.0.0.0:7861",
    port: "",
  });

  const { query, result: result4 } = useProgress({
    url: "http://0.0.0.0:7861",
    port: "",
  });

  const handleTxt2imgClick = () => {
    txt2img();
    const id = setInterval(() => {
      query();
    }, 1000);
    setIntervalId(id);
  };

  const handleImg2imgClick = () => {
    img2img();
    query();
  };

  useEffect(() => {
    if (generatedImages.length > 0) {
      setImages(generatedImages);
      clearInterval(intervalId!);
    }
  }, [generatedImages]);

  useEffect(() => {
    if (generatedImages2.length > 0) {
      setImages(generatedImages2);
    }
  }, [generatedImages2]);

  useEffect(() => {
    if (result4) {
      setResult(result4);
    }
  }, [result4]);

  useEffect(() => {
    if (result && result.current_image) {
      setLoadingImages(result.current_image);
    }
  }, [result]);

  return (
    <>
      <div>
        <h1>txt2img generation</h1>
        <PromptContainer mode={0} />
        <CommonInput mode={0} />
        <ControlNetInput mode={0} />
        <button onClick={handleTxt2imgClick}>txt2img</button>
        {loading && (
          <>
            <div>loading...</div>
            {loadingImages && (
              <img src={`data:image/png;base64,${loadingImages}`} width="256" />
            )}
          </>
        )}

        {error && <div>{error}</div>}
        {generatedImages.length > 0 &&
          generatedImages.map((image, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${image}`}
              width="256"
              alt={`image-${index}`}
            />
          ))}
      </div>
      <div>
        <h1> img2img generation </h1>
        <PromptContainer mode={1} />
        <Img2imgImageInput />
        <ControlNetInput mode={1} />
        <button onClick={handleImg2imgClick}>img2img</button>
        {loading2 && <div>loading...</div>}
        {error2 && <div>{error}</div>}
        {generatedImages2.length > 0 &&
          generatedImages2.map((image, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${image}`}
              width="256"
              alt={`image-${index}`}
            />
          ))}
      </div>
      <div>
        <h1> extra generation </h1>
        <ExtraInput />
        <button onClick={extra}>extra</button>
        {loading3 && <div>loading...</div>}
        {error3 && <div>{error}</div>}
        {generatedImages3.length > 0 &&
          generatedImages3.map((image, index) => (
            <img
              key={index}
              src={`data:image/png;base64,${image}`}
              width="256"
              alt={`image-${index}`}
            />
          ))}
      </div>
    </>
  );
}

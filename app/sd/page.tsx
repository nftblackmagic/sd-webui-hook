"use client";

import { CommonInput } from "../component/CommonInput";
import { ControlNetInput } from "../component/ControlNetInput";
import { ExtraInput } from "../component/ExtraInput";
import { Img2imgImageInput } from "../component/Img2imgImageInput";
import { PromptContainer } from "../component/PromptContainer";
import { useExtra } from "../hook/useExtra.hook";
import { useImg2img } from "../hook/useImg2img.hook";
import { useOptions } from "../hook/useOptions.hook";
import { useProgress } from "../hook/useProgress.hook";
import { useTxt2img } from "../hook/useTxt2img.hook";
import { useEffect, useState } from "react";

const sdModel = [
  {
    title: "Realistic_Vision_V2.0-inpainting.ckpt [73c461d2cf]",
    model_name: "Realistic_Vision_V2.0-inpainting",
    hash: "73c461d2cf",
    sha256: "73c461d2cf60c7f93280c34ef8649522ecd99f920f738c5d795cb1a142116b1d",
    filename:
      "/home/ubuntu/ai/stable-diffusion-webui/models/Stable-diffusion/Realistic_Vision_V2.0-inpainting.ckpt",
    config: null,
  },
  {
    title: "v1-5-pruned.ckpt [e1441589a6]",
    model_name: "v1-5-pruned",
    hash: "e1441589a6",
    sha256: "e1441589a6f3c5a53f5f54d0975a18a7feb7cdf0b0dee276dfc3331ae376a053",
    filename:
      "/home/ubuntu/ai/stable-diffusion-webui/models/Stable-diffusion/v1-5-pruned.ckpt",
    config: null,
  },
  {
    title: "Realistic_Vision_V2.0.ckpt [81086e2b3f]",
    model_name: "Realistic_Vision_V2.0",
    hash: "81086e2b3f",
    sha256: "81086e2b3f3741a82a39bf00f3e98dbbbc31876679d312bd81a46b26d8c5d3d2",
    filename:
      "/home/ubuntu/ai/stable-diffusion-webui/models/Stable-diffusion/Realistic_Vision_V2.0.ckpt",
    config: null,
  },
];

export default function Page() {
  const [images, setImages] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loadingImages, setLoadingImages] = useState<string>("");
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [model, setModel] = useState<string>(
    "Realistic_Vision_V2.0-inpainting"
  );

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

  const {
    result: result5,
    loading: loading5,
    setOptions,
  } = useOptions({
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
        <h1>Model</h1>
        <select
          onChange={(e) => {
            setModel(e.target.value);
          }}
        >
          {sdModel.map((model, index) => (
            <option key={index} value={model.title}>
              {model.title}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setOptions({
              sd_model_checkpoint: model,
            });
          }}
          disabled={loading5}
        >
          Save
        </button>
        {loading5 && <div>loading...</div>}

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

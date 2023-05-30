import { useState } from "react";
import { useSelector } from "./useSelector.hook";
import { useDispatch } from "react-redux";
import { setUrl } from "../redux/Features/Txt2imgState/Txt2imgSlice";

export const useTxt2img = ({ url, port }: { url: string; port: string }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [images, setImages] = useState<any[]>([]);

  const dispatch = useDispatch();

  const txt2imgSettings = useSelector((state) => state.txt2img.settings);

  dispatch(setUrl(url));

  const txt2img = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("txt2imgSettings", txt2imgSettings);
      const res = await fetch("sd/txt2img", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdUrl: url,
          args: txt2imgSettings,
        }),
      });
      // console.log("res in hook", res);
      const json = await res.json();
      // console.log("json in hook", json);
      setImages(json.images);
      setResult(json);
    } catch (err: any) {
      // console.log("err in hook", err);
      setError(err.message);
    }
    setLoading(false);
  };

  return { images, error, loading, result, txt2img };
};

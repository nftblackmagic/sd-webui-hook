import { useState } from "react";
import { ExtraInterface } from "../type/extra";
import { useSelector } from "./useSelector.hook";

export const useExtra = ({ url, port }: { url: string; port: string }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [images, setImages] = useState<any[]>([]);

  const extraSettings: ExtraInterface = useSelector(
    (state) => state.extra.settings
  );

  const extra = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("sd/extra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdUrl: url,
          args: extraSettings,
        }),
      });
      const json = await res.json();
      setImages([json.image]);
      setResult(json);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return { images, error, loading, result, extra };
};

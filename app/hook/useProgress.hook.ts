import { useState } from "react";

export const useProgress = ({ url, port }: { url: string; port: string }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [image, setImage] = useState<string | null>(null);

  const query = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("sd/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sdUrl: url,
          args: {
            skip_current_image: false,
          },
        }),
      });
      const json = await res.json();
      setResult(json);
      setImage(json.current_image);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return { error, loading, result, image, query };
};

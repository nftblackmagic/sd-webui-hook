import { useDispatch } from "react-redux";
import { useSelector } from "../hook/useSelector.hook";
import { setSettings as setTxt2imgSettings } from "../redux/Features/Txt2imgState/Txt2imgSlice";
import { setSettings as setImg2imgSettings } from "../redux/Features/Img2imgState/Img2imgSlice";

export const PromptContainer = ({ mode }: { mode: number }) => {
  const settings =
    mode == 0
      ? useSelector((state) => state.txt2img.settings)
      : useSelector((state) => state.img2img.settings);
  const setSettings = mode == 0 ? setTxt2imgSettings : setImg2imgSettings;
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    dispatch(setSettings({ ...settings, prompt: e.target.value }));
  };

  const handleNegativeChange = (e: any) => {
    dispatch(setSettings({ ...settings, negative_prompt: e.target.value }));
  };

  return (
    <div>
      <input type="text" value={settings.prompt} onChange={handleChange} />
      <input
        type="text"
        value={settings.negative_prompt}
        onChange={handleNegativeChange}
      />
    </div>
  );
};

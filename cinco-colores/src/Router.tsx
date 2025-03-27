import { Route, Routes } from "react-router-dom";
import ColorPicker from "./ColorPicker";
import Gallery from "./Gallery";

const Router = () => {
  return (
    <Routes>
      <Route path="color-picker" element={<ColorPicker />} />
      <Route path="/*" element={<Gallery />} />
    </Routes>
  );
};

export default Router;

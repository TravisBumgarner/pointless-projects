import { Route, Routes } from "react-router-dom";
import About from "../pages/About";
import ColorPicker from "../pages/ColorPicker";
import Gallery from "../pages/Gallery/Gallery";

const Router = () => {
  return (
    <Routes>
      <Route path="color-picker" element={<ColorPicker />} />
      <Route path="/*" element={<Gallery />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default Router;

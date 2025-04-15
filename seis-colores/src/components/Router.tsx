import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "../pages/About";
import ColorPicker from "../pages/ColorPicker";
import Gallery from "../pages/Gallery/Gallery";

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/color-picker" element={<ColorPicker />} />

        <Route path="/about" element={<About />} />
        <Route path="/" element={<Gallery />} />
        <Route path="/:id" element={<Gallery />} />
      </Routes>
    </AnimatePresence>
  );
};

export default Router;

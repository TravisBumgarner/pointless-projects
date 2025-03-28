import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import About from "../pages/About";
import ColorPicker from "../pages/ColorPicker";
import Gallery from "../pages/Gallery/Gallery";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route
          path="color-picker"
          element={
            <PageTransition key={location.pathname}>
              <ColorPicker />
            </PageTransition>
          }
        />

        <Route
          path="/about"
          element={
            <PageTransition key={location.pathname}>
              <About />
            </PageTransition>
          }
        />
        <Route
          path="/"
          element={
            <PageTransition key={location.pathname}>
              <Gallery />
            </PageTransition>
          }
        />
        <Route
          path="/:id"
          element={
            <PageTransition key={location.pathname}>
              <Gallery />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default Router;

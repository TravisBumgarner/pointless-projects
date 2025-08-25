import { Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import Room from "../pages/Room";
import Solo from "../pages/Solo";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:room" element={<Room />} />
      <Route path="/solo" element={<Solo />} />
    </Routes>
  );
};

export default Router;

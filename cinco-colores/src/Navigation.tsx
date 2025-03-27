import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <Link to="/">Gallery</Link>
      <Link to="/color-picker">Color Picker</Link>
    </div>
  );
};
export default Navigation;

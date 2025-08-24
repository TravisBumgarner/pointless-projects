import { Link } from "react-router";

const Navigation = () => {
  return (
    <nav>
      <h1>beep boop!</h1>
      <ul>
        <li>
          <Link to="/">Ditzy Dice</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

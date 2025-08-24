import { Link } from "react-router";

const Navigation = () => {
  return (
    <nav>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h1>Dapper Dice</h1>
      </Link>
    </nav>
  );
};

export default Navigation;

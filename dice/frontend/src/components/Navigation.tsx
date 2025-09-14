import Typography from "@mui/material/Typography";
import { Link } from "react-router";

const Navigation = () => {
  return (
    <nav>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="h1">Dapper Dice</Typography>
      </Link>
    </nav>
  );
};

export default Navigation;

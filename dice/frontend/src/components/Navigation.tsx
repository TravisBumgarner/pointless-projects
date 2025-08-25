import Typography from "@mui/material/Typography";
import { Link } from "react-router";

const Navigation = () => {
  return (
    <nav style={{ position: "fixed", top: 16, left: 16 }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="h1">Dapper Dice</Typography>
      </Link>
    </nav>
  );
};

export default Navigation;

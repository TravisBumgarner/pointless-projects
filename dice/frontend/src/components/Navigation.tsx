import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const AVAILABLE_TITLES = [
  "Dapper Dice",
  "Dangerous Dice",
  "Dashing Dice",
  "Dizzying Dice",
  "Dazzling Dice",
  "Doom Dice",
  "Dreary Dice",
  "Demonic Dice",
  "Delightful Dice",
  "Dastardly Dice",
  "Deceitful Dice",
  "Diligent Dice",
  "Downfall Dice",
];

const Navigation = () => {
  const [title, setTitle] = useState("Dapper Dice");
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * AVAILABLE_TITLES.length);
    const randomTitle = AVAILABLE_TITLES[randomIndex];
    document.title = randomTitle;
    setTitle(randomTitle);
  }, []);

  return (
    <Box sx={{ marginBottom: "1rem", textAlign: "center" }}>
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="h1">{title}</Typography>
      </Link>
    </Box>
  );
};

export default Navigation;

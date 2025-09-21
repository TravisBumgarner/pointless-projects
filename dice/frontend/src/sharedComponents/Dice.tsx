import React from "react";
import { Button, type SxProps } from "@mui/material";

interface DiceButtonProps {
  onClick: () => void;
  sx?: SxProps;
}

const DiceButton: React.FC<DiceButtonProps> = ({ onClick, sx = {} }) => {
  const buttonSx: SxProps = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
    padding: "10px",
    width: 104,
    height: 104,
    backgroundColor: "#e7e7e7",
    boxShadow:
      "inset 0 5px white, inset 0 -5px #bbb, inset 5px 0 #d7d7d7, inset -5px 0 #d7d7d7",
    borderRadius: "10%",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    "&:hover": {
      backgroundColor: "#ddd",
    },
    "&:active": {
      boxShadow: "inset 0 3px #bbb, inset 0 -3px white, inset 3px 0 #d0d0d0, inset -3px 0 #d0d0d0",
    },
    ...sx,
  };

  return (
    <Button sx={buttonSx} onClick={onClick}>
      Roll
    </Button>
  );
};

export default DiceButton;

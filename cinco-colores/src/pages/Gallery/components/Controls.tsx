import { SWATCH_SIZE } from "../../../consts";

const Controls = ({
  handlePreviousPalette,
  handleNextPalette,
  handleRandomPalette,
  previousBackgroundColor,
  nextBackgroundColor,
  randomBackgroundColor,
}: {
  handlePreviousPalette: () => void;
  handleNextPalette: () => void;
  handleRandomPalette: () => void;
  previousBackgroundColor: string;
  nextBackgroundColor: string;
  randomBackgroundColor: string;
}) => {
  return (
    <div>
      <button
        style={{ ...sharedStyled, backgroundColor: previousBackgroundColor }}
        onClick={handlePreviousPalette}
      >
        Previous
      </button>
      <button
        style={{ ...sharedStyled, backgroundColor: nextBackgroundColor }}
        onClick={handleNextPalette}
      >
        Next
      </button>
      <button
        style={{ ...sharedStyled, backgroundColor: randomBackgroundColor }}
        onClick={handleRandomPalette}
      >
        Random
      </button>
    </div>
  );
};

const sharedStyled = {
  width: (SWATCH_SIZE * 2) / 3,
  height: SWATCH_SIZE / 2,
  border: "none",
  color: "black",
  fontSize: "16px",
  cursor: "pointer",
};

export default Controls;

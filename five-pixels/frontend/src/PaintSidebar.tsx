import { MAX_PAINT_POINTS } from "../../shared";
import { postPaint } from "./api";
import ColorPicker from "./ColorPicker";
import useStore from "./store";

const PaintSidebar = () => {
  const tempPoints = useStore((state) => state.tempPoints);
  const pointsLeft = MAX_PAINT_POINTS - Object.keys(tempPoints).length;
  const timeRemaining = useStore((state) => state.timeRemaining);
  const addAlert = useStore((state) => state.addAlert);
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const setTempPoints = useStore((state) => state.setTempPoints);
  
  const canPaint = useStore((state) => state.canPaint);
  const hasPainted = Object.keys(tempPoints).length > 0;
  const clientId = useStore((state) => state.clientId);
  const setError = useStore((state) => state.setError);

  const clearTempPoints = () => {
    setTempPoints({});
  };

  const handlePaint = async () => {
    if (!clientId) {
      addAlert("You are not logged in.");
      return;
    }

    const response = await postPaint(tempPoints, clientId);
    if ("error" in response) {
      setError(response.error);
    } else {
      setTempPoints({});
      setPlaceInQueue(null);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="border">
        <p style={{ fontSize: "20px" }}>
          <span style={{ fontWeight: "bold" }}>{pointsLeft}</span> Pixels Left
        </p>
      </div>
      <div className="border">
        <p style={{ fontSize: "20px" }}>
          <span style={{ fontWeight: "bold" }}>{timeRemaining}s</span> To Go
        </p>
      </div>
      <ColorPicker />
      <div
        className="border"
        style={{
          flexGrow: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          disabled={!hasPainted}
          onClick={clearTempPoints}
          className="destructive"
        >
          Clear
        </button>
        <button
          style={{ marginLeft: "5px" }}
          disabled={!canPaint || !hasPainted}
          onClick={handlePaint}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default PaintSidebar;

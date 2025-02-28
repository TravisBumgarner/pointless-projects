import { MAX_PAINT_POINTS } from "../../../shared";
import { postPaint } from "../api";
import useStore from "../store";
import ColorPicker from "./ColorPicker";

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
  const token = useStore((state) => state.turnstileToken);

  const clearTempPoints = () => {
    setTempPoints({});
  };

  const handlePaint = async () => {
    if (!clientId) {
      addAlert("You are not logged in, try refreshing the page.");
      return;
    }

    if (!token) {
      addAlert("Something went wrong, please refresh the page.");
      return;
    }

    const response = await postPaint({ token, points: tempPoints, clientId });
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
      <ColorPicker />
      <div
        className="border"
        style={{
          display: "flex",
          gap: "10px",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ flexGrow: 1, fontSize: "16px", textAlign: "center" }}>
          <span style={{ fontWeight: "bold" }}>{timeRemaining}</span> seconds
          left to draw <span style={{ fontWeight: "bold" }}>{pointsLeft}</span>{" "}
          Pixels
        </p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            disabled={!hasPainted || token === null}
            onClick={clearTempPoints}
            className="destructive"
            style={{ width: "90px", marginRight: "10px" }}
          >
            Clear
          </button>
          <button
            style={{ width: "90px" }}
            disabled={!canPaint || !hasPainted}
            onClick={handlePaint}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaintSidebar;

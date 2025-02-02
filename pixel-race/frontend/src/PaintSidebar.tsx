import { MAX_PAINT_POINTS } from "../../shared";
import { postPaint } from "./api";
import useStore from "./store";

const PaintSidebar = () => {
  const placeInQueue = useStore((state) => state.placeInQueue);
  const tempPoints = useStore((state) => state.tempPoints);
  const canPaint = placeInQueue === 0;
  const pointsLeft = MAX_PAINT_POINTS - Object.keys(tempPoints).length;
  const setTempPoints = useStore((state) => state.setTempPoints);
  const hasPainted = Object.keys(tempPoints).length > 0;
  const setPlaceInQueue = useStore((state) => state.setPlaceInQueue);
  const clientId = useStore((state) => state.clientId);
  const addAlert = useStore((state) => state.addAlert);
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
    <div className="border" style={{flexGrow: 1}}>
      <button style={{ marginBottom: "10px" }} disabled={!canPaint || !hasPainted} onClick={handlePaint}>
        Paint
      </button>
      <button disabled={!hasPainted} onClick={clearTempPoints}>
        Clear Canvas
      </button>
      {canPaint && (
        <p>You can paint {pointsLeft} more points. (Press clear to reset)</p>
      )}
    </div>
  );
};

export default PaintSidebar;

import { useState } from "react";
import { Algorithm } from "./data/palettes";

const algorithmDetails = {
  [Algorithm.PythonKMeans]: {
    name: Algorithm.PythonKMeans,
    description:
      "Uses sklearn's KMeans to group similar colors together, selecting the most representative colors from each cluster.",
  },
  [Algorithm.PythonColorThief]: {
    name: Algorithm.PythonColorThief,
    description:
      "Uses the colorthief library to extract 6 dominant colors. (https://lokeshdhakar.com/projects/color-thief/)",
  },
  [Algorithm.PythonBasicPixelCount]: {
    name: Algorithm.PythonBasicPixelCount,
    description:
      "Converts pixels to hex colors, counts frequencies, and selects top 6 most frequent colors.",
  },
  [Algorithm.PythonColorDistance2]: {
    name: Algorithm.PythonColorDistance2,
    description:
      "Uses CIEDE2000 color distance with a threshold of 2 to filter similar colors.",
  },
  [Algorithm.PythonColorDistance10]: {
    name: Algorithm.PythonColorDistance10,
    description:
      "Uses CIEDE2000 color distance with a threshold of 10 to filter similar colors.",
  },
  [Algorithm.PythonColorDistance20]: {
    name: Algorithm.PythonColorDistance20,
    description:
      "Uses CIEDE2000 color distance with a threshold of 20 to filter similar colors.",
  },
  [Algorithm.PythonColorDistance50]: {
    name: Algorithm.PythonColorDistance50,
    description:
      "Uses CIEDE2000 color distance with a threshold of 50 to filter similar colors.",
  },
  [Algorithm.PythonColorDistance20AndBlackDistance30]: {
    name: Algorithm.PythonColorDistance20AndBlackDistance30,
    description:
      "Uses CIEDE2000 color distance with a threshold of 20 to filter similar colors and black with a distance of 30.",
  },
  [Algorithm.PythonColorDistance20AndWhiteDistance30]: {
    name: Algorithm.PythonColorDistance20AndWhiteDistance30,
    description:
      "Uses CIEDE2000 color distance with a threshold of 20 to filter similar colors and white with a distance of 30.",
  },
};

export const AlgorithmInfo = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(
    null
  );

  return (
    <div style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1000 }}>
      <button
        onClick={() =>
          setSelectedAlgorithm(
            selectedAlgorithm ? null : Algorithm.PythonKMeans
          )
        }
        style={{
          padding: "8px 16px",
          backgroundColor: "#333",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Algorithm Info
      </button>

      {selectedAlgorithm && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            marginBottom: "8px",
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            width: "600px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setSelectedAlgorithm(null)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px 8px",
              color: "#666",
              borderRadius: "4px",
              lineHeight: 1,
            }}
          >
            ×
          </button>
          <div style={{ marginBottom: "16px" }}>
            <h3 style={{ margin: "0 0 8px 0" }}>
              {algorithmDetails[selectedAlgorithm].name}
            </h3>
            <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
              {algorithmDetails[selectedAlgorithm].description}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {Object.values(Algorithm).map((algo) => (
              <button
                key={algo}
                onClick={() => setSelectedAlgorithm(algo)}
                style={{
                  padding: "8px",
                  backgroundColor:
                    selectedAlgorithm === algo ? "#eee" : "transparent",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {algorithmDetails[algo].name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

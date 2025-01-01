import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import output from "./output.json";

function base64_to_rgb(base64: string) {
  const decoded = atob(base64);
  const colors = decoded.split("_").map((color) => {
    const [r, g, b] = color.split("-").map(Number);
    return `rgb(${r}, ${g}, ${b})`;
  });

  return colors;
}

const SHARED_WIDTH = 500;

const Preview = styled.div<{ colors: string[]; aspect_ratio: number }>`
  background: ${({ colors }) =>
    `linear-gradient(to right, ${colors.join(", ")})`};
  height: ${SHARED_WIDTH}px;
  width: ${({ aspect_ratio }) => SHARED_WIDTH * aspect_ratio}px;
`;

const StyledImage = styled.img<{ aspect_ratio: number }>`
  height: ${SHARED_WIDTH}px;
  width: ${({ aspect_ratio }) => SHARED_WIDTH * aspect_ratio}px;
  display: block;s
`;

const Image = ({
  filename,
  colors,
  aspect_ratio,
}: {
  filename: string;
  colors: string[];
  aspect_ratio: number;
}) => {
  const [showPreview, setShowPreview] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.addEventListener("mouseover", () => {
        setShowPreview(false);
      });
      imageRef.current.addEventListener("mouseout", () => {
        setShowPreview(true);
      });
    }
  }, []);

  return (
    <div ref={imageRef} style={{ display: "inline-block", marginBottom: 75 }}>
      <div style={{ marginBottom: 10 }}>
        {colors.map((color) => {
          return (
            <div
              style={{
                width: 150,
                display: "inline-block",
                height: 25,
                borderBottom: `10px solid ${color}`,
              }}
            >
              {color}
            </div>
          );
        })}
      </div>
      {showPreview ? (
        <Preview colors={colors} aspect_ratio={aspect_ratio} />
      ) : (
        <StyledImage
          aspect_ratio={aspect_ratio}
          alt={filename}
          src={filename}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
      {Object.entries(output).map(
        ([file, { encoded_string, aspect_ratio }]) => {
          return (
            <div key={file}>
              <Image
                filename={file}
                colors={base64_to_rgb(encoded_string)}
                aspect_ratio={aspect_ratio}
              />
            </div>
          );
        }
      )}
    </div>
  );
}

export default App;

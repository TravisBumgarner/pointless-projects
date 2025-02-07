import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

function animatedLinesDecoder(base64: string) {
  const decoded = atob(base64);
  const colors = decoded.split("_").map((color) => {
    const [r, g, b] = color.split("-").map(Number);
    return `rgb(${r}, ${g}, ${b})`;
  });

  return colors;
}

const SHARED_WIDTH = 500;

const randomArrayItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const Column = ({ color: initialColor }: { color: string }) => {
  const [color, setColor] = useState("white");
  const timeout = useMemo(() => Math.random() * 500, []);

  useEffect(() => {
    setTimeout(() => {
      setColor(initialColor);
    }, timeout);
  }, [initialColor, timeout]);

  useEffect(() => {
    setTimeout(() => {
      setColor("transparent");
    }, timeout + 250);
  }, [timeout]);

  return <div style={{ flexGrow: 1, backgroundColor: color, pointerEvents: 'none' }}></div>;
};

const AnimatedLinesPreview = ({
  colors,
  aspect_ratio,
}: {
  colors: string[];
  aspect_ratio: number;
}) => {
  const COLUMNS = SHARED_WIDTH / 2;
  const COLORS = Array.from({ length: COLUMNS }, () => randomArrayItem(colors));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: SHARED_WIDTH,
        width: SHARED_WIDTH * aspect_ratio,
        display: "flex",
        flexDirection: "row",
        pointerEvents: 'none',
      }}
    >
      {COLORS.map((color) => {
        return <Column color={color} />;
      })}
    </div>
  );
};

const StyledImage = styled.img<{ aspect_ratio: number }>`
  height: ${SHARED_WIDTH}px;
  width: ${({ aspect_ratio }) => SHARED_WIDTH * aspect_ratio}px;
  display: block;
`;

const SomeHashImage = ({
  filename,
  hash,
  aspect_ratio,
  version,
}: {
  filename: string;
  hash: string;
  aspect_ratio: number;
  version: string;
}) => {
  if (version === "animated_lines") {
    const colors = animatedLinesDecoder(hash);
    return (
      <div style={{ display: "inline-block" }}>
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
        <div style={{ position: "relative" }}>
          <StyledImage
            aspect_ratio={aspect_ratio}
            alt={filename}
            src={filename}
          />
          <AnimatedLinesPreview colors={colors} aspect_ratio={aspect_ratio} />
        </div>
      </div>
    );
  }

  // Can be extended to support other versions.
  return (
    <div>
      Unsorted version {version} for {filename}
    </div>
  );
};

export default SomeHashImage;

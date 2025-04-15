import React from "react";
import styled from "styled-components";

const Photo = ({
  src,
  setOrientation,
}: {
  src: string;
  setOrientation: (orientation: "vertical" | "horizontal") => void;
}) => {
  const imagePath = new URL(`../../../data/images/${src}`, import.meta.url)
    .href;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setOrientation(
      img.naturalWidth > img.naturalHeight ? "horizontal" : "vertical"
    );
  };

  return (
    <>
      <StyledPhoto src={imagePath} onLoad={handleLoad} />
    </>
  );
};

const StyledPhoto = styled.img`
  flex-grow: 1;
  flex-shrink: 1;
  object-fit: cover;
  min-height: 0;
  object-position: top left;
`;

export default Photo;

import styled from "styled-components";

const Photo = ({ src }: { src: string }) => {
  const imagePath = new URL(`../../../data/images/${src}`, import.meta.url)
    .href;

  return <StyledPhoto src={imagePath} />;
};

const StyledPhoto = styled.img`
  flex-grow: 1;
  flex-shrink: 1;
  object-fit: contain;
  min-height: 0;
  object-position: top left;
  min-width: 0;
`;

export default Photo;

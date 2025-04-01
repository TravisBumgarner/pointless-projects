import styled from "styled-components";

const Photo = ({ src }: { src: string }) => {
  const imagePath = new URL(`../../../data/images/${src}`, import.meta.url)
    .href;

  return (
    <Wrapper>
      <StyledPhoto src={imagePath} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-width: 80vw;
  max-height: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 70vh;
  }
`;

const StyledPhoto = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

export default Photo;

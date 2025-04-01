import styled from "styled-components";

const Background = () => {
  const colors = ["#F5F5F5", "#E0E0E0", "#ababab", "#131313"];
  let originalColor = document.body.style.background || "#fff";

  const setBackground = (color: string) => {
    document.body.style.background = color;
  };

  return (
    <Container>
      {colors.map((color) => (
        <ColorButton
          key={color}
          $color={color}
          title={`Cambiar fondo / Change background`}
          onMouseEnter={() => setBackground(color)}
          onMouseLeave={() => setBackground(originalColor)}
          onClick={() => {
            setBackground(color);
            originalColor = color;
          }}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const ColorButton = styled.button<{ $color: string }>`
  width: calc(var(--swatch-size) / 2);
  height: calc(var(--swatch-size) / 2);
  background: ${(props) => props.$color};
  cursor: pointer;
  border: 0;

  @media (max-width: 768px) {
    width: calc(var(--swatch-size));
    height: calc(var(--swatch-size));
  }
`;

export default Background;

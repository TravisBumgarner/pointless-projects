import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import { getContrastColor } from "../utilities";

const About = () => {
  let background = getComputedStyle(document.body).backgroundColor;

  if (background === "rgba(0, 0, 0, 0)") {
    // For some reason, on page load, the background is rgba(0, 0, 0, 0). This project isn't permanent so we're hacking it.
    background = "#F5F5F5";
  }

  return (
    <div
      style={{
        paddingBottom: "50px",
        fontSize: "20px",
        color: getContrastColor(background),
        fontFamily: "Satoshi",
      }}
    >
      <div style={{ position: "relative" }}>
        <Link
          style={{
            position: "fixed",
            top: "var(--gutter-spacing)",
            right: "var(--gutter-spacing)",
            textDecoration: "none",
            color: getContrastColor(background),
          }}
          to="/seis"
        >
          <GrFormClose style={{ fontSize: `calc(var(--swatch-size) * 0.5)` }} />
        </Link>
      </div>
      <h1 style={{ marginTop: 0 }}>Sobre</h1>
      <p>
        Cuando era chiquito, mi mamá me dijo que podía escoger el color de mi
        cuarto. Escogí azul oscuro. En la universidad, el dueño de mi casa me
        dijo lo mismo, y escogí un naranja muy brillante. En un país lleno de
        paredes blancas, yo era un poquito raro.
      </p>
      <p>
        En 2015, llegué a México por primera vez. La gente de México, sin
        preguntarle a nadie, escogió colores muy brillantes para pintar sus
        casas. Me enamoré. Cada vez que paso por una casa colorida, me siento
        inspirado.
      </p>
      <p>Y así nació Seis Colores.</p>
      <p>
        - Travis (
        <Link
          style={{
            color: getContrastColor(background),
          }}
          to="http://travisbumgarner.dev/"
        >
          Aprender más
        </Link>
        )
      </p>
      <h1>About</h1>
      <p>
        When I was young, my mom told me I could choose the color of my room. I
        chose dark blue. In university, my landlord told me the same and I chose
        a bright orange. In a country full of white walls, I felt like an
        oddity.
      </p>
      <p>
        In 205, I arrived to Mexico for the first time. The people of Mexico,
        without asking anybody, chose bright colors to paint their houses. I
        fell in love. Every time I pass by a colorful house, I feel inspired.
      </p>
      <p>And thus, Seis Colores was born.</p>
      <p>
        - Travis (
        <Link
          style={{
            color: getContrastColor(background),
          }}
          target="_blank"
          to="http://travisbumgarner.dev/"
        >
          Learn more
        </Link>
        )
      </p>
    </div>
  );
};

export default About;

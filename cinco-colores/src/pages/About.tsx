import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div
      style={{
        fontFamily: "Satoshi",
        fontSize: "20px",
      }}
    >
      <div style={{ position: "relative" }}>
        <Link
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            textDecoration: "none",
            color: "black",
          }}
          to="/"
        >
          <GrFormClose style={{ fontSize: `calc(var(--swatch-size) * 0.5)` }} />
        </Link>
      </div>
      <h1>Sobre</h1>
      <p>
        Cuando era chiquito, mi mamá me dijo que podía escoger el color de mi
        cuarto. Escogí azul oscuro. En la universidad, el dueño de mi casa me
        dijo lo mismo, y escogí un naranja muy brillante. En un país lleno de
        paredes blancas, yo era un poquito raro.
        <p>
          En 2015, llegué a México por primera vez. La gente de México, sin
          preguntarle a nadie, escogió colores muy brillantes para pintar sus
          casas. Me enamoré. Cada vez que paso por una casa colorida, me siento
          inspirado.
        </p>
        <p>Y así nació Cinco Colores.</p>
        <h1>About</h1>
        <p>
          When I was young, my mom told me I could choose the color of my room.
          I chose dark blue. In university, my landlord told me the same and I
          chose a bright orange. In a country full of white walls, I felt like
          an oddity.
        </p>
        <p>
          In 205, I arrived to Mexico for the first time. The people of Mexico,
          without asking anybody, chose bright colors to paint their houses. I
          fell in love. Every time I pass by a colorful house, I feel inspired.
        </p>
        <p>And thus, Cinco Colores was born.</p>
      </p>
    </div>
  );
};

export default About;

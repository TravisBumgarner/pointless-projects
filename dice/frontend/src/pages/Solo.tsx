import { useState } from "react";

import Roller from "../rollers";
import DiceSelector from "../DiceSelector";

interface DiceResult {
  user: string;
  roll: number;
  sides: number;
}

const Solo = () => {
  const [results, setResults] = useState<DiceResult | null>(null);
  const [sides, setSides] = useState(6);

  const roll = (sides: number) => {
    setSides(sides);
    const rollValue = Math.floor(Math.random() * sides) + 1;
    setResults({ user: "solo", roll: rollValue, sides });
  };

  return (
    <div>
      <h1>Solo Room </h1>
      <DiceSelector roll={roll} />
      {results && <Roller sides={sides} results={results} />}
    </div>
  );
};

export default Solo;

export interface DiceRollerProps {
  result: number | null;
  sides: number;
}
export type RollerType =
  | "wheel-of-doom"
  | "plinko"
  | "balloon"
  | "jack-in-the-box";

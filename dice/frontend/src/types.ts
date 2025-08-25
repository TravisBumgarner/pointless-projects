export interface DiceRollerProps {
  rollResult: number;
  sides: number;
}
export type RollerType =
  | "wheel-of-doom"
  | "plinko"
  | "balloon"
  | "jack-in-the-box";

export interface DiceRollerProps {
  params: { sides: number }
  isRolling: boolean
  setIsRolling: (rolling: boolean) => void
}
export type RollerType = 'wheel-of-doom' | 'plinko' | 'balloon' | 'demon-in-the-box'

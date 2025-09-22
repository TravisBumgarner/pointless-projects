import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { DiceRollerProps } from '../types'
import { PALETTE } from '../styles/styleConsts'
import { Box } from '@mui/material'

const WheelOfDoom: React.FC<DiceRollerProps> = ({ params: { sides }, isRolling, setIsRolling }) => {
  const [spinning, setSpinning] = useState(false)
  const [activeSegment, setActiveSegment] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<number | null>(null)
  const wheelRef = useRef<HTMLDivElement>(null)
  const [wheelSideLength, setWheelSideLength] = useState(0)
  const shouldAnimateRef = useRef(false)

  useEffect(() => {
    const wheel = wheelRef.current
    if (!wheel) return
    const observer = new ResizeObserver(() => {
      setWheelSideLength(wheel.clientWidth)
    })
    observer.observe(wheel)
    // Set initial size
    setWheelSideLength(wheel.clientWidth)
    return () => observer.disconnect()
  }, [])

  // Reset result when sides change (but don't auto-roll)
  useEffect(() => {
    setResult(null)
    setSpinning(false)
    setShowResult(false)
    setActiveSegment(null)
    setRotation(0)
    shouldAnimateRef.current = false
  }, [sides])

  useEffect(() => {
    if (!result || !shouldAnimateRef.current) return

    setSpinning(true)
    setShowResult(false)

    // Calculate the final rotation so the wheel lands on the rolled result
    const segmentAngle = 360 / sides
    const spins = 5 // number of full spins
    // Keep the original calculation to land on the right side
    const finalRotation = spins * 360 + (360 - (result - 1) * segmentAngle - segmentAngle / 2)
    setRotation(finalRotation)

    // Animate the spinning wheel and track active segment
    const start = Date.now()
    const duration = 5000

    const tick = () => {
      const now = Date.now()
      const elapsed = Math.min(now - start, duration)
      // Ease out
      const progress = elapsed / duration
      const eased = 1 - Math.pow(1 - progress, 3)
      const currentRotation = eased * finalRotation
      // Calculate active segment
      const normalized = ((currentRotation % 360) + 360) % 360
      let seg = Math.floor((360 - normalized) / segmentAngle) + 1
      if (seg > sides) seg = 1
      setActiveSegment(seg)

      if (elapsed < duration) {
        requestAnimationFrame(tick)
      } else {
        setActiveSegment(result)
        setSpinning(false)
        setShowResult(true)
      }
    }

    tick()
  }, [result, sides])

  const roll = useCallback(() => {
    // Reset all state first
    setSpinning(false)
    setShowResult(false)
    setActiveSegment(null)
    setRotation(0)
    shouldAnimateRef.current = true

    // Generate new result after a brief delay to ensure state reset
    setTimeout(() => {
      const newResult = Math.floor(Math.random() * sides) + 1
      setResult(newResult)
    }, 50)
  }, [sides])

  // Generate wheel segments
  const segmentAngle = 360 / sides
  const segments = Array.from({ length: sides }, (_, i) => {
    const angle = segmentAngle * i
    const isWinner = (spinning && activeSegment === i + 1) || (showResult && result === i + 1)
    // Calculate arc end point
    const startAngle = angle
    const endAngle = angle + segmentAngle
    const r = wheelSideLength / 2 - 10
    const x1 = wheelSideLength / 2 + r * Math.cos((startAngle * Math.PI) / 180)
    const y1 = wheelSideLength / 2 + r * Math.sin((startAngle * Math.PI) / 180)
    const x2 = wheelSideLength / 2 + r * Math.cos((endAngle * Math.PI) / 180)
    const y2 = wheelSideLength / 2 + r * Math.sin((endAngle * Math.PI) / 180)
    // For text label
    const textAngle = angle + segmentAngle / 2
    const textRadius = wheelSideLength / 2 - 40
    const textX = wheelSideLength / 2 + textRadius * Math.cos((textAngle * Math.PI) / 180)
    const textY = wheelSideLength / 2 + textRadius * Math.sin((textAngle * Math.PI) / 180)
    return (
      <g key={i}>
        <path
          d={`M${wheelSideLength / 2},${wheelSideLength / 2} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
          fill={isWinner ? PALETTE.wow.orangeDark : i % 2 === 0 ? PALETTE.wow.blueLight : PALETTE.wow.blueDark}
        />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={14}
          fill="white"
          transform={`rotate(${-rotation}, ${textX}, ${textY})`}
        >
          {i + 1}
        </text>
      </g>
    )
  })

  useEffect(() => {
    if (isRolling) roll()
    setIsRolling(false)
  }, [isRolling, roll, setIsRolling])

  return (
    <Box>
      <Box
        ref={wheelRef}
        sx={{
          width: '70%',
          aspectRatio: '1 / 1',
          margin: '0 auto',
          transition: spinning ? 'transform 5s cubic-bezier(.17,.67,.83,.67)' : 'none',
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          width={wheelSideLength}
          height={wheelSideLength}
          viewBox={`0 0 ${wheelSideLength} ${wheelSideLength}`}
          style={{ display: 'block' }}
        >
          {segments}
          {/* Center circle */}
          <circle
            cx={wheelSideLength / 2}
            cy={wheelSideLength / 2}
            r={30}
            fill={PALETTE.grayscale[900]}
            strokeWidth={2}
          />
        </svg>
      </Box>
    </Box>
  )
}

export default WheelOfDoom

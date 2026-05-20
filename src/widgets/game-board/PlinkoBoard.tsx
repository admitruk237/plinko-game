'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Risk } from '@/entities/game/model/types'
import { multiplierColor, multiplierBorderColor } from '@/shared/lib/multiplier-color'

interface PegHit {
  row: number
  col: number
  time: number
}

interface BallAnimation {
  path: string
  bucketIndex: number
  startTime: number
}

interface Props {
  rows: number
  risk: Risk
  payoutTable: number[]
  currentAnimation: BallAnimation | null
  onAnimationEnd: () => void
}

const PEG_SIZE = 8
const BALL_SIZE = 14
const STEP_DURATION = 80
const SETTLE_DURATION = 200
const BUCKET_FLASH_DURATION = 300

export const PlinkoBoard = ({ rows, risk, payoutTable, currentAnimation, onAnimationEnd }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number>(0)
  const [pegHits, setPegHits] = useState<PegHit[]>([])
  const [flashBucket, setFlashBucket] = useState<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const getPegPosition = useCallback(
    (row: number, col: number) => {
      const { width, height } = dimensions
      if (!width || !height) return { x: 0, y: 0 }

      const bucketBarHeight = 50
      const availableHeight = height - bucketBarHeight - 40
      const rowSpacing = availableHeight / (rows + 1)

      const pegsInRow = row + 2
      const maxPegs = rows + 2
      const colSpacing = (width - 80) / (maxPegs - 1)

      const rowWidth = (pegsInRow - 1) * colSpacing
      const startX = (width - rowWidth) / 2

      return {
        x: startX + col * colSpacing,
        y: 30 + (row + 1) * rowSpacing,
      }
    },
    [dimensions, rows]
  )

  const getBucketPosition = useCallback(
    (index: number) => {
      const { width, height } = dimensions
      if (!width || !height) return { x: 0, y: 0, w: 0 }

      const numBuckets = rows + 1
      const totalWidth = width - 40
      const bucketWidth = totalWidth / numBuckets

      return {
        x: 20 + index * bucketWidth + bucketWidth / 2,
        y: height - 30,
        w: bucketWidth,
      }
    },
    [dimensions, rows]
  )

  // Draw pegs
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !dimensions.width || !dimensions.height) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = dimensions.width * 2
    canvas.height = dimensions.height * 2
    ctx.scale(2, 2)

    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    const now = Date.now()

    for (let row = 0; row < rows; row++) {
      const pegsInRow = row + 2
      for (let col = 0; col < pegsInRow; col++) {
        const pos = getPegPosition(row, col)
        const hit = pegHits.find((h) => h.row === row && h.col === col)
        const hitAge = hit ? now - hit.time : Infinity

        let scale = 1
        if (hitAge < 120) {
          const t = hitAge / 120
          scale = 1 + 0.15 * Math.sin(t * Math.PI)
        }

        const radius = (PEG_SIZE / 2) * scale

        ctx.beginPath()
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = hitAge < 120 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'
        ctx.fill()

        if (hitAge < 120) {
          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius + 4 * (1 - hitAge / 120), 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - hitAge / 120)})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
    }
  }, [dimensions, rows, pegHits, getPegPosition])

  // Animate ball
  useEffect(() => {
    if (!currentAnimation || !dimensions.width) return

    const { path, bucketIndex: animBucketIndex, startTime } = currentAnimation
    const totalDuration = path.length * STEP_DURATION + SETTLE_DURATION
    const newPegHits: PegHit[] = []

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = dimensions.width * 2
      canvas.height = dimensions.height * 2
      ctx.scale(2, 2)
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      const now = Date.now()
      const elapsed = now - startTime

      // Draw pegs
      for (let row = 0; row < rows; row++) {
        const pegsInRow = row + 2
        for (let col = 0; col < pegsInRow; col++) {
          const pos = getPegPosition(row, col)
          const hit = newPegHits.find((h) => h.row === row && h.col === col)
          const hitAge = hit ? now - hit.time : Infinity

          let scale = 1
          if (hitAge < 120) {
            const t = hitAge / 120
            scale = 1 + 0.15 * Math.sin(t * Math.PI)
          }

          const radius = (PEG_SIZE / 2) * scale

          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = hitAge < 120 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'
          ctx.fill()

          if (hitAge < 120) {
            ctx.beginPath()
            ctx.arc(pos.x, pos.y, radius + 4 * (1 - hitAge / 120), 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - hitAge / 120)})`
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }
      }

      // Calculate ball position
      const stepIndex = Math.min(Math.floor(elapsed / STEP_DURATION), path.length)
      const stepProgress = Math.min((elapsed % STEP_DURATION) / STEP_DURATION, 1)
      const eased = 1 - Math.pow(1 - stepProgress, 2)

      let ballX: number
      let ballY: number

      if (stepIndex >= path.length) {
        // Settling into bucket
        const bucketPos = getBucketPosition(animBucketIndex)
        const lastPegRow = rows - 1
        let lastCol = 0
        for (let i = 0; i < path.length; i++) {
          lastCol += path[i] === 'R' ? 1 : 0
        }
        const lastPegPos = getPegPosition(lastPegRow, lastCol + (path[path.length - 1] === 'R' ? 0 : 0))

        const settleProgress = Math.min((elapsed - path.length * STEP_DURATION) / SETTLE_DURATION, 1)
        const settleEased = 1 - Math.pow(1 - settleProgress, 3)

        ballX = lastPegPos.x + (bucketPos.x - lastPegPos.x) * settleEased
        ballY = lastPegPos.y + (bucketPos.y - lastPegPos.y) * settleEased
      } else {
        // Moving between pegs
        let currentCol = 0
        for (let i = 0; i < stepIndex; i++) {
          currentCol += path[i] === 'R' ? 1 : 0
        }

        if (stepIndex === 0) {
          // From top center to first peg
          const startPos = {
            x: dimensions.width / 2,
            y: 20,
          }
          const nextCol = path[0] === 'R' ? 1 : 0
          const targetPos = getPegPosition(0, nextCol)

          ballX = startPos.x + (targetPos.x - startPos.x) * eased
          ballY = startPos.y + (targetPos.y - startPos.y) * eased

          if (eased > 0.8 && !newPegHits.find((h) => h.row === 0 && h.col === nextCol)) {
            newPegHits.push({ row: 0, col: nextCol, time: now })
            setPegHits([...newPegHits])
          }
        } else {
          const currentPos = getPegPosition(stepIndex - 1, currentCol)
          const nextCol = currentCol + (path[stepIndex] === 'R' ? 1 : 0)
          const targetPos = getPegPosition(stepIndex, nextCol)

          ballX = currentPos.x + (targetPos.x - currentPos.x) * eased
          ballY = currentPos.y + (targetPos.y - currentPos.y) * eased

          if (eased > 0.8 && !newPegHits.find((h) => h.row === stepIndex && h.col === nextCol)) {
            newPegHits.push({ row: stepIndex, col: nextCol, time: now })
            setPegHits([...newPegHits])
          }
        }
      }

      // Draw ball with glow
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, BALL_SIZE)
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.6)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2)
      ctx.fillStyle = 'white'
      ctx.fill()

      ctx.restore()

      if (elapsed < totalDuration) {
        animFrameRef.current = requestAnimationFrame(animate)
      } else {
        setFlashBucket(animBucketIndex)
        setTimeout(() => {
          setFlashBucket(null)
          setPegHits([])
          onAnimationEnd()
        }, BUCKET_FLASH_DURATION)
      }
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [currentAnimation, dimensions, rows, getPegPosition, getBucketPosition, onAnimationEnd])

  return (
    <div ref={containerRef} className="relative flex-1 flex flex-col">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full"
        style={{ height: 'calc(100% - 50px)' }}
      />

      {/* Multiplier bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 px-4 h-[50px]">
        {payoutTable.map((multiplier, index) => {
          const isFlashing = flashBucket === index
          const colorClass = multiplierColor(multiplier)
          const borderColorClass = multiplierBorderColor(multiplier)

          return (
            <div
              key={`${risk}-${rows}-${index}`}
              className={`
                flex items-center justify-center rounded-sm text-xs font-bold
                border px-1 py-1 min-w-[36px] h-[28px]
                transition-all duration-300
                ${borderColorClass}
                ${isFlashing ? `${colorClass} text-white scale-110` : 'bg-transparent text-white/90'}
              `}
            >
              {multiplier}x
            </div>
          )
        })}
      </div>
    </div>
  )
}

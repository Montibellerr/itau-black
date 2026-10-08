/**
 * Linhas de "guilhochê" — ondas finas que se interferem, como em papéis de segurança.
 * Os caminhos são gerados uma única vez no carregamento do módulo e compartilhados
 * por todos os cartões.
 */
const WIDTH = 856
const HEIGHT = 540
const LINES = 16

function wavePath(index: number) {
  const points: string[] = []
  for (let x = -40; x <= WIDTH + 40; x += 16) {
    const y =
      HEIGHT * 0.5 +
      index * 15 +
      Math.sin(x / 120 + index * 0.38) * (30 + index * 1.6) +
      Math.sin(x / 46 + index * 0.9) * 5
    points.push(`${x},${y.toFixed(1)}`)
  }
  return `M${points.join('L')}`
}

const WAVES = Array.from({ length: LINES }, (_, index) => wavePath(index))

export function CardPattern({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        {WAVES.map((d, index) => (
          <path key={index} d={d} />
        ))}
      </g>
    </svg>
  )
}

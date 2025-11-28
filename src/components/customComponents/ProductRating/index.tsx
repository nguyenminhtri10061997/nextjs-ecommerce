import StarIcon from "@public/svg/star.svg"

type TProps = {
  rate?: number // 0 - 5
  size?: number
}

export function StarRating({ rate = 0, size = 20 }: TProps) {
  const fillPercent = (rate * 100) / 5

  return (
    <div className="flex overflow-hidden" style={{ width: `${fillPercent}%` }}>
      {new Array(5).fill(null).map((_, i) => (
        <StarIcon
          key={i}
          width={size}
          height={size}
          className="flex-shrink-0"
        />
      ))}
    </div>
  )
}

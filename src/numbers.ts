// These replace split(',').map(Number) and a Number call per column, which
// parsed BED12 genes 2x slower (benchmarks/parse.bench.ts).

// `Number(s.slice(start, end))`, read off the string where the part is a plain
// integer. Anything else, such as a '+', a decimal point, whitespace or more
// digits than a double holds exactly, falls back to Number, whose answer this
// has to match.
export function numberAt(s: string, start: number, end: number) {
  let i = start
  const negative = s.charCodeAt(i) === 45
  if (negative) {
    i++
  }
  if (i === end) {
    return negative ? Number.NaN : 0
  }
  if (end - i > 15) {
    return Number(s.slice(start, end))
  }
  let value = 0
  for (; i < end; i++) {
    const digit = s.charCodeAt(i) - 48
    if (digit < 0 || digit > 9) {
      return Number(s.slice(start, end))
    }
    value = value * 10 + digit
  }
  return negative ? -value : value
}

export function toNumber(s: string | undefined) {
  return s === undefined ? Number.NaN : numberAt(s, 0, s.length)
}

// `s.split(',').map(Number)` less a trailing empty part, without the split
export function numberList(s: string) {
  const out: number[] = []
  let start = 0
  for (;;) {
    const comma = s.indexOf(',', start)
    const end = comma === -1 ? s.length : comma
    if (comma !== -1 || end > start) {
      out.push(numberAt(s, start, end))
    }
    if (comma === -1) {
      return out
    }
    start = comma + 1
  }
}

// `s.split(',').filter(f => f).length`, without the split
export function countListItems(s: string) {
  let count = 0
  let start = 0
  for (;;) {
    const comma = s.indexOf(',', start)
    const end = comma === -1 ? s.length : comma
    if (end > start) {
      count++
    }
    if (comma === -1) {
      return count
    }
    start = comma + 1
  }
}

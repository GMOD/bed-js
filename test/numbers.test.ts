import { describe, expect, it } from 'vitest'

import {
  countListItems,
  numberAt,
  numberList,
  toNumber,
} from '../src/numbers.ts'

const EDGES = [
  '',
  '0',
  '-0',
  '00',
  '007',
  '-',
  '--1',
  '+1',
  '1',
  '-1',
  '123456789012345',
  '1234567890123456',
  '99999999999999999999',
  '-123456789012345',
  '1.5',
  '.5',
  '1e3',
  '0x10',
  ' 1',
  '1 ',
  '1-',
  'a',
  'Infinity',
  '-Infinity',
  'NaN',
  '1_000',
]

function listOf(s: string) {
  const parts = s.split(',')
  if (parts.at(-1) === '') {
    parts.pop()
  }
  return parts.map(Number)
}

// a string over the characters that decide the number rules, with commas
function randomList(random: () => number) {
  const alphabet = '0123456789,,,--+. e'
  const length = Math.floor(random() * 12)
  let s = ''
  for (let i = 0; i < length; i++) {
    s += alphabet[Math.floor(random() * alphabet.length)]
  }
  return s
}

function lcg(seed: number) {
  let state = seed
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

describe('numberAt matches Number', () => {
  it.each(EDGES)('%j', s => {
    expect(Object.is(numberAt(s, 0, s.length), Number(s))).toBe(true)
    expect(Object.is(toNumber(s), Number(s))).toBe(true)
  })

  it('reads a part in place', () => {
    expect(numberAt('12,345,6', 3, 6)).toBe(345)
  })

  it('takes undefined as NaN, as Number does', () => {
    expect(toNumber(undefined)).toBeNaN()
  })
})

describe('the list readers match split', () => {
  it.each([...EDGES, ',', ',,', '1,', '1,,2', ',1', '1,2,3,', '-1,1,-1'])(
    '%j',
    s => {
      expect(numberList(s)).toEqual(listOf(s))
      expect(countListItems(s)).toBe(s.split(',').filter(f => f).length)
    },
  )

  it('on 20,000 random lists', () => {
    const random = lcg(7)
    for (let i = 0; i < 20_000; i++) {
      const s = randomList(random)
      const got = numberList(s)
      const want = listOf(s)
      expect(got.length).toBe(want.length)
      for (let j = 0; j < want.length; j++) {
        expect(Object.is(got[j], want[j])).toBe(true)
      }
      expect(countListItems(s)).toBe(s.split(',').filter(f => f).length)
    }
  })
})

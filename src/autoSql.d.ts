export class SyntaxError extends Error {
  message: string
  expected: unknown
  found: string | null
  location: {
    start: { offset: number; line: number; column: number }
    end: { offset: number; line: number; column: number }
  }
}

export interface ParseOptions {
  startRule?: string
}

export function parse(input: string, options?: ParseOptions): unknown

declare const parser: {
  SyntaxError: typeof SyntaxError
  parse: typeof parse
}

export default parser

export type Fraction = { numerator: number; denominator: number }

function gcd(a: number, b: number): number {
	a = Math.abs(a)
	b = Math.abs(b)
	while (b !== 0) {
		const t = b
		b = a % b
		a = t
	}
	return a === 0 ? 1 : a
}

export function reduce(f: Fraction): Fraction {
	if (f.numerator === 0) return { numerator: 0, denominator: 1 }
	const g = gcd(Math.abs(f.numerator), Math.abs(f.denominator))
	const sign = f.denominator < 0 ? -1 : 1
	return { numerator: (sign * f.numerator) / g, denominator: (sign * f.denominator) / g }
}

export function parseFraction(s: string): Fraction {
	const trimmed = s.trim()

	// Mixed number: "1 3/4"
	const mixedMatch = trimmed.match(/^(-?\d+)\s+(\d+)\/(\d+)$/)
	if (mixedMatch) {
		const whole = parseInt(mixedMatch[1]!, 10)
		const num = parseInt(mixedMatch[2]!, 10)
		const den = parseInt(mixedMatch[3]!, 10)
		if (den === 0) throw new Error(`Invalid fraction: "${s}"`)
		const sign = whole < 0 ? -1 : 1
		return reduce({ numerator: whole * den + sign * num, denominator: den })
	}

	// Simple fraction: "3/4"
	const fractionMatch = trimmed.match(/^(-?\d+)\/(\d+)$/)
	if (fractionMatch) {
		const num = parseInt(fractionMatch[1]!, 10)
		const den = parseInt(fractionMatch[2]!, 10)
		if (den === 0) throw new Error(`Invalid fraction: "${s}"`)
		return reduce({ numerator: num, denominator: den })
	}

	// Whole number: "3"
	if (/^-?\d+$/.test(trimmed)) {
		return { numerator: parseInt(trimmed, 10), denominator: 1 }
	}

	throw new Error(`Cannot parse fraction: "${s}"`)
}

export function addFractions(a: Fraction, b: Fraction): Fraction {
	return reduce({
		numerator: a.numerator * b.denominator + b.numerator * a.denominator,
		denominator: a.denominator * b.denominator
	})
}

export function subtractFractions(a: Fraction, b: Fraction): Fraction {
	return reduce({
		numerator: a.numerator * b.denominator - b.numerator * a.denominator,
		denominator: a.denominator * b.denominator
	})
}

export function multiplyFractions(a: Fraction, b: Fraction): Fraction {
	return reduce({
		numerator: a.numerator * b.numerator,
		denominator: a.denominator * b.denominator
	})
}

export function fractionToNumber(f: Fraction): number {
	return f.numerator / f.denominator
}

export function numberToFraction(n: number, maxDenominator = 64): Fraction {
	if (Number.isInteger(n)) return { numerator: n, denominator: 1 }
	for (let den = 2; den <= maxDenominator; den++) {
		const num = Math.round(n * den)
		if (Math.abs(num / den - n) < 1e-10) {
			return reduce({ numerator: num, denominator: den })
		}
	}
	return reduce({ numerator: Math.round(n * 1000), denominator: 1000 })
}

export function formatFraction(f: Fraction): string {
	const r = reduce(f)
	if (r.denominator === 1) return String(r.numerator)
	const wholePart = Math.trunc(r.numerator / r.denominator)
	const remainder = Math.abs(r.numerator % r.denominator)
	if (wholePart !== 0 && remainder !== 0) {
		return `${wholePart} ${remainder}/${r.denominator}`
	}
	return `${r.numerator}/${r.denominator}`
}

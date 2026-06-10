import { describe, expect, it } from "vitest"
import {
	addFractions,
	formatFraction,
	fractionToNumber,
	multiplyFractions,
	numberToFraction,
	parseFraction,
	reduce,
	subtractFractions
} from "../scaling.js"

describe("parseFraction", () => {
	it("parses whole numbers", () => {
		expect(parseFraction("3")).toEqual({ numerator: 3, denominator: 1 })
	})

	it("parses simple fractions", () => {
		expect(parseFraction("3/4")).toEqual({ numerator: 3, denominator: 4 })
	})

	it("parses mixed numbers", () => {
		expect(parseFraction("1 3/4")).toEqual({ numerator: 7, denominator: 4 })
	})

	it("parses mixed number with large whole part", () => {
		expect(parseFraction("2 1/2")).toEqual({ numerator: 5, denominator: 2 })
	})

	it("trims surrounding whitespace", () => {
		expect(parseFraction("  2/3  ")).toEqual({ numerator: 2, denominator: 3 })
	})

	it("throws on zero denominator in simple fraction", () => {
		expect(() => parseFraction("1/0")).toThrow()
	})

	it("throws on zero denominator in mixed number", () => {
		expect(() => parseFraction("1 1/0")).toThrow()
	})

	it("throws on unrecognised format", () => {
		expect(() => parseFraction("one and a half")).toThrow()
	})
})

describe("reduce", () => {
	it("reduces a fraction to lowest terms", () => {
		expect(reduce({ numerator: 4, denominator: 8 })).toEqual({ numerator: 1, denominator: 2 })
	})

	it("returns 0/1 for zero numerator", () => {
		expect(reduce({ numerator: 0, denominator: 7 })).toEqual({ numerator: 0, denominator: 1 })
	})

	it("keeps already-reduced fractions unchanged", () => {
		expect(reduce({ numerator: 3, denominator: 4 })).toEqual({ numerator: 3, denominator: 4 })
	})
})

describe("addFractions", () => {
	it("adds two proper fractions with different denominators", () => {
		// 1/4 + 1/2 = 3/4
		expect(addFractions({ numerator: 1, denominator: 4 }, { numerator: 1, denominator: 2 }))
			.toEqual({ numerator: 3, denominator: 4 })
	})

	it("adds to produce a whole number", () => {
		// 1/2 + 1/2 = 1
		expect(addFractions({ numerator: 1, denominator: 2 }, { numerator: 1, denominator: 2 }))
			.toEqual({ numerator: 1, denominator: 1 })
	})

	it("adds a whole number and a fraction", () => {
		// 1 + 1/4 = 5/4
		expect(addFractions({ numerator: 1, denominator: 1 }, { numerator: 1, denominator: 4 }))
			.toEqual({ numerator: 5, denominator: 4 })
	})
})

describe("subtractFractions", () => {
	it("subtracts fractions with different denominators", () => {
		// 3/4 - 1/4 = 1/2
		expect(subtractFractions({ numerator: 3, denominator: 4 }, { numerator: 1, denominator: 4 }))
			.toEqual({ numerator: 1, denominator: 2 })
	})

	it("produces zero when equal fractions are subtracted", () => {
		expect(subtractFractions({ numerator: 2, denominator: 3 }, { numerator: 2, denominator: 3 }))
			.toEqual({ numerator: 0, denominator: 1 })
	})
})

describe("multiplyFractions", () => {
	it("multiplies two fractions and reduces", () => {
		// 2/3 * 3/4 = 6/12 = 1/2
		expect(multiplyFractions({ numerator: 2, denominator: 3 }, { numerator: 3, denominator: 4 }))
			.toEqual({ numerator: 1, denominator: 2 })
	})

	it("multiplies by a whole number", () => {
		// 1/4 * 4 = 1
		expect(multiplyFractions({ numerator: 1, denominator: 4 }, { numerator: 4, denominator: 1 }))
			.toEqual({ numerator: 1, denominator: 1 })
	})
})

describe("numberToFraction", () => {
	it("converts an integer", () => {
		expect(numberToFraction(3)).toEqual({ numerator: 3, denominator: 1 })
	})

	it("converts 0.5 to 1/2", () => {
		expect(numberToFraction(0.5)).toEqual({ numerator: 1, denominator: 2 })
	})

	it("converts 0.75 to 3/4", () => {
		expect(numberToFraction(0.75)).toEqual({ numerator: 3, denominator: 4 })
	})

	it("converts 1.5 to 3/2", () => {
		expect(numberToFraction(1.5)).toEqual({ numerator: 3, denominator: 2 })
	})
})

describe("formatFraction", () => {
	it("formats a whole number without denominator", () => {
		expect(formatFraction({ numerator: 3, denominator: 1 })).toBe("3")
	})

	it("formats a proper fraction", () => {
		expect(formatFraction({ numerator: 3, denominator: 4 })).toBe("3/4")
	})

	it("formats an improper fraction as a mixed number", () => {
		expect(formatFraction({ numerator: 7, denominator: 4 })).toBe("1 3/4")
	})

	it("round-trips parse then format for common measurements", () => {
		for (const s of ["1/4", "1/2", "3/4", "1 1/2", "2", "2 1/3"]) {
			expect(formatFraction(parseFraction(s))).toBe(s)
		}
	})

	it("converts fractionToNumber correctly", () => {
		expect(fractionToNumber({ numerator: 3, denominator: 4 })).toBeCloseTo(0.75)
		expect(fractionToNumber({ numerator: 7, denominator: 2 })).toBeCloseTo(3.5)
	})
})

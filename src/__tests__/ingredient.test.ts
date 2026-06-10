import { describe, expect, it } from "vitest"
import {
	convertTo,
	isVolumeUnit,
	isWeightUnit,
	scaleRecipeIngredient,
	toGrams,
	toGramsForNutrition,
	toMl
} from "../ingredient.js"
import type { Ingredient, RecipeIngredient } from "../types.js"

const mockEgg: Ingredient = {
	id: "egg",
	name: "Egg",
	isEgg: true,
	aisle: "eggs",
	nutritionPer100g: { calories: 143, protein: 13, fat: 10, carbs: 1, fiber: 0, sodium: 140 },
	gramsPerUnit: { whole: 50 }
}

const mockButter: Ingredient = {
	id: "butter",
	name: "Butter",
	isEgg: false,
	aisle: "dairy",
	nutritionPer100g: { calories: 717, protein: 0.9, fat: 81, carbs: 0.1, fiber: 0, sodium: 643 },
	gramsPerUnit: { tbsp: 14, cup: 227 }
}

describe("isVolumeUnit", () => {
	it("returns true for tsp", () => expect(isVolumeUnit("tsp")).toBe(true))
	it("returns true for tbsp", () => expect(isVolumeUnit("tbsp")).toBe(true))
	it("returns true for cup", () => expect(isVolumeUnit("cup")).toBe(true))
	it("returns true for ml", () => expect(isVolumeUnit("ml")).toBe(true))
	it("returns false for g", () => expect(isVolumeUnit("g")).toBe(false))
	it("returns false for whole", () => expect(isVolumeUnit("whole")).toBe(false))
})

describe("isWeightUnit", () => {
	it("returns true for g", () => expect(isWeightUnit("g")).toBe(true))
	it("returns true for oz", () => expect(isWeightUnit("oz")).toBe(true))
	it("returns false for cup", () => expect(isWeightUnit("cup")).toBe(false))
})

describe("toMl", () => {
	it("converts 1 tsp to ~4.93 ml", () => {
		expect(toMl(1, "tsp")).toBeCloseTo(4.929, 2)
	})

	it("converts 1 tbsp to ~14.79 ml", () => {
		expect(toMl(1, "tbsp")).toBeCloseTo(14.787, 2)
	})

	it("converts 1 cup to ~236.59 ml", () => {
		expect(toMl(1, "cup")).toBeCloseTo(236.588, 2)
	})

	it("1 ml stays 1 ml", () => {
		expect(toMl(1, "ml")).toBe(1)
	})

	it("throws for non-volume units", () => {
		expect(() => toMl(1, "g")).toThrow()
	})
})

describe("toGrams", () => {
	it("converts 1 oz to ~28.35 g", () => {
		expect(toGrams(1, "oz")).toBeCloseTo(28.35, 1)
	})

	it("converts 1 lb to ~453.59 g", () => {
		expect(toGrams(1, "lb")).toBeCloseTo(453.59, 1)
	})

	it("1 g stays 1 g", () => {
		expect(toGrams(1, "g")).toBe(1)
	})

	it("throws for non-weight units", () => {
		expect(() => toGrams(1, "cup")).toThrow()
	})
})

describe("convertTo", () => {
	it("returns same quantity when units are identical", () => {
		expect(convertTo(2, "cup", "cup")).toBe(2)
	})

	it("converts tbsp to cup", () => {
		// 16 tbsp = 1 cup
		expect(convertTo(16, "tbsp", "cup")).toBeCloseTo(1, 5)
	})

	it("converts cup to tsp", () => {
		// 1 cup = 48 tsp
		expect(convertTo(1, "cup", "tsp")).toBeCloseTo(48, 0)
	})

	it("converts oz to g", () => {
		expect(convertTo(1, "oz", "g")).toBeCloseTo(28.35, 1)
	})

	it("throws when mixing volume and weight", () => {
		expect(() => convertTo(1, "cup", "g")).toThrow()
	})
})

describe("scaleRecipeIngredient", () => {
	const ri: RecipeIngredient = { ingredient: mockEgg, quantity: 2, unit: "whole" }

	it("doubles the quantity at 2x", () => {
		expect(scaleRecipeIngredient(ri, 2).quantity).toBe(4)
	})

	it("halves the quantity at 0.5x", () => {
		expect(scaleRecipeIngredient(ri, 0.5).quantity).toBe(1)
	})

	it("preserves the ingredient and unit", () => {
		const scaled = scaleRecipeIngredient(ri, 3)
		expect(scaled.ingredient).toBe(ri.ingredient)
		expect(scaled.unit).toBe("whole")
	})
})

describe("toGramsForNutrition", () => {
	it("resolves weight units directly", () => {
		expect(toGramsForNutrition(100, "g", mockEgg)).toBe(100)
	})

	it("uses gramsPerUnit table for whole eggs", () => {
		// 2 whole eggs × 50g = 100g
		expect(toGramsForNutrition(2, "whole", mockEgg)).toBe(100)
	})

	it("uses gramsPerUnit for tbsp of butter", () => {
		expect(toGramsForNutrition(1, "tbsp", mockButter)).toBe(14)
	})

	it("throws for unmapped non-volume units", () => {
		expect(() => toGramsForNutrition(1, "pinch", mockEgg)).toThrow()
	})
})

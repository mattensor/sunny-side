import { describe, expect, it } from "vitest"
import { caloriesFromMacros, calculateNutrition } from "../nutrition.js"
import type { Ingredient, RecipeIngredient } from "../types.js"

const egg: Ingredient = {
	id: "egg",
	name: "Egg",
	isEgg: true,
	aisle: "eggs",
	nutritionPer100g: { calories: 143, protein: 13, fat: 10, carbs: 1, fiber: 0, sodium: 140 },
	gramsPerUnit: { whole: 50 }
}

const butter: Ingredient = {
	id: "butter",
	name: "Butter",
	isEgg: false,
	aisle: "dairy",
	nutritionPer100g: { calories: 717, protein: 0.9, fat: 81, carbs: 0.1, fiber: 0, sodium: 643 },
	gramsPerUnit: { tbsp: 14 }
}

const spinach: Ingredient = {
	id: "spinach",
	name: "Spinach",
	isEgg: false,
	aisle: "produce",
	nutritionPer100g: { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sodium: 79 },
	gramsPerUnit: {}
}

describe("caloriesFromMacros", () => {
	it("uses 4 kcal/g for protein", () => {
		expect(caloriesFromMacros(10, 0, 0)).toBe(40)
	})

	it("uses 9 kcal/g for fat", () => {
		expect(caloriesFromMacros(0, 10, 0)).toBe(90)
	})

	it("uses 4 kcal/g for carbs", () => {
		expect(caloriesFromMacros(0, 0, 10)).toBe(40)
	})

	it("sums all three macros", () => {
		expect(caloriesFromMacros(10, 10, 10)).toBe(4 * 10 + 9 * 10 + 4 * 10)
	})

	it("returns 0 for all zeros", () => {
		expect(caloriesFromMacros(0, 0, 0)).toBe(0)
	})
})

describe("calculateNutrition", () => {
	const twoEggs: RecipeIngredient = { ingredient: egg, quantity: 2, unit: "whole" }
	const oneTbspButter: RecipeIngredient = { ingredient: butter, quantity: 1, unit: "tbsp" }

	it("throws when servings is zero", () => {
		expect(() => calculateNutrition([twoEggs], 0)).toThrow()
	})

	it("throws when servings is negative", () => {
		expect(() => calculateNutrition([twoEggs], -1)).toThrow()
	})

	it("returns zero facts for an empty ingredient list", () => {
		const facts = calculateNutrition([], 1)
		expect(facts.calories).toBe(0)
		expect(facts.protein).toBe(0)
	})

	it("calculates calories for 2 eggs in 1 serving", () => {
		// 2 eggs × 50g = 100g, 100g egg = 143 kcal
		const facts = calculateNutrition([twoEggs], 1)
		expect(facts.calories).toBe(143)
	})

	it("divides by serving count", () => {
		// same 2 eggs but split across 2 servings → 71.5 kcal/serving
		const facts = calculateNutrition([twoEggs], 2)
		expect(facts.calories).toBe(71.5)
	})

	it("sums calories across multiple ingredients", () => {
		// 2 eggs (143 kcal) + 1 tbsp butter (14g → 100.4 kcal)
		const facts = calculateNutrition([twoEggs, oneTbspButter], 1)
		const expectedCal = 143 + (14 / 100) * 717
		expect(facts.calories).toBeCloseTo(expectedCal, 0)
	})

	it("calculates all macro fields", () => {
		const facts = calculateNutrition([twoEggs], 1)
		expect(facts.protein).toBeGreaterThan(0)
		expect(facts.fat).toBeGreaterThan(0)
		expect(facts.sodium).toBeGreaterThan(0)
	})

	it("rounds to default 1 decimal place", () => {
		const facts = calculateNutrition([twoEggs, oneTbspButter], 1)
		const decimalPlaces = (facts.calories.toString().split(".")[1] ?? "").length
		expect(decimalPlaces).toBeLessThanOrEqual(1)
	})

	it("respects custom precision", () => {
		const facts = calculateNutrition([twoEggs], 1, 2)
		const decimalPlaces = (facts.calories.toString().split(".")[1] ?? "").length
		expect(decimalPlaces).toBeLessThanOrEqual(2)
	})

	it("handles gram-based quantities directly", () => {
		const ri: RecipeIngredient = { ingredient: spinach, quantity: 200, unit: "g" }
		const facts = calculateNutrition([ri], 1)
		// 200g spinach = 2× nutrition per 100g
		expect(facts.calories).toBeCloseTo(46, 0)
	})

	it("includes fiber in the facts", () => {
		const ri: RecipeIngredient = { ingredient: spinach, quantity: 100, unit: "g" }
		const facts = calculateNutrition([ri], 1)
		expect(facts.fiber).toBeCloseTo(2.2, 1)
	})
})

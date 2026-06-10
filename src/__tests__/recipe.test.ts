import { describe, expect, it } from "vitest"
import { createRecipe, getRecipeNutrition, scaleRecipe, totalTime } from "../recipe.js"
import type { CreateRecipeOptions } from "../recipe.js"
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

const nonEggIngredient: Ingredient = {
	id: "toast",
	name: "Toast",
	isEgg: false,
	aisle: "bakery",
	nutritionPer100g: { calories: 300, protein: 10, fat: 4, carbs: 55, fiber: 3, sodium: 400 },
	gramsPerUnit: { slice: 30 }
}

const baseOptions: CreateRecipeOptions = {
	id: "scrambled",
	name: "Scrambled Eggs",
	description: "Classic fluffy scrambled eggs.",
	style: "scrambled",
	tags: ["quick", "classic"],
	ingredients: [
		{ ingredient: egg, quantity: 2, unit: "whole" },
		{ ingredient: butter, quantity: 1, unit: "tbsp" }
	],
	prepTimeMinutes: 2,
	cookTimeMinutes: 5,
	servings: 1,
	difficulty: "easy"
}

describe("createRecipe", () => {
	it("creates a valid egg recipe", () => {
		const recipe = createRecipe(baseOptions)
		expect(recipe.name).toBe("Scrambled Eggs")
		expect(recipe.servings).toBe(1)
	})

	it("throws when servings is zero", () => {
		expect(() => createRecipe({ ...baseOptions, servings: 0 })).toThrow("Servings")
	})

	it("throws when servings is negative", () => {
		expect(() => createRecipe({ ...baseOptions, servings: -1 })).toThrow()
	})

	it("throws when prep time is negative", () => {
		expect(() => createRecipe({ ...baseOptions, prepTimeMinutes: -1 })).toThrow("Prep")
	})

	it("throws when cook time is negative", () => {
		expect(() => createRecipe({ ...baseOptions, cookTimeMinutes: -1 })).toThrow("Cook")
	})

	it("throws when ingredient list is empty", () => {
		expect(() => createRecipe({ ...baseOptions, ingredients: [] })).toThrow("ingredient")
	})

	it("throws when no egg ingredient is present", () => {
		const noEgg: RecipeIngredient[] = [{ ingredient: nonEggIngredient, quantity: 2, unit: "slice" }]
		expect(() => createRecipe({ ...baseOptions, ingredients: noEgg })).toThrow("egg")
	})

	it("accepts a recipe with zero cook time", () => {
		const recipe = createRecipe({ ...baseOptions, cookTimeMinutes: 0 })
		expect(recipe.cookTimeMinutes).toBe(0)
	})

	it("accepts all valid difficulty values", () => {
		for (const difficulty of ["easy", "medium", "hard"] as const) {
			expect(() => createRecipe({ ...baseOptions, difficulty })).not.toThrow()
		}
	})
})

describe("totalTime", () => {
	it("sums prep and cook time", () => {
		const recipe = createRecipe(baseOptions)
		expect(totalTime(recipe)).toBe(7)
	})

	it("returns prep time when cook time is zero", () => {
		const recipe = createRecipe({ ...baseOptions, cookTimeMinutes: 0 })
		expect(totalTime(recipe)).toBe(2)
	})
})

describe("scaleRecipe", () => {
	it("scales ingredient quantities proportionally", () => {
		const recipe = createRecipe(baseOptions)
		const scaled = scaleRecipe(recipe, 4)
		const eggRi = scaled.ingredients.find(ri => ri.ingredient.id === "egg")
		expect(eggRi?.quantity).toBe(8)
	})

	it("updates serving count on the returned recipe", () => {
		const recipe = createRecipe(baseOptions)
		const scaled = scaleRecipe(recipe, 3)
		expect(scaled.servings).toBe(3)
	})

	it("scales down to half servings", () => {
		const twoServing = createRecipe({ ...baseOptions, servings: 2 })
		const scaled = scaleRecipe(twoServing, 1)
		const eggRi = scaled.ingredients.find(ri => ri.ingredient.id === "egg")
		expect(eggRi?.quantity).toBe(1)
	})

	it("throws when target servings is zero", () => {
		const recipe = createRecipe(baseOptions)
		expect(() => scaleRecipe(recipe, 0)).toThrow()
	})

	it("preserves ingredient names after scaling", () => {
		const recipe = createRecipe(baseOptions)
		const scaled = scaleRecipe(recipe, 2)
		expect(scaled.ingredients[0]?.ingredient.name).toBe("Egg")
	})
})

describe("getRecipeNutrition", () => {
	it("returns nutrition facts for the recipe", () => {
		const recipe = createRecipe(baseOptions)
		const facts = getRecipeNutrition(recipe)
		expect(facts.calories).toBeGreaterThan(0)
		expect(facts.protein).toBeGreaterThan(0)
	})

	it("per-serving calories stay the same after scaling", () => {
		const recipe = createRecipe(baseOptions)
		const scaled = scaleRecipe(recipe, 4)
		const original = getRecipeNutrition(recipe)
		const scaledFacts = getRecipeNutrition(scaled)
		expect(scaledFacts.calories).toBeCloseTo(original.calories, 0)
	})
})

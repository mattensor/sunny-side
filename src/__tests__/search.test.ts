import { describe, expect, it } from "vitest"
import { recipes } from "../catalog.js"
import { search } from "../search.js"

describe("search — full-text query", () => {
	it("finds a recipe by exact title match", () => {
		const results = search(recipes, { query: "Shakshuka" })
		expect(results[0]?.id).toBe("shakshuka")
	})

	it("finds a recipe by partial title match", () => {
		const results = search(recipes, { query: "scrambled" })
		expect(results.some(r => r.id === "scrambled")).toBe(true)
	})

	it("is case-insensitive", () => {
		const results = search(recipes, { query: "FRITTATA" })
		expect(results.length).toBeGreaterThan(0)
	})

	it("finds recipes by tag", () => {
		const results = search(recipes, { query: "brunch" })
		expect(results.length).toBeGreaterThan(0)
		expect(results.every(r => r.tags.includes("brunch"))).toBe(true)
	})

	it("finds recipes by description keyword", () => {
		const results = search(recipes, { query: "hollandaise" })
		expect(results.some(r => r.id === "eggs-benedict")).toBe(true)
	})

	it("returns empty array when nothing matches", () => {
		expect(search(recipes, { query: "spaghetti bolognese" })).toHaveLength(0)
	})
})

describe("search — filters", () => {
	it("filters by maxTotalTimeMinutes", () => {
		const results = search(recipes, { maxTotalTimeMinutes: 10 })
		expect(results.length).toBeGreaterThan(0)
		expect(results.every(r => r.prepTimeMinutes + r.cookTimeMinutes <= 10)).toBe(true)
	})

	it("returns all recipes when maxTotalTimeMinutes is very large", () => {
		const results = search(recipes, { maxTotalTimeMinutes: 9999 })
		expect(results).toHaveLength(recipes.length)
	})

	it("filters by maxCaloriesPerServing", () => {
		const results = search(recipes, { maxCaloriesPerServing: 250 })
		expect(results.length).toBeGreaterThan(0)
		for (const r of results) {
			const nutrition = r.ingredients.reduce((sum, ri) => {
				const g = ri.ingredient.gramsPerUnit[ri.unit] !== undefined
					? ri.quantity * ri.ingredient.gramsPerUnit[ri.unit]!
					: 0
				return sum + (ri.ingredient.nutritionPer100g.calories * g) / 100
			}, 0)
			expect(nutrition / r.servings).toBeLessThanOrEqual(300)
		}
	})

	it("returns all recipes when no filters are provided", () => {
		const results = search(recipes, {})
		expect(results).toHaveLength(recipes.length)
	})
})

describe("search — AND composition of filters", () => {
	it("applies query and time filter together", () => {
		const results = search(recipes, { query: "eggs", maxTotalTimeMinutes: 15 })
		expect(results.every(r => r.prepTimeMinutes + r.cookTimeMinutes <= 15)).toBe(true)
	})

	it("returns empty when filters are contradictory", () => {
		const results = search(recipes, { maxTotalTimeMinutes: 0 })
		expect(results).toHaveLength(0)
	})
})

describe("search — result ranking", () => {
	it("ranks exact title match above partial match", () => {
		// "Scrambled Eggs" should rank above "Smoked Salmon Scrambled Eggs"
		const results = search(recipes, { query: "Scrambled Eggs" })
		expect(results[0]?.id).toBe("scrambled")
	})

	it("returns a stable order when scores are equal", () => {
		const run1 = search(recipes, { query: "classic" })
		const run2 = search(recipes, { query: "classic" })
		expect(run1.map(r => r.id)).toEqual(run2.map(r => r.id))
	})
})

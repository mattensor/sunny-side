import { describe, expect, it } from "vitest"
import { recipes } from "../catalog.js"
import {
	addRating,
	averageRating,
	bayesianRating,
	createRatingStore,
	leaderboard
} from "../rating.js"

describe("addRating — validation", () => {
	it("accepts the minimum score of 1", () => {
		const store = createRatingStore()
		expect(() => addRating(store, "egg-1", 1)).not.toThrow()
	})

	it("accepts the maximum score of 5", () => {
		const store = createRatingStore()
		expect(() => addRating(store, "egg-1", 5)).not.toThrow()
	})

	it("rejects a score below 1", () => {
		const store = createRatingStore()
		expect(() => addRating(store, "egg-1", 0)).toThrow()
	})

	it("rejects a score above 5", () => {
		const store = createRatingStore()
		expect(() => addRating(store, "egg-1", 6)).toThrow()
	})

	it("rejects a non-integer score", () => {
		const store = createRatingStore()
		expect(() => addRating(store, "egg-1", 3.5)).toThrow()
	})
})

describe("averageRating", () => {
	it("returns the score when there is only one rating", () => {
		const store = createRatingStore()
		addRating(store, "scrambled", 4)
		expect(averageRating(store, "scrambled")).toBe(4)
	})

	it("returns the correct mean for multiple ratings", () => {
		const store = createRatingStore()
		addRating(store, "scrambled", 4)
		addRating(store, "scrambled", 2)
		expect(averageRating(store, "scrambled")).toBe(3)
	})

	it("rounds the average to one decimal place", () => {
		const store = createRatingStore()
		addRating(store, "sunny-side-up", 4)
		addRating(store, "sunny-side-up", 4)
		addRating(store, "sunny-side-up", 5)
		// mean = 13/3 = 4.333... → rounds to 4.3
		expect(averageRating(store, "sunny-side-up")).toBe(4.3)
	})

	it("throws when no ratings exist", () => {
		const store = createRatingStore()
		expect(() => averageRating(store, "nonexistent")).toThrow()
	})
})

describe("bayesianRating", () => {
	it("returns the prior mean when no ratings exist", () => {
		const store = createRatingStore()
		expect(bayesianRating(store, "poached", { priorMean: 3.0, priorWeight: 5 })).toBe(3)
	})

	it("pulls a low-count high average toward the prior", () => {
		const store = createRatingStore()
		addRating(store, "quiche-lorraine", 5)
		// 1 rating of 5 with prior 3 weight 5 → (3*5 + 5) / (5 + 1) = 20/6 ≈ 3.3
		const rating = bayesianRating(store, "quiche-lorraine", { priorMean: 3, priorWeight: 5 })
		expect(rating).toBeLessThan(5)
		expect(rating).toBeGreaterThan(3)
	})

	it("converges toward true mean with many ratings", () => {
		const store = createRatingStore()
		for (let i = 0; i < 100; i++) addRating(store, "scrambled", 5)
		const rating = bayesianRating(store, "scrambled", { priorMean: 3, priorWeight: 5 })
		expect(rating).toBeGreaterThan(4.8)
	})

	it("uses configurable prior weight", () => {
		const store = createRatingStore()
		addRating(store, "scrambled", 5)
		const lowWeight = bayesianRating(store, "scrambled", { priorMean: 3, priorWeight: 1 })
		const highWeight = bayesianRating(store, "scrambled", { priorMean: 3, priorWeight: 100 })
		expect(lowWeight).toBeGreaterThan(highWeight)
	})
})

describe("leaderboard", () => {
	it("ranks a well-rated recipe above a poorly-rated one", () => {
		const store = createRatingStore()
		for (let i = 0; i < 20; i++) addRating(store, "french-omelet", 5)
		for (let i = 0; i < 20; i++) addRating(store, "over-hard", 1)

		const subset = recipes.filter(r => ["french-omelet", "over-hard"].includes(r.id))
		const board = leaderboard(store, subset)
		expect(board[0]?.recipeId).toBe("french-omelet")
	})

	it("breaks ties by total rating count (more ratings wins)", () => {
		const store = createRatingStore()
		// Both get average 4 but scrambled has more ratings
		for (let i = 0; i < 20; i++) addRating(store, "scrambled", 4)
		addRating(store, "sunny-side-up", 4)

		const subset = recipes.filter(r => ["scrambled", "sunny-side-up"].includes(r.id))
		const board = leaderboard(store, subset, { priorWeight: 0 })
		expect(board[0]?.recipeId).toBe("scrambled")
	})

	it("includes all recipes even those with no ratings", () => {
		const store = createRatingStore()
		addRating(store, "scrambled", 5)
		const board = leaderboard(store, recipes)
		expect(board).toHaveLength(recipes.length)
	})
})

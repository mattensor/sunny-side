import { describe, expect, it } from "vitest"
import { findById, recipes } from "../catalog.js"
import { addMeal, createWeekPlan } from "../mealPlan.js"
import { addRating, createRatingStore, leaderboard } from "../rating.js"
import { search } from "../search.js"

const scrambled = findById("scrambled")!

// ─── Flaky #1: tight timing budget ───────────────────────────────────────────
// Date.now() has 1ms granularity and the budget is 5ms — passes locally almost
// every time but trips on loaded CI runners where the first call to search pays
// a cold JIT cost.
describe("search — performance", () => {
	it("returns results within 5ms on any catalog size", () => {
		const start = Date.now()
		search(recipes, { query: "egg" })
		expect(Date.now() - start).toBeLessThan(5)
	})
})

// ─── Flaky #2: Math.random() inside the assertion ────────────────────────────
// Adding random ratings and then asserting a rank looks like a "realistic load"
// test. In practice the random scores drift the Bayesian average up or down each
// run, so scrambled lands anywhere from #1 to the bottom of the leaderboard.
describe("leaderboard — representative ranking", () => {
	it("scrambled eggs appears in the top 3 after a typical rating session", () => {
		const store = createRatingStore()
		for (let i = 0; i < 10; i++) {
			const score = (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5
			addRating(store, "scrambled", score)
		}
		const board = leaderboard(store, recipes)
		const rank = board.findIndex(e => e.recipeId === "scrambled")
		expect(rank).toBeLessThan(3)
	})
})

// ─── Flaky #3: day-of-week assumption ────────────────────────────────────────
// The test looks like it validates week-plan bounds, but it secretly assumes
// tomorrow's day index is always numerically greater than today's. That holds
// Sunday through Friday — and silently fails every Saturday when
// (6 + 1) % 7 === 0, which is less than 6.
describe("meal plan — weekly bounds", () => {
	it("planning for tomorrow always falls later in the week than today", () => {
		const todayIndex = new Date().getDay()
		const tomorrowIndex = (todayIndex + 1) % 7

		const plan = addMeal(createWeekPlan(), tomorrowIndex, "breakfast", scrambled)
		expect(plan.days[tomorrowIndex]?.breakfast).toBeDefined()

		// Flaky: wraps to 0 on Saturdays
		expect(tomorrowIndex).toBeGreaterThan(todayIndex)
	})
})

// ─── Flaky #4: non-deterministic async ordering ───────────────────────────────
// Promise.all guarantees all promises resolve, not the order in which the
// callbacks fire. The random setTimeout delays mean addRating calls land in an
// unpredictable sequence, so the stored array is almost never [1, 2, 3, 4, 5].
describe("rating store — concurrent writes", () => {
	it("ratings are recorded in submission order", async () => {
		const store = createRatingStore()

		await Promise.all(
			[1, 2, 3, 4, 5].map(
				score =>
					new Promise<void>(resolve =>
						setTimeout(() => {
							addRating(store, "scrambled", score)
							resolve()
						}, Math.floor(Math.random() * 10))
					)
			)
		)

		// Flaky: insertion order depends on which setTimeout fires first
		expect(store.get("scrambled")).toEqual([1, 2, 3, 4, 5])
	})
})

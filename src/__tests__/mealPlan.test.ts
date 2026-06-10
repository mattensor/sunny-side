import { describe, expect, it } from "vitest"
import { findById, recipes } from "../catalog.js"
import {
	addMeal,
	analyzeCalories,
	createWeekPlan,
	findIngredientOverlap,
	flattenSchedule,
	removeMeal
} from "../mealPlan.js"

const scrambled = findById("scrambled")!
const frittata = findById("spinach-feta-frittata")!
const shakshuka = findById("shakshuka")!

describe("addMeal", () => {
	it("adds a recipe to a specific day and slot", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		expect(plan.days[0]?.breakfast?.id).toBe("scrambled")
	})

	it("overwrites an existing meal in the same slot", () => {
		let plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		plan = addMeal(plan, 0, "breakfast", shakshuka)
		expect(plan.days[0]?.breakfast?.id).toBe("shakshuka")
	})

	it("does not affect other slots on the same day", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		expect(plan.days[0]?.lunch).toBeUndefined()
		expect(plan.days[0]?.dinner).toBeUndefined()
	})

	it("throws for day index below 0", () => {
		expect(() => addMeal(createWeekPlan(), -1, "breakfast", scrambled)).toThrow()
	})

	it("throws for day index above 6", () => {
		expect(() => addMeal(createWeekPlan(), 7, "breakfast", scrambled)).toThrow()
	})
})

describe("removeMeal", () => {
	it("removes a previously added meal", () => {
		let plan = addMeal(createWeekPlan(), 2, "lunch", scrambled)
		plan = removeMeal(plan, 2, "lunch")
		expect(plan.days[2]?.lunch).toBeUndefined()
	})

	it("is a no-op when the slot is already empty", () => {
		const plan = createWeekPlan()
		expect(() => removeMeal(plan, 0, "dinner")).not.toThrow()
	})
})

describe("flattenSchedule", () => {
	it("returns entries in day-then-slot order", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled)
		plan = addMeal(plan, 0, "lunch", shakshuka)
		const entries = flattenSchedule(plan)
		expect(entries[0]?.slot).toBe("breakfast")
		expect(entries[1]?.slot).toBe("lunch")
	})

	it("excludes empty slots", () => {
		const plan = addMeal(createWeekPlan(), 3, "dinner", frittata)
		const entries = flattenSchedule(plan)
		expect(entries).toHaveLength(1)
		expect(entries[0]?.slot).toBe("dinner")
	})

	it("returns an empty array for a blank week plan", () => {
		expect(flattenSchedule(createWeekPlan())).toHaveLength(0)
	})
})

describe("analyzeCalories", () => {
	it("marks an empty day as low", () => {
		const analysis = analyzeCalories(createWeekPlan())
		expect(analysis[0]?.status).toBe("low")
	})

	it("marks a day within range as ok", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled)
		plan = addMeal(plan, 0, "lunch", shakshuka)
		plan = addMeal(plan, 0, "dinner", frittata)
		const analysis = analyzeCalories(plan, 300, 9999)
		expect(analysis[0]?.status).toBe("ok")
	})

	it("marks a day over the max as high", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled)
		plan = addMeal(plan, 0, "lunch", shakshuka)
		plan = addMeal(plan, 0, "dinner", frittata)
		const analysis = analyzeCalories(plan, 0, 1)
		expect(analysis[0]?.status).toBe("high")
	})

	it("returns an analysis entry for each of the 7 days", () => {
		const analysis = analyzeCalories(createWeekPlan())
		expect(analysis).toHaveLength(7)
	})
})

describe("findIngredientOverlap", () => {
	it("detects an ingredient shared between two days", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled) // uses egg
		plan = addMeal(plan, 1, "breakfast", shakshuka) // also uses egg
		const overlap = findIngredientOverlap(plan)
		expect(overlap.has("egg")).toBe(true)
	})

	it("returns an empty map when no ingredients overlap across days", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		const overlap = findIngredientOverlap(plan)
		// All ingredients only appear on day 0 — no cross-day overlap
		expect(overlap.size).toBe(0)
	})

	it("records the correct day indices for an overlapping ingredient", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled)
		plan = addMeal(plan, 3, "dinner", shakshuka)
		const overlap = findIngredientOverlap(plan)
		expect(overlap.get("egg")).toEqual(expect.arrayContaining([0, 3]))
	})
})

import { describe, expect, it } from "vitest"
import { findById, recipes } from "../catalog.js"
import { formatMealPlanTable, formatRecipeCard, formatShoppingList } from "../formatter.js"
import { addMeal, createWeekPlan } from "../mealPlan.js"

const scrambled = findById("scrambled")!
const benedict = findById("eggs-benedict")!
const frittata = findById("spinach-feta-frittata")!

describe("formatRecipeCard", () => {
	it("starts with the recipe name on the first line", () => {
		const card = formatRecipeCard(scrambled)
		expect(card.split("\n")[0]).toBe("Scrambled Eggs")
	})

	it("includes the total time", () => {
		const card = formatRecipeCard(scrambled)
		expect(card).toContain("Total: 8min")
	})

	it("lists all ingredients", () => {
		const card = formatRecipeCard(scrambled)
		expect(card).toContain("Egg")
		expect(card).toContain("Butter")
		expect(card).toContain("Whole Milk")
	})

	it("includes the nutrition section", () => {
		const card = formatRecipeCard(scrambled)
		expect(card).toContain("Nutrition per serving:")
		expect(card).toContain("Calories:")
		expect(card).toContain("Protein:")
	})

	it("truncates descriptions longer than 80 characters with ellipsis", () => {
		const longDesc = "A".repeat(100)
		const recipe = { ...scrambled, description: longDesc }
		const card = formatRecipeCard(recipe)
		const descLine = card.split("\n")[3]!
		expect(descLine.length).toBeLessThanOrEqual(80)
		expect(descLine.endsWith("...")).toBe(true)
	})

	it("does not truncate short descriptions", () => {
		const card = formatRecipeCard(scrambled)
		expect(card).toContain(scrambled.description)
	})

	it("shows the difficulty", () => {
		const card = formatRecipeCard(scrambled)
		expect(card).toContain("Easy")
	})

	it("shows the serving count", () => {
		const card = formatRecipeCard(frittata)
		expect(card).toContain("Serves: 4")
	})
})

describe("formatShoppingList", () => {
	it("starts with 'Shopping List'", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		const output = formatShoppingList(plan)
		expect(output.split("\n")[0]).toBe("Shopping List")
	})

	it("groups items under aisle headers in brackets", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		const output = formatShoppingList(plan)
		expect(output).toContain("[Eggs]")
		expect(output).toContain("[Dairy]")
	})

	it("formats each item as '  - <quantity> <unit> <name>'", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled)
		const output = formatShoppingList(plan)
		expect(output).toMatch(/  - \d+ .+/)
	})

	it("returns an empty shopping list header for a blank plan", () => {
		const output = formatShoppingList(createWeekPlan())
		expect(output).toContain("Shopping List")
	})
})

describe("formatMealPlanTable", () => {
	it("includes the 'Weekly Egg Menu' heading", () => {
		const output = formatMealPlanTable(createWeekPlan())
		expect(output).toContain("Weekly Egg Menu")
	})

	it("includes all day abbreviations", () => {
		const output = formatMealPlanTable(createWeekPlan())
		for (const day of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
			expect(output).toContain(day)
		}
	})

	it("includes all three meal slot names", () => {
		const output = formatMealPlanTable(createWeekPlan())
		expect(output).toContain("breakfast")
		expect(output).toContain("lunch")
		expect(output).toContain("dinner")
	})

	it("shows '—' for empty meal slots", () => {
		const output = formatMealPlanTable(createWeekPlan())
		expect(output).toContain("—")
	})

	it("shows the recipe name in the correct day cell", () => {
		const plan = addMeal(createWeekPlan(), 0, "breakfast", scrambled) // Mon
		const output = formatMealPlanTable(plan)
		expect(output).toContain("Scrambled")
	})

	it("truncates long recipe names with an ellipsis", () => {
		const longName = "A".repeat(20)
		const recipe = { ...scrambled, name: longName }
		const plan = addMeal(createWeekPlan(), 0, "breakfast", recipe)
		const output = formatMealPlanTable(plan)
		expect(output).toContain("…")
	})

	it("produces the same output on repeated calls (deterministic)", () => {
		let plan = createWeekPlan()
		plan = addMeal(plan, 0, "breakfast", scrambled)
		plan = addMeal(plan, 3, "lunch", benedict)
		plan = addMeal(plan, 6, "dinner", frittata)
		const run1 = formatMealPlanTable(plan)
		const run2 = formatMealPlanTable(plan)
		expect(run1).toBe(run2)
	})
})

import type { Recipe, WeekPlan } from "./types.js"
import { getRecipeNutrition, totalTime } from "./recipe.js"
import { formatFraction, numberToFraction } from "./scaling.js"
import { flattenSchedule } from "./mealPlan.js"
import { generateShoppingList, groupByAisle, sortedAisles } from "./shoppingList.js"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const DIFFICULTY_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" }

function formatQuantity(quantity: number, unit: string): string {
	const frac = formatFraction(numberToFraction(quantity))
	return unit === "whole" ? frac : `${frac} ${unit}`
}

export function formatRecipeCard(recipe: Recipe): string {
	const nutrition = getRecipeNutrition(recipe)
	const lines: string[] = []

	lines.push(recipe.name)
	lines.push("=".repeat(recipe.name.length))
	lines.push("")

	const desc =
		recipe.description.length > 80
			? `${recipe.description.slice(0, 77)}...`
			: recipe.description
	lines.push(desc)
	lines.push("")

	lines.push(
		`Style: ${recipe.style}  |  Difficulty: ${DIFFICULTY_LABEL[recipe.difficulty]}  |  Serves: ${recipe.servings}`
	)
	lines.push(
		`Prep: ${recipe.prepTimeMinutes}min  |  Cook: ${recipe.cookTimeMinutes}min  |  Total: ${totalTime(recipe)}min`
	)
	lines.push("")

	lines.push("Ingredients:")
	for (const ri of recipe.ingredients) {
		lines.push(`  - ${formatQuantity(ri.quantity, ri.unit)} ${ri.ingredient.name}`)
	}
	lines.push("")

	lines.push("Nutrition per serving:")
	lines.push(`  Calories: ${nutrition.calories} kcal`)
	lines.push(`  Protein:  ${nutrition.protein}g`)
	lines.push(`  Fat:      ${nutrition.fat}g`)
	lines.push(`  Carbs:    ${nutrition.carbs}g`)
	lines.push(`  Fiber:    ${nutrition.fiber}g`)
	lines.push(`  Sodium:   ${nutrition.sodium}mg`)

	return lines.join("\n")
}

export function formatShoppingList(plan: WeekPlan): string {
	const items = generateShoppingList(plan)
	const groups = groupByAisle(items)
	const aisles = sortedAisles(groups)
	const lines: string[] = []

	lines.push("Shopping List")
	lines.push("=============")

	for (const aisle of aisles) {
		const aisleItems = groups.get(aisle)!
		lines.push("")
		lines.push(`[${aisle.charAt(0).toUpperCase() + aisle.slice(1)}]`)
		for (const item of aisleItems) {
			lines.push(`  - ${formatQuantity(item.quantity, item.unit)} ${item.ingredient.name}`)
		}
	}

	return lines.join("\n")
}

export function formatMealPlanTable(plan: WeekPlan): string {
	const schedule = flattenSchedule(plan)
	const lookup = new Map<number, Map<string, string>>()
	for (const entry of schedule) {
		if (!lookup.has(entry.dayIndex)) lookup.set(entry.dayIndex, new Map())
		lookup.get(entry.dayIndex)!.set(entry.slot, entry.recipe.name)
	}

	const lines: string[] = []
	lines.push("Weekly Egg Menu")
	lines.push("")
	lines.push(`${"Slot".padEnd(12)}${DAYS.map(d => d.padEnd(14)).join("")}`)
	lines.push("-".repeat(12 + 14 * 7))

	for (const slot of ["breakfast", "lunch", "dinner"] as const) {
		const row = DAYS.map((_, i) => {
			const name = lookup.get(i)?.get(slot) ?? "—"
			return name.length > 12 ? `${name.slice(0, 11)}…` : name
		})
		lines.push(`${slot.padEnd(12)}${row.map(n => n.padEnd(14)).join("")}`)
	}

	return lines.join("\n")
}

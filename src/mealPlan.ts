import type { DayPlan, MealSlot, Recipe, WeekPlan } from "./types.js"
import { getRecipeNutrition } from "./recipe.js"

export function createWeekPlan(): WeekPlan {
	return { days: [{}, {}, {}, {}, {}, {}, {}] }
}

export function addMeal(plan: WeekPlan, dayIndex: number, slot: MealSlot, recipe: Recipe): WeekPlan {
	if (dayIndex < 0 || dayIndex > 6) throw new Error(`Day index must be 0–6, got ${dayIndex}`)
	const days = [...plan.days] as WeekPlan["days"]
	days[dayIndex] = { ...days[dayIndex], [slot]: recipe }
	return { days }
}

export function removeMeal(plan: WeekPlan, dayIndex: number, slot: MealSlot): WeekPlan {
	if (dayIndex < 0 || dayIndex > 6) throw new Error(`Day index must be 0–6, got ${dayIndex}`)
	const days = [...plan.days] as WeekPlan["days"]
	const day = { ...days[dayIndex] } as DayPlan
	delete day[slot]
	days[dayIndex] = day
	return { days }
}

export type ScheduleEntry = { dayIndex: number; slot: MealSlot; recipe: Recipe }

const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"]

export function flattenSchedule(plan: WeekPlan): ScheduleEntry[] {
	const entries: ScheduleEntry[] = []
	for (let i = 0; i < 7; i++) {
		const day = plan.days[i]!
		for (const slot of SLOTS) {
			const recipe = day[slot]
			if (recipe !== undefined) entries.push({ dayIndex: i, slot, recipe })
		}
	}
	return entries
}

export type CalorieAnalysis = {
	dayIndex: number
	caloriesPerDay: number
	status: "ok" | "low" | "high"
}

export function analyzeCalories(
	plan: WeekPlan,
	minCalories = 1200,
	maxCalories = 2500
): CalorieAnalysis[] {
	return plan.days.map((day, index) => {
		let total = 0
		for (const slot of SLOTS) {
			const recipe = day[slot]
			if (recipe !== undefined) {
				total += getRecipeNutrition(recipe).calories * recipe.servings
			}
		}
		const rounded = Math.round(total)
		return {
			dayIndex: index,
			caloriesPerDay: rounded,
			status: total === 0 ? "low" : total < minCalories ? "low" : total > maxCalories ? "high" : "ok"
		}
	})
}

export function findIngredientOverlap(plan: WeekPlan): Map<string, number[]> {
	const seen = new Map<string, number[]>()

	for (let i = 0; i < 7; i++) {
		const day = plan.days[i]!
		for (const slot of SLOTS) {
			const recipe = day[slot]
			if (recipe === undefined) continue
			for (const ri of recipe.ingredients) {
				const id = ri.ingredient.id
				const days = seen.get(id) ?? []
				if (!days.includes(i)) seen.set(id, [...days, i])
			}
		}
	}

	// Remove ingredients that appear on only one day
	for (const [id, days] of seen) {
		if (days.length <= 1) seen.delete(id)
	}

	return seen
}

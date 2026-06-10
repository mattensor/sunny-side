import type { NutritionFacts, RecipeIngredient } from "./types.js"
import { toGramsForNutrition } from "./ingredient.js"

export function calculateNutrition(
	ingredients: RecipeIngredient[],
	servings: number,
	precision = 1
): NutritionFacts {
	if (servings <= 0) throw new Error("Servings must be greater than 0")

	let totalCalories = 0
	let totalProtein = 0
	let totalFat = 0
	let totalCarbs = 0
	let totalFiber = 0
	let totalSodium = 0

	for (const ri of ingredients) {
		const grams = toGramsForNutrition(ri.quantity, ri.unit, ri.ingredient)
		const ratio = grams / 100

		totalCalories += ri.ingredient.nutritionPer100g.calories * ratio
		totalProtein += ri.ingredient.nutritionPer100g.protein * ratio
		totalFat += ri.ingredient.nutritionPer100g.fat * ratio
		totalCarbs += ri.ingredient.nutritionPer100g.carbs * ratio
		totalFiber += ri.ingredient.nutritionPer100g.fiber * ratio
		totalSodium += ri.ingredient.nutritionPer100g.sodium * ratio
	}

	const factor = 10 ** precision

	return {
		calories: Math.round((totalCalories / servings) * factor) / factor,
		protein: Math.round((totalProtein / servings) * factor) / factor,
		fat: Math.round((totalFat / servings) * factor) / factor,
		carbs: Math.round((totalCarbs / servings) * factor) / factor,
		fiber: Math.round((totalFiber / servings) * factor) / factor,
		sodium: Math.round((totalSodium / servings) * factor) / factor
	}
}

export function caloriesFromMacros(protein: number, fat: number, carbs: number): number {
	return protein * 4 + fat * 9 + carbs * 4
}

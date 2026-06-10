import type { Recipe } from "./types.js"
import { getRecipeNutrition, totalTime } from "./recipe.js"

export type SearchFilters = {
	query?: string
	maxTotalTimeMinutes?: number
	maxCaloriesPerServing?: number
}

type ScoredResult = { recipe: Recipe; score: number }

function scoreMatch(recipe: Recipe, query: string): number {
	const q = query.toLowerCase()
	const name = recipe.name.toLowerCase()
	const desc = recipe.description.toLowerCase()
	const tags = recipe.tags.join(" ").toLowerCase()

	if (name === q) return 3
	if (name.includes(q)) return 2
	if (desc.includes(q) || tags.includes(q)) return 1
	return 0
}

export function search(recipes: Recipe[], filters: SearchFilters): Recipe[] {
	let results: ScoredResult[] = recipes.map(recipe => ({ recipe, score: 0 }))

	if (filters.query !== undefined && filters.query.length > 0) {
		results = results
			.map(r => ({ ...r, score: scoreMatch(r.recipe, filters.query!) }))
			.filter(r => r.score > 0)
	}

	if (filters.maxTotalTimeMinutes !== undefined) {
		const max = filters.maxTotalTimeMinutes
		results = results.filter(r => totalTime(r.recipe) <= max)
	}

	if (filters.maxCaloriesPerServing !== undefined) {
		const max = filters.maxCaloriesPerServing
		results = results.filter(r => getRecipeNutrition(r.recipe).calories <= max)
	}

	results.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score
		return a.recipe.name.localeCompare(b.recipe.name)
	})

	return results.map(r => r.recipe)
}

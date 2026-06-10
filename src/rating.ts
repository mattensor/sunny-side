import type { Recipe } from "./types.js"

export type RatingStore = Map<string, number[]>

export function createRatingStore(): RatingStore {
	return new Map()
}

export function addRating(store: RatingStore, recipeId: string, score: number): void {
	if (!Number.isInteger(score) || score < 1 || score > 5) {
		throw new Error(`Rating must be an integer from 1 to 5, got ${score}`)
	}
	const existing = store.get(recipeId) ?? []
	store.set(recipeId, [...existing, score])
}

export function averageRating(store: RatingStore, recipeId: string): number {
	const ratings = store.get(recipeId)
	if (!ratings || ratings.length === 0) {
		throw new Error(`No ratings found for recipe "${recipeId}"`)
	}
	const sum = ratings.reduce((acc, r) => acc + r, 0)
	return Math.round((sum / ratings.length) * 10) / 10
}

export type BayesianOptions = {
	priorMean?: number
	priorWeight?: number
}

export function bayesianRating(
	store: RatingStore,
	recipeId: string,
	options: BayesianOptions = {}
): number {
	const { priorMean = 3.0, priorWeight = 5 } = options
	const ratings = store.get(recipeId) ?? []
	const n = ratings.length
	const sum = ratings.reduce((acc, r) => acc + r, 0)
	const weighted = (priorMean * priorWeight + sum) / (priorWeight + n)
	return Math.round(weighted * 10) / 10
}

export type LeaderboardEntry = {
	recipeId: string
	recipeName: string
	bayesianAvg: number
	count: number
}

export function leaderboard(
	store: RatingStore,
	recipes: Recipe[],
	options: BayesianOptions = {}
): LeaderboardEntry[] {
	const entries: LeaderboardEntry[] = recipes.map(recipe => ({
		recipeId: recipe.id,
		recipeName: recipe.name,
		bayesianAvg: bayesianRating(store, recipe.id, options),
		count: store.get(recipe.id)?.length ?? 0
	}))

	return entries.sort((a, b) => {
		if (b.bayesianAvg !== a.bayesianAvg) return b.bayesianAvg - a.bayesianAvg
		return b.count - a.count
	})
}

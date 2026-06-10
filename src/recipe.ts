import type { Difficulty, EggStyle, NutritionFacts, Recipe, RecipeIngredient } from "./types.js"
import { scaleRecipeIngredient } from "./ingredient.js"
import { calculateNutrition } from "./nutrition.js"

const EGG_NAMES = new Set([
	"egg",
	"eggs",
	"egg white",
	"egg whites",
	"egg yolk",
	"egg yolks",
	"whole egg",
	"whole eggs"
])

function containsEgg(ingredients: RecipeIngredient[]): boolean {
	return ingredients.some(
		ri => ri.ingredient.isEgg || EGG_NAMES.has(ri.ingredient.name.toLowerCase())
	)
}

export type CreateRecipeOptions = {
	id: string
	name: string
	description: string
	style: EggStyle
	tags: string[]
	ingredients: RecipeIngredient[]
	prepTimeMinutes: number
	cookTimeMinutes: number
	servings: number
	difficulty: Difficulty
}

export function createRecipe(options: CreateRecipeOptions): Recipe {
	if (options.servings <= 0) throw new Error("Servings must be greater than 0")
	if (options.prepTimeMinutes < 0) throw new Error("Prep time cannot be negative")
	if (options.cookTimeMinutes < 0) throw new Error("Cook time cannot be negative")
	if (options.ingredients.length === 0) throw new Error("Recipe must have at least one ingredient")
	if (!containsEgg(options.ingredients)) {
		throw new Error("Sunny Side only allows egg recipes — no egg ingredient found")
	}
	return { ...options }
}

export function scaleRecipe(recipe: Recipe, targetServings: number): Recipe {
	if (targetServings <= 0) throw new Error("Target servings must be greater than 0")
	const multiplier = targetServings / recipe.servings
	return {
		...recipe,
		servings: targetServings,
		ingredients: recipe.ingredients.map(ri => scaleRecipeIngredient(ri, multiplier))
	}
}

export function totalTime(recipe: Recipe): number {
	return recipe.prepTimeMinutes + recipe.cookTimeMinutes
}

export function getRecipeNutrition(recipe: Recipe, precision = 1): NutritionFacts {
	return calculateNutrition(recipe.ingredients, recipe.servings, precision)
}

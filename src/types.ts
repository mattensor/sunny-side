export type Unit =
	| "whole"
	| "tsp"
	| "tbsp"
	| "cup"
	| "fl_oz"
	| "ml"
	| "g"
	| "oz"
	| "lb"
	| "pinch"
	| "slice"
	| "clove"
	| "rasher"
	| "strip"

export type Aisle = "eggs" | "dairy" | "produce" | "meat" | "pantry" | "bakery" | "condiments"

export type Difficulty = "easy" | "medium" | "hard"

export type EggStyle =
	| "sunny-side-up"
	| "over-easy"
	| "over-hard"
	| "scrambled"
	| "poached"
	| "soft-boiled"
	| "hard-boiled"
	| "omelet"
	| "frittata"
	| "quiche"
	| "eggs-benedict"
	| "baked"
	| "other"

export type NutritionPer100g = {
	calories: number
	protein: number
	fat: number
	carbs: number
	fiber: number
	sodium: number
}

export type Ingredient = {
	id: string
	name: string
	isEgg: boolean
	aisle: Aisle
	nutritionPer100g: NutritionPer100g
	gramsPerUnit: Partial<Record<Unit, number>>
}

export type RecipeIngredient = {
	ingredient: Ingredient
	quantity: number
	unit: Unit
}

export type Recipe = {
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

export type NutritionFacts = {
	calories: number
	protein: number
	fat: number
	carbs: number
	fiber: number
	sodium: number
}

export type MealSlot = "breakfast" | "lunch" | "dinner"

export type DayPlan = {
	breakfast?: Recipe
	lunch?: Recipe
	dinner?: Recipe
}

export type WeekPlan = {
	days: [DayPlan, DayPlan, DayPlan, DayPlan, DayPlan, DayPlan, DayPlan]
}

export type ShoppingItem = {
	ingredient: Ingredient
	quantity: number
	unit: Unit
}

export type RatingEntry = {
	recipeId: string
	score: number
}

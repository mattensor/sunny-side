import type { Ingredient, Recipe, RecipeIngredient } from "./types.js"

// ─── Ingredients ─────────────────────────────────────────────────────────────

export const ingredients = {
	egg: {
		id: "egg",
		name: "Egg",
		isEgg: true,
		aisle: "eggs",
		nutritionPer100g: { calories: 143, protein: 13, fat: 10, carbs: 1, fiber: 0, sodium: 140 },
		gramsPerUnit: { whole: 50 }
	},
	butter: {
		id: "butter",
		name: "Butter",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 717, protein: 0.9, fat: 81, carbs: 0.1, fiber: 0, sodium: 643 },
		gramsPerUnit: { tbsp: 14, cup: 227 }
	},
	milk: {
		id: "milk",
		name: "Whole Milk",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 61, protein: 3.2, fat: 3.3, carbs: 4.8, fiber: 0, sodium: 43 },
		gramsPerUnit: { cup: 244, tbsp: 15 }
	},
	heavyCream: {
		id: "heavy-cream",
		name: "Heavy Cream",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 340, protein: 2.1, fat: 36, carbs: 2.8, fiber: 0, sodium: 30 },
		gramsPerUnit: { tbsp: 15, cup: 238 }
	},
	cheddar: {
		id: "cheddar",
		name: "Cheddar Cheese",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 403, protein: 25, fat: 33, carbs: 1.3, fiber: 0, sodium: 621 },
		gramsPerUnit: { oz: 28 }
	},
	feta: {
		id: "feta",
		name: "Feta Cheese",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 264, protein: 14, fat: 21, carbs: 4, fiber: 0, sodium: 1116 },
		gramsPerUnit: { oz: 28 }
	},
	parmesan: {
		id: "parmesan",
		name: "Parmesan",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 431, protein: 38, fat: 29, carbs: 4, fiber: 0, sodium: 1529 },
		gramsPerUnit: { tbsp: 5 }
	},
	creamCheese: {
		id: "cream-cheese",
		name: "Cream Cheese",
		isEgg: false,
		aisle: "dairy",
		nutritionPer100g: { calories: 342, protein: 6, fat: 34, carbs: 4, fiber: 0, sodium: 321 },
		gramsPerUnit: { tbsp: 15, oz: 28 }
	},
	spinach: {
		id: "spinach",
		name: "Spinach",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sodium: 79 },
		gramsPerUnit: { cup: 30 }
	},
	tomato: {
		id: "tomato",
		name: "Tomato",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, sodium: 5 },
		gramsPerUnit: { whole: 120 }
	},
	mushroom: {
		id: "mushroom",
		name: "Mushroom",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 22, protein: 3.1, fat: 0.3, carbs: 3.3, fiber: 1, sodium: 5 },
		gramsPerUnit: { cup: 70, whole: 18 }
	},
	onion: {
		id: "onion",
		name: "Onion",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 40, protein: 1.1, fat: 0.1, carbs: 9.3, fiber: 1.7, sodium: 4 },
		gramsPerUnit: { whole: 150, cup: 160 }
	},
	bellPepper: {
		id: "bell-pepper",
		name: "Bell Pepper",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 31, protein: 1, fat: 0.3, carbs: 7.2, fiber: 2.1, sodium: 2 },
		gramsPerUnit: { whole: 150, cup: 149 }
	},
	chives: {
		id: "chives",
		name: "Chives",
		isEgg: false,
		aisle: "produce",
		nutritionPer100g: { calories: 30, protein: 3.3, fat: 0.7, carbs: 4.4, fiber: 2.5, sodium: 3 },
		gramsPerUnit: { tbsp: 3 }
	},
	salt: {
		id: "salt",
		name: "Salt",
		isEgg: false,
		aisle: "pantry",
		nutritionPer100g: { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sodium: 38758 },
		gramsPerUnit: { tsp: 6, pinch: 0.4 }
	},
	blackPepper: {
		id: "black-pepper",
		name: "Black Pepper",
		isEgg: false,
		aisle: "pantry",
		nutritionPer100g: { calories: 251, protein: 10, fat: 3.3, carbs: 64, fiber: 25, sodium: 20 },
		gramsPerUnit: { tsp: 2.3, pinch: 0.3 }
	},
	oliveOil: {
		id: "olive-oil",
		name: "Olive Oil",
		isEgg: false,
		aisle: "pantry",
		nutritionPer100g: { calories: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, sodium: 2 },
		gramsPerUnit: { tbsp: 13.5, tsp: 4.5 }
	},
	flour: {
		id: "flour",
		name: "Plain Flour",
		isEgg: false,
		aisle: "pantry",
		nutritionPer100g: { calories: 364, protein: 10, fat: 1, carbs: 76, fiber: 2.7, sodium: 2 },
		gramsPerUnit: { cup: 120, tbsp: 8 }
	},
	ham: {
		id: "ham",
		name: "Ham",
		isEgg: false,
		aisle: "meat",
		nutritionPer100g: { calories: 145, protein: 21, fat: 5, carbs: 1.5, fiber: 0, sodium: 1203 },
		gramsPerUnit: { oz: 28, slice: 28 }
	},
	bacon: {
		id: "bacon",
		name: "Bacon",
		isEgg: false,
		aisle: "meat",
		nutritionPer100g: { calories: 541, protein: 37, fat: 42, carbs: 1.4, fiber: 0, sodium: 1717 },
		gramsPerUnit: { rasher: 20, strip: 20 }
	},
	smokedSalmon: {
		id: "smoked-salmon",
		name: "Smoked Salmon",
		isEgg: false,
		aisle: "meat",
		nutritionPer100g: { calories: 117, protein: 18, fat: 4.3, carbs: 0, fiber: 0, sodium: 672 },
		gramsPerUnit: { oz: 28, slice: 30 }
	},
	englishMuffin: {
		id: "english-muffin",
		name: "English Muffin",
		isEgg: false,
		aisle: "bakery",
		nutritionPer100g: { calories: 227, protein: 8, fat: 1.7, carbs: 46, fiber: 2, sodium: 393 },
		gramsPerUnit: { whole: 57 }
	},
	hollandaise: {
		id: "hollandaise",
		name: "Hollandaise Sauce",
		isEgg: false,
		aisle: "condiments",
		nutritionPer100g: { calories: 470, protein: 3.5, fat: 50, carbs: 2, fiber: 0, sodium: 350 },
		gramsPerUnit: { tbsp: 15 }
	},
	hotSauce: {
		id: "hot-sauce",
		name: "Hot Sauce",
		isEgg: false,
		aisle: "condiments",
		nutritionPer100g: { calories: 11, protein: 0.5, fat: 0.1, carbs: 2.3, fiber: 0.4, sodium: 1500 },
		gramsPerUnit: { tsp: 5, tbsp: 15 }
	}
} satisfies Record<string, Ingredient>

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ri(ingredient: Ingredient, quantity: number, unit: RecipeIngredient["unit"]): RecipeIngredient {
	return { ingredient, quantity, unit }
}

// ─── Recipes ─────────────────────────────────────────────────────────────────

export const recipes: Recipe[] = [
	{
		id: "sunny-side-up",
		name: "Sunny Side Up",
		description: "Eggs fried gently until the whites are set but the yolk stays runny and glossy.",
		style: "sunny-side-up",
		tags: ["quick", "classic", "fried"],
		prepTimeMinutes: 1,
		cookTimeMinutes: 4,
		servings: 1,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 2, "whole"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "scrambled",
		name: "Scrambled Eggs",
		description: "Soft, creamy scrambled eggs cooked slowly over low heat.",
		style: "scrambled",
		tags: ["quick", "classic", "creamy"],
		prepTimeMinutes: 2,
		cookTimeMinutes: 6,
		servings: 1,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 3, "whole"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.milk, 2, "tbsp"),
			ri(ingredients.salt, 1, "pinch"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "over-easy",
		name: "Over Easy Eggs",
		description: "Fried eggs flipped briefly so the yolk stays soft but the white is fully set.",
		style: "over-easy",
		tags: ["quick", "fried"],
		prepTimeMinutes: 1,
		cookTimeMinutes: 4,
		servings: 1,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 2, "whole"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "over-hard",
		name: "Over Hard Eggs",
		description: "Fried eggs cooked through on both sides until the yolk is completely set.",
		style: "over-hard",
		tags: ["quick", "fried"],
		prepTimeMinutes: 1,
		cookTimeMinutes: 5,
		servings: 1,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 2, "whole"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "soft-boiled",
		name: "Soft Boiled Eggs",
		description: "Eggs boiled just long enough for firm whites and a jammy, flowing yolk.",
		style: "soft-boiled",
		tags: ["boiled", "classic"],
		prepTimeMinutes: 0,
		cookTimeMinutes: 7,
		servings: 1,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 2, "whole"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "hard-boiled",
		name: "Hard Boiled Eggs",
		description: "Fully cooked boiled eggs with a firm yolk, perfect for salads or snacking.",
		style: "hard-boiled",
		tags: ["boiled", "classic", "meal-prep"],
		prepTimeMinutes: 0,
		cookTimeMinutes: 12,
		servings: 2,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "poached",
		name: "Poached Eggs",
		description: "Delicate eggs slipped into barely simmering water for a silky, tender result.",
		style: "poached",
		tags: ["classic", "elegant"],
		prepTimeMinutes: 2,
		cookTimeMinutes: 4,
		servings: 1,
		difficulty: "medium",
		ingredients: [
			ri(ingredients.egg, 2, "whole"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "french-omelet",
		name: "French Omelette",
		description: "A pale, rolled omelette with a custardy interior and no browning — the French classic.",
		style: "omelet",
		tags: ["classic", "french", "elegant"],
		prepTimeMinutes: 3,
		cookTimeMinutes: 3,
		servings: 1,
		difficulty: "hard",
		ingredients: [
			ri(ingredients.egg, 3, "whole"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.chives, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "western-omelet",
		name: "Western Omelette",
		description: "A hearty filled omelette with ham, bell pepper, onion, and cheddar cheese.",
		style: "omelet",
		tags: ["filling", "american"],
		prepTimeMinutes: 5,
		cookTimeMinutes: 8,
		servings: 1,
		difficulty: "medium",
		ingredients: [
			ri(ingredients.egg, 3, "whole"),
			ri(ingredients.ham, 2, "oz"),
			ri(ingredients.bellPepper, 0.5, "whole"),
			ri(ingredients.onion, 0.25, "whole"),
			ri(ingredients.cheddar, 1, "oz"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "spinach-feta-frittata",
		name: "Spinach and Feta Frittata",
		description: "A baked Italian egg dish loaded with wilted spinach and tangy feta cheese.",
		style: "frittata",
		tags: ["baked", "vegetarian", "italian", "meal-prep"],
		prepTimeMinutes: 10,
		cookTimeMinutes: 20,
		servings: 4,
		difficulty: "medium",
		ingredients: [
			ri(ingredients.egg, 8, "whole"),
			ri(ingredients.spinach, 2, "cup"),
			ri(ingredients.feta, 3, "oz"),
			ri(ingredients.onion, 0.5, "whole"),
			ri(ingredients.oliveOil, 1, "tbsp"),
			ri(ingredients.salt, 0.5, "tsp"),
			ri(ingredients.blackPepper, 0.25, "tsp")
		]
	},
	{
		id: "mushroom-frittata",
		name: "Mushroom Frittata",
		description: "An earthy frittata with sautéed mushrooms, parmesan, and fresh herbs.",
		style: "frittata",
		tags: ["baked", "vegetarian", "italian"],
		prepTimeMinutes: 10,
		cookTimeMinutes: 25,
		servings: 4,
		difficulty: "medium",
		ingredients: [
			ri(ingredients.egg, 8, "whole"),
			ri(ingredients.mushroom, 2, "cup"),
			ri(ingredients.parmesan, 3, "tbsp"),
			ri(ingredients.onion, 0.5, "whole"),
			ri(ingredients.oliveOil, 1, "tbsp"),
			ri(ingredients.salt, 0.5, "tsp"),
			ri(ingredients.blackPepper, 0.25, "tsp")
		]
	},
	{
		id: "quiche-lorraine",
		name: "Quiche Lorraine",
		description: "A rich, creamy custard tart with bacon and gruyère in a flaky pastry shell.",
		style: "quiche",
		tags: ["baked", "french", "pastry"],
		prepTimeMinutes: 20,
		cookTimeMinutes: 40,
		servings: 6,
		difficulty: "hard",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.heavyCream, 1, "cup"),
			ri(ingredients.bacon, 6, "rasher"),
			ri(ingredients.cheddar, 3, "oz"),
			ri(ingredients.flour, 1, "cup"),
			ri(ingredients.butter, 4, "tbsp"),
			ri(ingredients.salt, 0.5, "tsp"),
			ri(ingredients.blackPepper, 0.25, "tsp")
		]
	},
	{
		id: "eggs-benedict",
		name: "Eggs Benedict",
		description: "Poached eggs and Canadian bacon on toasted English muffins, smothered in hollandaise.",
		style: "eggs-benedict",
		tags: ["brunch", "classic", "american"],
		prepTimeMinutes: 10,
		cookTimeMinutes: 15,
		servings: 2,
		difficulty: "hard",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.ham, 4, "oz"),
			ri(ingredients.englishMuffin, 2, "whole"),
			ri(ingredients.hollandaise, 4, "tbsp"),
			ri(ingredients.salt, 1, "pinch")
		]
	},
	{
		id: "baked-eggs-cream",
		name: "Baked Eggs with Cream",
		description: "Eggs baked in individual ramekins with cream and herbs — simple and luxurious.",
		style: "baked",
		tags: ["baked", "elegant", "french"],
		prepTimeMinutes: 5,
		cookTimeMinutes: 15,
		servings: 2,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.heavyCream, 4, "tbsp"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.chives, 1, "tbsp"),
			ri(ingredients.salt, 1, "pinch"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "smoked-salmon-scramble",
		name: "Smoked Salmon Scrambled Eggs",
		description: "Creamy scrambled eggs folded with smoked salmon and cream cheese.",
		style: "scrambled",
		tags: ["luxury", "brunch"],
		prepTimeMinutes: 3,
		cookTimeMinutes: 6,
		servings: 2,
		difficulty: "easy",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.smokedSalmon, 3, "oz"),
			ri(ingredients.creamCheese, 2, "tbsp"),
			ri(ingredients.chives, 1, "tbsp"),
			ri(ingredients.butter, 1, "tbsp"),
			ri(ingredients.blackPepper, 1, "pinch")
		]
	},
	{
		id: "shakshuka",
		name: "Shakshuka",
		description: "Eggs poached directly in a spiced tomato and pepper sauce — a Middle Eastern classic.",
		style: "other",
		tags: ["spicy", "middle-eastern", "vegetarian"],
		prepTimeMinutes: 10,
		cookTimeMinutes: 25,
		servings: 2,
		difficulty: "medium",
		ingredients: [
			ri(ingredients.egg, 4, "whole"),
			ri(ingredients.tomato, 4, "whole"),
			ri(ingredients.bellPepper, 1, "whole"),
			ri(ingredients.onion, 1, "whole"),
			ri(ingredients.oliveOil, 2, "tbsp"),
			ri(ingredients.hotSauce, 1, "tsp"),
			ri(ingredients.salt, 0.5, "tsp"),
			ri(ingredients.blackPepper, 0.25, "tsp")
		]
	}
]

export function findById(id: string): Recipe | undefined {
	return recipes.find(r => r.id === id)
}

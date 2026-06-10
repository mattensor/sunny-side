import type { Ingredient, RecipeIngredient, Unit } from "./types.js"

const VOLUME_TO_ML: Partial<Record<Unit, number>> = {
	tsp: 4.92892,
	tbsp: 14.7868,
	cup: 236.588,
	fl_oz: 29.5735,
	ml: 1
}

const WEIGHT_TO_G: Partial<Record<Unit, number>> = {
	g: 1,
	oz: 28.3495,
	lb: 453.592
}

export function isVolumeUnit(unit: Unit): boolean {
	return unit in VOLUME_TO_ML
}

export function isWeightUnit(unit: Unit): boolean {
	return unit in WEIGHT_TO_G
}

export function toMl(quantity: number, unit: Unit): number {
	const factor = VOLUME_TO_ML[unit]
	if (factor === undefined) throw new Error(`"${unit}" is not a volume unit`)
	return quantity * factor
}

export function toGrams(quantity: number, unit: Unit): number {
	const factor = WEIGHT_TO_G[unit]
	if (factor === undefined) throw new Error(`"${unit}" is not a weight unit`)
	return quantity * factor
}

export function convertTo(quantity: number, fromUnit: Unit, toUnit: Unit): number {
	if (fromUnit === toUnit) return quantity

	if (isVolumeUnit(fromUnit) && isVolumeUnit(toUnit)) {
		const ml = toMl(quantity, fromUnit)
		const targetFactor = VOLUME_TO_ML[toUnit]!
		return ml / targetFactor
	}

	if (isWeightUnit(fromUnit) && isWeightUnit(toUnit)) {
		const g = toGrams(quantity, fromUnit)
		const targetFactor = WEIGHT_TO_G[toUnit]!
		return g / targetFactor
	}

	throw new Error(`Cannot convert between "${fromUnit}" and "${toUnit}"`)
}

export function scaleRecipeIngredient(ri: RecipeIngredient, multiplier: number): RecipeIngredient {
	return { ...ri, quantity: ri.quantity * multiplier }
}

export function toGramsForNutrition(
	quantity: number,
	unit: Unit,
	ingredient: Ingredient
): number {
	if (isWeightUnit(unit)) return toGrams(quantity, unit)

	const gramsPerUnit = ingredient.gramsPerUnit[unit]
	if (gramsPerUnit !== undefined) return quantity * gramsPerUnit

	if (isVolumeUnit(unit)) {
		// Assume water density (1g/ml) as a fallback for liquids without explicit mapping
		return toMl(quantity, unit)
	}

	throw new Error(
		`Cannot determine grams for unit "${unit}" of ingredient "${ingredient.name}"`
	)
}

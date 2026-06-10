import type { Ingredient, MealSlot, ShoppingItem, Unit, WeekPlan } from "./types.js"
import { convertTo, isVolumeUnit, isWeightUnit } from "./ingredient.js"

type Accumulator = { ingredient: Ingredient; quantity: number; unit: Unit }

function canMerge(unitA: Unit, unitB: Unit): boolean {
	if (unitA === unitB) return true
	return (
		(isVolumeUnit(unitA) && isVolumeUnit(unitB)) ||
		(isWeightUnit(unitA) && isWeightUnit(unitB))
	)
}

function mergeInto(items: Accumulator[], incoming: Accumulator): void {
	const existing = items.find(
		m => m.ingredient.id === incoming.ingredient.id && canMerge(m.unit, incoming.unit)
	)

	if (existing === undefined) {
		items.push({ ...incoming })
		return
	}

	if (existing.unit === incoming.unit) {
		existing.quantity += incoming.quantity
	} else if (isVolumeUnit(existing.unit) && isVolumeUnit(incoming.unit)) {
		existing.quantity += convertTo(incoming.quantity, incoming.unit, existing.unit)
	} else if (isWeightUnit(existing.unit) && isWeightUnit(incoming.unit)) {
		existing.quantity += convertTo(incoming.quantity, incoming.unit, existing.unit)
	}
}

const SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"]

export function generateShoppingList(plan: WeekPlan): ShoppingItem[] {
	const acc: Accumulator[] = []

	for (const day of plan.days) {
		for (const slot of SLOTS) {
			const recipe = day[slot]
			if (recipe === undefined) continue
			for (const ri of recipe.ingredients) {
				mergeInto(acc, { ingredient: ri.ingredient, quantity: ri.quantity, unit: ri.unit })
			}
		}
	}

	return acc
}

const AISLE_ORDER = ["eggs", "dairy", "produce", "meat", "pantry", "bakery", "condiments"]

export function groupByAisle(items: ShoppingItem[]): Map<string, ShoppingItem[]> {
	const groups = new Map<string, ShoppingItem[]>()
	for (const item of items) {
		const aisle = item.ingredient.aisle
		const existing = groups.get(aisle) ?? []
		groups.set(aisle, [...existing, item])
	}
	return groups
}

export function sortedAisles(groups: Map<string, ShoppingItem[]>): string[] {
	return [...groups.keys()].sort((a, b) => {
		const ai = AISLE_ORDER.indexOf(a)
		const bi = AISLE_ORDER.indexOf(b)
		if (ai === -1 && bi === -1) return a.localeCompare(b)
		if (ai === -1) return 1
		if (bi === -1) return -1
		return ai - bi
	})
}

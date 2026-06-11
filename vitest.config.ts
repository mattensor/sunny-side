import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "node",
		include: ["src/**/*.test.ts"],
		slowTestThreshold: 200,
		reporters: ['default', 'json'],
		outputFile: 'tmp/vitest-results.json',

		// Enable column + line capture for Test Engine
  		includeTaskLocation: true,
	}
})
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Validates file paths in layout, index, and route function calls in the given routes file content.
 * @param routesContent The content of the routes file as a string.
 * @param baseFilePath The file path of the routes file (used to resolve relative paths).
 * @returns An array of error messages for missing files.
 */

export interface FilePathValidationResult {
	filePath: string;
	isValid: boolean;
	index: number; // character index in the file
}

export function validateRoutesFilePaths(
	routesContent: string,
	baseFilePath: string,
): FilePathValidationResult[] {
	const results: FilePathValidationResult[] = [];

	// Regular expressions to match layout, index, and route function calls

	// layout and index: first param is file path
	const layoutRegex = /layout\(\s*(["'](?:\\.|[^"'\\])*["'])\s*(?=[,)])/g;
	const indexRegex = /index\(\s*(["'](?:\\.|[^"'\\])*["'])\s*(?=[,)])/g;
	// route: second param is file path
	const routeRegex =
		/route\(\s*["'][^"']*["']\s*,\s*(["'](?:\\.|[^"'\\])*["'])\s*(?=[,)])/g;

	// Helper to process matches
	function processRegex(regex: RegExp) {
		let match: RegExpExecArray | null;

		// Reset regex state before using
		regex.lastIndex = 0;

		// Using a different loop structure to avoid assignment in expression
		match = regex.exec(routesContent);
		while (match !== null) {
			// Remove quotes from filePath and calculate correct start index
			let filePath = match[1];
			const startIndex = match.index + match[0].indexOf(match[1]) + 1; // Add 1 to skip the opening quote

			if (filePath.startsWith('"') || filePath.startsWith("'")) {
				filePath = filePath.slice(1, -1);
			}

			// Check if it's a valid file extension (.jsx or .tsx)
			const hasValidExtension =
				typeof filePath === "string" &&
				(filePath.endsWith(".jsx") || filePath.endsWith(".tsx"));

			// For any file path detected in a React Router function, add to results
			const fullPath = path.resolve(path.dirname(baseFilePath), filePath);

			// A path is valid only if it has the right extension AND exists
			const isValid = hasValidExtension && fs.existsSync(fullPath);

			// If invalid due to wrong extension, add a specific validation result
			results.push({
				filePath,
				isValid,
				index: startIndex,
			});

			// Get next match
			match = regex.exec(routesContent);
		}
	}

	processRegex(layoutRegex);
	processRegex(indexRegex);
	processRegex(routeRegex);
	return results;
}

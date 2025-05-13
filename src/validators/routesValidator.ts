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
	const layoutRegex = /layout\(\s*(["'][^"']+["'])\s*,/g;
	const indexRegex = /index\(\s*(["'][^"']+["'])\s*,/g;
	// route: second param is file path
	const routeRegex = /route\(\s*[^,]+,\s*(["'][^"']+["'])/g;

	// Helper to process matches
	function processRegex(regex: RegExp) {
		let match: RegExpExecArray | null;
		match = regex.exec(routesContent);
		while (match !== null) {
			// Remove quotes from filePath
			let filePath = match[1];
			if (filePath.startsWith('"') || filePath.startsWith("'")) {
				filePath = filePath.slice(1, -1);
			}
			const startIndex = match.index + match[0].indexOf(match[1]);
			const isFile =
				typeof filePath === "string" &&
				(filePath.endsWith(".jsx") || filePath.endsWith(".tsx"));
			let isValid = true;
			if (isFile) {
				const fullPath = path.resolve(path.dirname(baseFilePath), filePath);
				isValid = fs.existsSync(fullPath);
				results.push({ filePath, isValid, index: startIndex });
				match = regex.exec(routesContent);
			}
		}
	}
	processRegex(layoutRegex);
	processRegex(indexRegex);
	processRegex(routeRegex);
	return results;
}

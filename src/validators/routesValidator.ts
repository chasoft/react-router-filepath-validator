import * as fs from "node:fs";
import * as path from "node:path";

export function validateRoutesFilePaths(routesFilePath: string): string[] {
	const errors: string[] = [];

	let routesContent: string;
	try {
		routesContent = fs.readFileSync(routesFilePath, "utf-8");
	} catch (err) {
		errors.push(`Could not read routes file: ${routesFilePath}`);
		return errors;
	}

	// Regular expressions to match layout, index, and route function calls
	const layoutRegex = /layout\("([^"]+)"\s*,/g;
	const indexRegex = /index\("([^"]+)"\s*,/g;
	const routeRegex = /route\("([^"]+)"\s*,/g;

	const filePaths: string[] = [];

	// Process layout routes
	for (
		let match = layoutRegex.exec(routesContent);
		match !== null;
		match = layoutRegex.exec(routesContent)
	) {
		filePaths.push(match[1]);
	}

	// Process index routes
	for (
		let match = indexRegex.exec(routesContent);
		match !== null;
		match = indexRegex.exec(routesContent)
	) {
		filePaths.push(match[1]);
	}

	// Process regular routes
	for (
		let match = routeRegex.exec(routesContent);
		match !== null;
		match = routeRegex.exec(routesContent)
	) {
		filePaths.push(match[1]);
	}

	// Validate each file path
	for (const filePath of filePaths) {
		const fullPath = path.resolve(path.dirname(routesFilePath), filePath);
		if (!fs.existsSync(fullPath)) {
			errors.push(`File path does not exist: ${fullPath}`);
		}
	}

	return errors;
}

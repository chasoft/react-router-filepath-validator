import * as vscode from "vscode";
import { validateRoutesFilePaths } from "./validators/routesValidator";

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		"reactrouter-filepath-validator.validatePaths",
		async () => {
			const editor = vscode.window.activeTextEditor;

			if (editor) {
				const document = editor.document;
				const filePath = document.fileName;

				if (filePath.endsWith("routes.ts")) {
					const validationResults = await validateRoutesFilePaths(
						document.getText(),
					);

					if (validationResults.length > 0) {
						vscode.window.showWarningMessage(
							`File path validation issues found: ${validationResults.join(", ")}`,
						);
					} else {
						vscode.window.showInformationMessage("All file paths are valid.");
					}
				} else {
					vscode.window.showErrorMessage(
						"Please open a routes.ts file to validate.",
					);
				}
			}
		},
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}

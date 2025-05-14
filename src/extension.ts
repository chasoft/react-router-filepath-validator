import * as vscode from "vscode";
import { validateRoutesFilePaths } from "./validators/routesValidator";
import type { FilePathValidationResult } from "./validators/routesValidator";

export function activate(context: vscode.ExtensionContext) {
	// Create a diagnostic collection for file path errors
	const diagnosticCollection = vscode.languages.createDiagnosticCollection(
		"reactrouter-filepath-validator",
	);
	context.subscriptions.push(diagnosticCollection);

	// Helper to validate and set diagnostics for a document
	function validateAndSetDiagnostics(
		document: vscode.TextDocument,
		isManualValidation = false,
	) {
		// For automatic validation, only process routes.ts/js files
		if (
			!isManualValidation &&
			!document.fileName.endsWith("routes.ts") &&
			!document.fileName.endsWith("routes.js")
		) {
			diagnosticCollection.delete(document.uri);
			return null;
		}
		const results: FilePathValidationResult[] = validateRoutesFilePaths(
			document.getText(),
			document.fileName,
		);
		const diagnostics: vscode.Diagnostic[] = [];
		for (const result of results) {
			if (!result.isValid) {
				// Find the range for the invalid file path string
				const start = document.positionAt(result.index);
				const end = document.positionAt(result.index + result.filePath.length);
				diagnostics.push(
					new vscode.Diagnostic(
						new vscode.Range(start, end),
						`File does not exist: ${result.filePath}`,
						vscode.DiagnosticSeverity.Error,
					),
				);
			}
		}
		diagnosticCollection.set(document.uri, diagnostics);
		return results;
	}

	// Validate when a routes.ts file is opened
	context.subscriptions.push(
		vscode.workspace.onDidOpenTextDocument((doc) => {
			validateAndSetDiagnostics(doc);
		}),
	);

	// Validate when a routes.ts file is changed
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((e) => {
			validateAndSetDiagnostics(e.document);
		}),
	);

	// Validate already opened routes.ts files on activation
	for (const doc of vscode.workspace.textDocuments) {
		validateAndSetDiagnostics(doc);
	}

	// Remove diagnostics when a document is closed
	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument((doc) => {
			diagnosticCollection.delete(doc.uri);
		}),
	);

	// Keep the command for manual validation, with success message only when all paths are valid
	const disposable = vscode.commands.registerCommand(
		"reactrouter-filepath-validator.validatePaths",
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				// Simply validate the current file (no filename restrictions for manual validation)
				const results = validateRoutesFilePaths(
					editor.document.getText(),
					editor.document.fileName,
				);
				validateAndSetDiagnostics(editor.document, true);

				// Only show success message if everything is valid
				const hasInvalidPaths = results.some((result) => !result.isValid);
				if (results.length > 0) {
					if (!hasInvalidPaths) {
						vscode.window.showInformationMessage("All file paths are valid.");
					}
				} else {
					vscode.window.showInformationMessage(
						"No React Router file paths found to validate.",
					);
				}
			}
		},
	);
	context.subscriptions.push(disposable);
}

export function deactivate() {}

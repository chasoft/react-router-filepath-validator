"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoutesFilePaths = void 0;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
function validateRoutesFilePaths(routesFilePath) {
    const errors = [];
    let routesContent;
    try {
        routesContent = fs.readFileSync(routesFilePath, "utf-8");
    }
    catch (err) {
        errors.push(`Could not read routes file: ${routesFilePath}`);
        return errors;
    }
    // Regular expressions to match layout, index, and route function calls
    const layoutRegex = /layout\("([^"]+)"\s*,/g;
    const indexRegex = /index\("([^"]+)"\s*,/g;
    const routeRegex = /route\("([^"]+)"\s*,/g;
    const filePaths = [];
    // Process layout routes
    for (let match = layoutRegex.exec(routesContent); match !== null; match = layoutRegex.exec(routesContent)) {
        filePaths.push(match[1]);
    }
    // Process index routes
    for (let match = indexRegex.exec(routesContent); match !== null; match = indexRegex.exec(routesContent)) {
        filePaths.push(match[1]);
    }
    // Process regular routes
    for (let match = routeRegex.exec(routesContent); match !== null; match = routeRegex.exec(routesContent)) {
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
exports.validateRoutesFilePaths = validateRoutesFilePaths;

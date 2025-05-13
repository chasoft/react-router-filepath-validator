# React Router File Path Validator

This extension validates file paths for the layout, index, and route functions in the `routes.ts` file for a React Router version 7 application.

## Features

- Validates file paths specified in the `routes.ts` file.
- Ensures that paths for layout, index, and route functions are correct and exist in the project.
- Provides feedback in the VS Code output panel.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/chasoft/react-router-filepath-validator
   ```

2. Navigate to the project directory:
   ```
   cd react-router-filepath-validator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Open the project in Visual Studio Code.

5. Press `F5` to run the extension in a new Extension Development Host window.

## How to build

- npm run compile
- vsce package

## Usage

- Open a `routes.ts` file in your project.
- The extension will automatically validate the file paths when the file is saved.
- Check the output panel for validation results.

## Contributing

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push to your branch and create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
# React Router File Path Validator

This extension validates file paths for the layout, index, and route functions in the `routes.ts` file for a React Router version 7 application.

## Features

- Auto validates file paths specified in the `routes.ts/js` file.
- Ensures that paths for layout, index, and route functions are correct and exist in the project.
- Invalid filepaths will be underlined in red.
- "Ctrl + Click" on valid file path to open that file.
- For other files other than `routes.ts/js`, you need to run the command `Validate React Router File Paths` manually.

## What's New in Version 1.1.2

- Fixed issue where file paths ending with `.tsx` (like "route.tsx") were incorrectly detected.
- Improved regex patterns for all React Router function types.
- Supports only `.jsx` and `.tsx` files.

## Note

- Support React Router version 7.x and above only!

## License

This project is licensed under the MIT License. See the LICENSE file for details.
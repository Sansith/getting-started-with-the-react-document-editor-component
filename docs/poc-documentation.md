# Syncfusion Document Editor POC

## 1. Approach
- Built as a client-side React application to experiment with Syncfusion's DocumentEditor in a browser context.
- Split functionality into two focused components: `editor` for authoring templates and `renderer` for injecting customer data.
- Leveraged `DocumentEditorContainerComponent` with the built-in `Toolbar` service to surface editing commands without managing low-level editor state manually.

## 2. Editor
- Presents scalar placeholders as quick-action buttons; list placeholders expand to show child fields, guiding template authors on available merge fields.
- Uses `documentEditor.editor.insertField` to drop merge-field syntax into the document, and `documentEditor.editor.insertTable` to scaffold dynamic tables while positioning the cursor via selection helpers.
- Demonstrates `documentEditor.search.findAll` and `documentEditor.search.searchResults.replaceAll` for replacing sample text, and `documentEditor.editor.toggleStrikethrough` for formatting tweaks.

## 3. Renderer
- Loads `.sfdt` and `.docx` files directly into the `DocumentEditorContainerComponent`, allowing quick iteration on exported templates.
- For scalar placeholders, applies `documentEditor.search.findAll` with subsequent `searchResults.replaceAll` to inject values from the mock `CUSTOMER_DATA` object.
- For list placeholders, iterates rows by combining table navigation helpers (`selection.getTable`, `selection.handleDownKey`) with `documentEditor.editor.insertRow` and `documentEditor.editor.insertText` to populate each account entry.
- Ensures the search state is cleared before each replacement cycle using `documentEditor.search.searchResults.clear`, keeping list rendering deterministic.
    
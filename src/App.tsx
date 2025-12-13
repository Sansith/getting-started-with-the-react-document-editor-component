import React from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
  TableCellWidget,
} from "@syncfusion/ej2-react-documenteditor";
import "./App.css";

function App() {
  let editorObj: DocumentEditorContainerComponent | null;
  const onSave = () => {
    editorObj?.documentEditor.save("Sample", "Docx");
    editorObj?.documentEditor.editor.insertTable();
  };
  let toolItem = {
    prefixIcon: "e-save icon",
    tooltipText: "Save the Document",
    text: "Add Dynamic Value",
    id: "save",
  };

  const handleAddField = () => {
    let fieldCode: string = "MERGEFIELD  First Name  \\* MERGEFORMAT ";
    let fieldResult: string = "«First Name»";
    editorObj?.documentEditor.editor.insertField(fieldCode, fieldResult);
  };

  const replaceValues = () => {
    editorObj?.documentEditor.search.findAll("«First Name»", "None");
    editorObj?.documentEditor.search.searchResults.replaceAll(
      "Seniya Dissanayake"
    );
  };
  const renderDynamicTable = async () => {
    if (!editorObj) return;
    const editor = editorObj.documentEditor;
    const search = editor.search;

    editor.editor.insertTable(5, 2);
    const tableData = [{ name: "John Doe", age: 30 },{ name: "Jane Smith", age: 25,city:"New York" },{ name: "Alice Johnson", age: 30 }];
    // Step 4: Populate headers (row 0)
    const headers = Object.keys(tableData[0]);
    headers.forEach((header, colIndex) => {
      editor.editor.insertText(header);
      moveCursorToNextCell();
      // populateTableCell(targetTable, 0, colIndex, header);
    });
    moveCursorToNextRow();

    // Step 5: Populate data rows
    tableData.forEach((row, rowIndex) => {
      Object.values(row).forEach((value, colIndex) => {
        editor.editor.insertText(String(value));
        moveCursorToNextCell();
      });
      moveCursorToNextRow()
    });
  };
  const moveCursorToNextCell = () => {
    // To get current selection start offset
    if (!editorObj) return;
    debugger;
    let startOffset = editorObj.documentEditor.selection.startOffset;
    // Increasing cell index to consider next cell
    var startOffsetArray = startOffset.split(";");
    startOffsetArray[3] = String(parseInt(startOffsetArray[3]) + 1);
    // Changing start offset
    startOffset = startOffsetArray.join(";");
    // Navigating selection using select method
    editorObj.documentEditor.selection.select(startOffset, startOffset);
  };
  const moveCursorToNextRow = () => {
    // To get current selection start offset
    if (!editorObj) return;
    var startOffset = editorObj.documentEditor.selection.startOffset;
    // Increasing row index to consider next row
    var startOffsetArray = startOffset.split(";");
    startOffsetArray[2] = String(parseInt(startOffsetArray[2]) + 1);
    // Going back to first cell
    startOffsetArray[3] = String(0);
    // Changing start offset
    startOffset = startOffsetArray.join(";");
    // Navigating selection using select method
    editorObj.documentEditor.selection.select(startOffset, startOffset);
  };
  


  const handleStrikethrough = () => {
    // Apply strikethrough to the selected text
    editorObj?.documentEditor.editor.toggleStrikethrough();
  };
  return (
    <div className="App">
      <button onClick={onSave} style={{ marginBottom: 10 }}>
        Save
      </button>
      <button onClick={handleAddField}>Add Field</button>
      <button onClick={replaceValues}>Replace Values</button>
      <button onClick={renderDynamicTable}>Render Dynamic Table</button>
      <DocumentEditorContainerComponent
        ref={(ins: DocumentEditorContainerComponent | null) =>
          (editorObj = ins)
        }
        height="80vh"
        enableToolbar={true}
        // toolbarItems={[
        //   "Open",
        //   "Break",
        //   "Comments",
        //   "Find",
        //   "Header",
        //   "Footer",
        //   toolItem,
        // ]}
        serviceUrl="http://10.246.25.4/api/wordeditor/"
      >
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponent>
    </div>
  );
}

export default App;

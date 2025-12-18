import React, { useRef } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
} from "@syncfusion/ej2-react-documenteditor";
import PlaceholderTools from "./components/placeholder-tools";

const Editor = () => {
  const editorObj = useRef<DocumentEditorContainerComponent | null>(null);

  const onSave = () => {
    editorObj.current?.documentEditor.save("Sample", "Sfdt");
  };

  const handleAddField = () => {
    let fieldCode: string = "MERGEFIELD  First Name  \\* MERGEFORMAT ";
    let fieldResult: string = "«First Name»";
    editorObj.current?.documentEditor.editor.insertField(
      fieldCode,
      fieldResult
    );
  };

  const replaceValues = () => {
    editorObj.current?.documentEditor.search.findAll("«First Name»", "None");
    editorObj.current?.documentEditor.search.searchResults.replaceAll(
      "Seniya Dissanayake"
    );
  };

  const renderDynamicTable = async () => {
    if (!editorObj.current) return;
    const editor = editorObj.current.documentEditor;

    editor.editor.insertTable(5, 2);
    const tableData = [
      { name: "John Doe", age: 30 },
      { name: "Jane Smith", age: 25, city: "New York" },
      { name: "Alice Johnson", age: 30 },
    ];
    // Step 4: Populate headers (row 0)
    const headers = Object.keys(tableData[0]);
    headers.forEach((header, colIndex) => {
      editor.editor.insertText(header);
      moveCursorToNextCell();
    });
    moveCursorToNextRow();

    // Step 5: Populate data rows
    tableData.forEach((row, rowIndex) => {
      Object.values(row).forEach((value, colIndex) => {
        editor.editor.insertText(String(value));
        moveCursorToNextCell();
      });
      moveCursorToNextRow();
    });
  };

  const moveCursorToNextCell = () => {
    if (!editorObj.current) return;
    let startOffset = editorObj.current.documentEditor.selection.startOffset;
    var startOffsetArray = startOffset.split(";");
    startOffsetArray[3] = String(parseInt(startOffsetArray[3]) + 1);
    startOffset = startOffsetArray.join(";");
    editorObj.current.documentEditor.selection.select(startOffset, startOffset);
  };

  const moveCursorToNextRow = () => {
    if (!editorObj.current) return;
    var startOffset = editorObj.current.documentEditor.selection.startOffset;
    var startOffsetArray = startOffset.split(";");
    startOffsetArray[2] = String(parseInt(startOffsetArray[2]) + 1);
    startOffsetArray[3] = String(0);
    startOffset = startOffsetArray.join(";");
    editorObj.current.documentEditor.selection.select(startOffset, startOffset);
  };

  const handleStrikethrough = () => {
    editorObj.current?.documentEditor.editor.toggleStrikethrough();
  };

  const addTablePlaceholder = () =>{
    if(!editorObj.current) return;
    const { documentEditor } = editorObj.current;

    const cell = documentEditor.selection.start.paragraph.associatedCell
    if(cell.rowIndex===1 && cell.columnIndex === 0){
      return "Table.Start"
    }

  }

  return (
    <div>
      <button onClick={onSave} style={{ marginBottom: 10 }}>
        Save
      </button>
      <button onClick={handleAddField}>Add Field</button>
      <button onClick={replaceValues}>Replace Values</button>
      <button onClick={renderDynamicTable}>Render Dynamic Table</button>
      <PlaceholderTools
        onPlaceholderSelect={(placeholder) => {
          // Insert placeholder.value into the editor
          console.log(placeholder.value);
          let fieldCode: string = `MERGEFIELD  ${placeholder.label}  \\* MERGEFORMAT `;
          let fieldResult: string = `${placeholder.value}`;
          


          editorObj.current?.documentEditor.editor.insertField(
            fieldCode,
            fieldResult
          );
        }}
      />
      <DocumentEditorContainerComponent
        ref={(ins: DocumentEditorContainerComponent | null) =>
          (editorObj.current = ins)
        }
        height="80vh"
        enableToolbar={true}
        serviceUrl="http://10.246.25.4/api/wordeditor/"
      >
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponent>
    </div>
  );
};

export default Editor;

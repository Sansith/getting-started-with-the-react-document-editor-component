import React, { useRef } from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Inject,
  TableRowWidget,
  TableCellWidget,
  ParagraphWidget,
  TextPosition,
  LineWidget,
} from "@syncfusion/ej2-react-documenteditor";
import { TABLE_PLACEHOLDERS } from "./components/placeholder-tools";

const CUSTOMER_DATA = {
  REFERENCE_CODE: "CUS2024001",
  MOTHER_MAIDEN_NAME: "Godzila",
  MONTHLY_INCOME: 150000,
  DEPENDANT_COUNT: 3,
  REGISTERED_DATE: "2024-01-10T00:00:00.000+0000",
  SPOUSE_NAME: "Kong Zila",
  FATHER_NAME: "King Kong",
  ACCOUNT_LIST: [
    {
      CURRENCY: "LKR",
      ACCOUNT_TYPE: "COMM",
      ACCOUNT_ID: 8260568,
      ACTUAL_BALANCE: 101380,
      AVAILABLE_BALANCE: 100380,
      ACCOUNT_STATUS: "ACTIVE",
      ACCOUNT_NUMBER: "60001100000478",
    },
    {
      CURRENCY: "LKR",
      ACCOUNT_TYPE: "COMM",
      ACCOUNT_ID: 9219088,
      ACTUAL_BALANCE: 10834.44,
      AVAILABLE_BALANCE: 10834.44,
      ACCOUNT_STATUS: "ACTIVE",
      ACCOUNT_NUMBER: "50001100012097",
    },
  ],
  LIVING_CATEGORY: "OWNED_HOUSE",
};

const Renderer = () => {
  const editorObj = useRef<DocumentEditorContainerComponent | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editorObj.current) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // For SFDT format (Syncfusion Document Text format)
        if (file.name.endsWith(".sfdt")) {
          editorObj.current?.documentEditor.open(content);
        } else {
          // For .docx files, convert to base64
          const base64Content = content.split(",")[1];
          editorObj.current?.documentEditor.open(base64Content);
        }
      }
    };

    if (file.name.endsWith(".sfdt")) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const getCurrentCell = () => {
    if (!editorObj.current?.documentEditor) return;
    const { documentEditor } = editorObj.current;
    const cell = documentEditor.selection.start.paragraph.associatedCell;

    if (cell) {
      return cell;
    }

    return null;
  };
  const moveToBelowCell = () => {
    if (!editorObj.current?.documentEditor) return;
    const { documentEditor } = editorObj.current;
    if (!documentEditor.selection.start.paragraph?.associatedCell) {
      console.log("Cursor not in table cell");
      return false;
    }
    debugger;
    const currentCell = documentEditor.selection.start.paragraph.associatedCell;
    const currentRow = currentCell.ownerRow;
    const table = currentRow.ownerTable;
    const columnIndex = currentCell.columnIndex;
    const currentRowIndex = currentRow.index;

    if (currentRowIndex + 1 >= table.childWidgets.length) {
      console.log("Already at bottom row");
      return false;
    }

    const belowRow = table.childWidgets[currentRowIndex + 1] as TableRowWidget;
    let belowCell: TableCellWidget | null = null;

    // Find cell in same column
    for (let cell of belowRow.childWidgets as TableCellWidget[]) {
      if (
        cell.columnIndex <= columnIndex &&
        cell.columnIndex + cell.cellFormat.columnSpan - 1 >= columnIndex
      ) {
        belowCell = cell;
        break;
      }
    }

    if (!belowCell) return false;

    // Get first paragraph in below cell
    const firstPara = belowCell.firstChild as ParagraphWidget;
    if (!firstPara) return false;
    
    documentEditor.selection.handleDownKey()
    // // **CORRECT WAY: Create TextPosition at paragraph start, then get hierarchical index**
    // const paraStartPos = new TextPosition(documentEditor);

    // paraStartPos.setPosition(firstPara.firstChild as LineWidget, );

    // const hierarchicalIndex = documentEditor.selection.getHierarchicalIndexByPosition(paraStartPos);

    // // Select using hierarchical index
    // const startPos = documentEditor.selection.getTextPosBasedOnLogicalIndex(hierarchicalIndex);
    // documentEditor.selection.select(startPos);

    return true;
  };

  const addNewValueToNextRowCell = (value: string, items: any[]) => {
    if (!editorObj.current?.documentEditor) return;
    const { documentEditor } = editorObj.current;

    // documentEditor.selection.selectRow();

    const currentCell = documentEditor.selection.start.paragraph.associatedCell;
    const currentRow = currentCell.ownerRow;
    const colCount = currentRow.childWidgets;
    const rowCount = currentRow.ownerTable.childWidgets.length
    if ((rowCount-2) < (items.length)) {
      documentEditor.editor.insertRow(false);
    }

    moveToBelowCell();
    // documentEditor.selection.moveDown()
    //documentEditor.selection.moveToNextParagraph(); // Move to new row
    // documentEditor.selection.moveToParagraphStart(); // Start of new cell
    documentEditor.editor.insertText(value);
  };
  const replaceTableValues = (
    listPlaceholder: string,
    childPlaceholder: string,
    dataSource: any[]
  ) => {
    if (!editorObj.current?.documentEditor) return;
    const { documentEditor } = editorObj.current;
    documentEditor.search.searchResults.clear();

    documentEditor.search.find(`«${listPlaceholder}[].${childPlaceholder}»`);
    if (documentEditor.search.searchResults.length < 1) return;
    const cell = getCurrentCell();
    if (!cell) {
      console.log("Not in a cell");
      // handle the outside table rendering
      return;
    }

    // documentEditor.editor.insertRow(false,1)

    // Calculate row count

    // // documentEditor.search.findAll("«ACCOUNT_LIST[].ACCOUNT_TYPE»")
    // debugger;
    // const isTableSelected = documentEditor.selection.isTableSelected();
    // const tables = documentEditor.selection.getTable(
    //   documentEditor.documentStart,
    //   documentEditor.documentEnd
    // );

    let row = cell.ownerRow;
    let table = row.ownerTable;
    const newRow = table.childWidgets[
      table.childWidgets.length - 1
    ] as TableRowWidget;
    const newCell = newRow.childWidgets[cell.columnIndex] as TableCellWidget;

    for (const item of dataSource) {
      addNewValueToNextRowCell(
        String(item[childPlaceholder as keyof typeof item]),
        dataSource
      );
    }

    console.log("Row count:", table.childWidgets.length);
    console.log("Cell count in row:", row.childWidgets.length);
    console.log("Current row index:", row.index);
    console.log("Current column index:", cell.columnIndex);
    if (documentEditor.selection.isTableSelected()) {
      let table = documentEditor.selection.getTable(
        documentEditor.selection.start,
        documentEditor.selection.end
      );
      console.log("Rows:", table.childWidgets.length);
      documentEditor.editor.insertRow();
    }
  };

  const processTablePlaceholders = () =>{
     if (!editorObj.current?.documentEditor) return;
    const { documentEditor } = editorObj.current;
    documentEditor.selection.moveToDocumentStart();
    documentEditor.search.find(`«Table.Start»`);

    const cell = documentEditor.selection.start.paragraph.associatedCell;
    
    
  }
  const replaceValues = () => {
    if (!editorObj.current?.documentEditor) return;

    const editor = editorObj.current.documentEditor;
    

    // Object.entries(CUSTOMER_DATA).forEach(([key, value]) => {
    //   if (Array.isArray(value)) {
    //     for (const element of TABLE_PLACEHOLDERS[
    //       key as keyof typeof TABLE_PLACEHOLDERS
    //     ]) {
    //       replaceTableValues(key, element.code, value);
    //     }

    //     return;
    //   }

    //   const stringValue = String(value);
    //   editor.search.findAll(`«${key}»`, "None");
    //   editor.search.searchResults.replaceAll(stringValue);
    // });
  };

  const openFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.doc,.sfdt"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <button
          onClick={openFile}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Open File
        </button>

        <button onClick={replaceValues}>Replace Values</button>
        <button onClick={replaceValues}>Replace Table Values</button>
      </div>
      <DocumentEditorContainerComponent
        ref={(ins: DocumentEditorContainerComponent | null) =>
          (editorObj.current = ins)
        }
        height="80vh"
        enableToolbar={false}
        serviceUrl="http://10.246.25.4/api/wordeditor/"
      >
        <Inject services={[Toolbar]}></Inject>
      </DocumentEditorContainerComponent>
    </div>
  );
};

export default Renderer;

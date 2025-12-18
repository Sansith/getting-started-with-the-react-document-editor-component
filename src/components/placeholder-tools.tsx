import React from "react";

export interface Placeholder {
  id: string;
  label: string;
  value: string;
}

interface PlaceholderData {
  code: string;
  name: string;
  description: string;
  dataType: string;
  status: string;
}

interface PlaceholderToolsProps {
  onPlaceholderSelect?: (placeholder: Placeholder) => void;
}

const PLACEHOLDER_DATA: PlaceholderData[] = [
  {
    code: "REFERENCE_CODE",
    name: "Customer Reference Code",
    description: "Unique customer reference",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "MONTHLY_INCOME",
    name: "Monthly Income",
    description: "Customer monthly income",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "DEPENDANT_COUNT",
    name: "Number of Dependants",
    description: "Total dependants",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "REGISTERED_DATE",
    name: "Registration Date",
    description: "Customer registration date",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "FATHER_NAME",
    name: "Father Name",
    description: "Father's name",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "MOTHER_MAIDEN_NAME",
    name: "Mother Maiden Name",
    description: "Mother's maiden name",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "SPOUSE_NAME",
    name: "Spouse Name",
    description: "Spouse name",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
    code: "LIVING_CATEGORY",
    name: "Living Category",
    description: "Living category code",
    dataType: "SCALAR",
    status: "ACTIVE",
  },
  {
        "code": "ACCOUNT_LIST",
        "name": "Account List",
        "description": "List of customer accounts",
        "dataType": "LIST",
        "status": "ACTIVE"
  },
];

export const TABLE_PLACEHOLDERS = {
  "ACCOUNT_LIST":[
    {
        "code": "ACCOUNT_ID",
        "name": "Account ID",
        "description": "Account unique ID",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "ACCOUNT_NUMBER",
        "name": "Account Number",
        "description": "Account number",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "ACCOUNT_TYPE",
        "name": "Account Type",
        "description": "Type of account",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "AVAILABLE_BALANCE",
        "name": "Available Balance",
        "description": "Available balance amount",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "ACTUAL_BALANCE",
        "name": "Actual Balance",
        "description": "Actual balance amount",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "CURRENCY",
        "name": "Currency",
        "description": "Currency code",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    },
    {
        "code": "ACCOUNT_STATUS",
        "name": "Account Status",
        "description": "Account status",
        "dataType": "SCALAR",
        "status": "ACTIVE"
    }
]
}
const PlaceholderTools: React.FC<PlaceholderToolsProps> = ({
  onPlaceholderSelect,
}) => {
  const [expandedLists, setExpandedLists] = React.useState<Set<string>>(new Set());

  const handlePlaceholderClick = (placeholder: Placeholder) => {
    if (onPlaceholderSelect) {
      onPlaceholderSelect(placeholder);
    }
  };

  const toggleList = (code: string) => {
    setExpandedLists((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const scalarPlaceholders = PLACEHOLDER_DATA.filter((data) => data.dataType === "SCALAR");
  const listPlaceholders = PLACEHOLDER_DATA.filter((data) => data.dataType === "LIST");

  return (
    <div
      style={{
        padding: "12px",
        borderBottom: "1px solid #ddd",
        marginBottom: "12px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Scalar Placeholders */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <label
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "#333",
              marginRight: "8px",
            }}
          >
            Placeholders:
          </label>
          {scalarPlaceholders.map((data) => (
            <button
              key={data.code}
              onClick={() => handlePlaceholderClick({
                id: data.code,
                label: data.name,
                value: `«${data.code}»`,
              })}
              style={{
                padding: "6px 12px",
                backgroundColor: "#e8f0fe",
                border: "1px solid #1f73e6",
                borderRadius: "4px",
                color: "#1f73e6",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                const button = e.currentTarget;
                button.style.backgroundColor = "#1f73e6";
                button.style.color = "white";
              }}
              onMouseLeave={(e) => {
                const button = e.currentTarget;
                button.style.backgroundColor = "#e8f0fe";
                button.style.color = "#1f73e6";
              }}
            >
              {data.name}
            </button>
          ))}
        </div>

        {/* List Placeholders */}
        {listPlaceholders.map((listData) => {
          const isExpanded = expandedLists.has(listData.code);
          const childPlaceholders = TABLE_PLACEHOLDERS[listData.code as keyof typeof TABLE_PLACEHOLDERS] || [];

          return (
            <div key={listData.code} style={{ marginTop: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => toggleList(listData.code)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffc107",
                    borderRadius: "4px",
                    color: "#856404",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    const button = e.currentTarget;
                    button.style.backgroundColor = "#ffc107";
                    button.style.color = "#000";
                  }}
                  onMouseLeave={(e) => {
                    const button = e.currentTarget;
                    button.style.backgroundColor = "#fff3cd";
                    button.style.color = "#856404";
                  }}
                >
                  <span>{isExpanded ? "▼" : "▶"}</span>
                  {listData.name}
                </button>
              </div>

              {/* Child Placeholders */}
              {isExpanded && childPlaceholders.length > 0 && (
                <div
                  style={{
                    marginTop: "8px",
                    marginLeft: "24px",
                    padding: "8px",
                    backgroundColor: "#ffffff",
                    borderLeft: "3px solid #ffc107",
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {childPlaceholders.map((childData) => (
                      <button
                        key={childData.code}
                        onClick={() => handlePlaceholderClick({
                          id: childData.code,
                          label: childData.name,
                          value: `«${listData.code}[].${childData.code}»`,
                        })}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#e8f5e9",
                          border: "1px solid #4caf50",
                          borderRadius: "4px",
                          color: "#2e7d32",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: 500,
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          const button = e.currentTarget;
                          button.style.backgroundColor = "#4caf50";
                          button.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          const button = e.currentTarget;
                          button.style.backgroundColor = "#e8f5e9";
                          button.style.color = "#2e7d32";
                        }}
                      >
                        {childData.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaceholderTools;

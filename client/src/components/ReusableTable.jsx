import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faTrash,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { arabicFont } from "../utils/arabicFont";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Container = styled.div`
  h2 {
    color: ${({ theme }) => theme.text};
  }
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CardHeader = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CardContent = styled.div`
  font-size: 14px;
  margin-bottom: 16px;
  p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.form`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  padding: 16px;
  border-radius: 8px;
  width: 450px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ theme }) => theme.text};
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block;
    margin-bottom: 4px;
  }
  input,
  select {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.text};

    &:focus {
      outline: none;
    }

    option {
      color: #000;
    }
  }

  input:focus,
  select:focus {
    outline: none;
  }

  input[type="checkbox"] {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.neutral};
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e53935;
  }
`;

const AddButton = styled.button`
  margin: 16px 0 16px 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.neutral};
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;

  svg {
    margin-left: 8px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #0061ab;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #dc143c;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.text};
`;

const SortCombo = styled.select`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${({ theme }) => theme.text};

  &:focus {
    outline: none;
  }

  option {
    color: #000;
  }
`;
const ExportButton = styled.button`
  margin-left: 16px;
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #1976d2;
  }

  svg {
    margin-left: 8px;
    position: relative;
    top: 2px;
  }
`;

const ReusableTable = ({ apiUrl, columns, title }) => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/${apiUrl}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const handleEdit = (row) => {
    setFormData({ ...row });
    setEditing(true);
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/${apiUrl}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/${apiUrl}/${formData.id}`, formData);
      } else {
        const maxRowNumber = Math.max(
          ...data.map((item) => item.rowNumber || 0)
        );
        const newRowNumber = maxRowNumber + 1;

        await axios.post(`/api/${apiUrl}`, {
          ...formData,
          rowNumber: newRowNumber,
        });
      }
      setFormData({});
      setEditing(false);
      setFormVisible(false);
      const response = await axios.get(`/api/${apiUrl}`);
      setData(response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleAddNew = () => {
    setFormData({});
    setEditing(false);
    setFormVisible(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.created_at) - new Date(b.created_at);
    } else {
      return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const filteredData = sortedData.filter((row) =>
    columns.some((column) =>
      row[column.field]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  const exportToExcel = () => {
    const worksheetData = filteredData.map((row) => {
      const newRow = {};
      columns.forEach((col) => {
        newRow[col.label] = row[col.field];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    worksheet["!cols"] = columns.map(() => ({ wpx: 120 }));
    worksheet["!merges"] = [];
    worksheet["!printOptions"] = {
      printTitles: true,
      printGridlines: false,
      orientation: "landscape",
    };

    const fileName = `${title}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    doc.addFileToVFS("Amiri-Regular.ttf", arabicFont);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 40, {
      align: "center",
    });

    const tableData = filteredData.map((row) =>
      columns.map((col) => row[col.field] || "")
    );

    const tableHeaders = columns.map((col) => col.label);

    const reversedTableHeaders = tableHeaders.reverse();
    const reversedTableData = tableData.map((row) => row.reverse());

    doc.autoTable({
      head: [reversedTableHeaders],
      body: reversedTableData,
      startY: 60,
      styles: {
        font: "Amiri",
        fontStyle: "normal",
        textColor: [0, 0, 0],
        halign: "center",
        overflow: "ellipsis",
        wordWrap: "break-word",
      },
      headStyles: {
        fillColor: [0, 97, 171],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      bodyStyles: {
        fontSize: 10,
      },
      direction: "rtl",
    });

    doc.save(`${title}.pdf`);
  };

  return (
    <Container>
      <h2>{title}</h2>
      <div>
        <AddButton onClick={handleAddNew}>
          <FontAwesomeIcon icon={faPlus} /> إضافة جديد
        </AddButton>

        <ExportButton onClick={exportToExcel}>
          <FontAwesomeIcon icon={faFileExcel} /> تصدير إلى Excel
        </ExportButton>

        <ExportButton onClick={exportToPdf}>
          <FontAwesomeIcon icon={faFilePdf} /> تصدير إلى PDF
        </ExportButton>
      </div>

      <div>
        <SearchInput
          type="text"
          placeholder="بحث..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <SortCombo value={sortOrder} onChange={handleSortOrderChange}>
          <option value="desc">من الأحدث للأقدم</option>
          <option value="asc">من الأقدم للأحدث</option>
        </SortCombo>
      </div>

      {formVisible && (
        <Overlay>
          <FormContainer onSubmit={handleSubmit}>
            <h3>{editing ? "تعديل" : "إضافة جديد"}</h3>
            {columns.map((field, idx) => (
              <FormGroup key={idx}>
                <label>{field.label}:</label>
                {field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={formData[field.field] || false}
                    onChange={(e) =>
                      handleChange(field.field, e.target.checked)
                    }
                  />
                ) : field.type === "select" ? (
                  <select
                    value={formData[field.field] || ""}
                    onChange={(e) => handleChange(field.field, e.target.value)}
                  >
                    <option value="" disabled>
                      اختر حالة
                    </option>
                    <option value="لم ابدأ فيها">لم ابدأ فيها</option>
                    <option value="قيد التنفيذ">قيد التنفيذ</option>
                    <option value="مكتملة">مكتملة</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData[field.field] || ""}
                    onChange={(e) => handleChange(field.field, e.target.value)}
                    required
                  />
                )}
              </FormGroup>
            ))}
            <FormActions>
              <SubmitButton type="submit">
                {editing ? "تعديل" : "إضافة"}
              </SubmitButton>
              <CancelButton onClick={() => setFormVisible(false)}>
                إلغاء
              </CancelButton>
            </FormActions>
          </FormContainer>
        </Overlay>
      )}
      <CardContainer>
        {loading ? (
          <p>جاري التحميل...</p>
        ) : filteredData.length === 0 ? (
          <p>لا توجد بيانات للعرض</p>
        ) : (
          filteredData.map((row, idx) => (
            <Card key={idx}>
              <CardHeader>
                #{row.rowNumber || idx + 1} {row[columns[0].field]}
              </CardHeader>
              <CardContent>
                {columns.map((col) => (
                  <p key={col.field}>
                    {col.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={row[col.field] === 1}
                        readOnly
                      />
                    ) : (
                      row[col.field]
                    )}
                  </p>
                ))}
              </CardContent>
              <CardActions>
                <EditButton onClick={() => handleEdit(row)}>
                  <FontAwesomeIcon icon={faEdit} />
                </EditButton>
                <DeleteButton
                  onClick={() => {
                    if (window.confirm("هل تريد حذف هذه الصف؟")) {
                      handleDelete(row.id);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </DeleteButton>
              </CardActions>
            </Card>
          ))
        )}
      </CardContainer>
    </Container>
  );
};

export default ReusableTable;

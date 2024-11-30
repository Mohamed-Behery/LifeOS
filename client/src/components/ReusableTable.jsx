import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faTrash,
  // faSort,
  faChevronUp,
  faChevronDown,
  faFileExcel,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { arabicFont } from "../utils/arabicFont";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Container = styled.div`
  h2 {
    color: ${({ theme }) => theme.text};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.border};
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }

  th {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.neutral};
    font-size: 24px;
    user-select: none;
    cursor: pointer;

    svg {
      margin-right: 8px;
      position: relative;
      top: 2px;
      font-size: 16px;
    }
  }

  td {
    color: ${({ theme }) => theme.text};
  }
`;

const TableRow = styled.tr`
  color: ${({ theme }) => theme.text};
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
  padding: 20px;
  border-radius: 8px;
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ theme }) => theme.text};
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.border};
  }

  input:focus {
    outline: none;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e53935;
  }
`;

const AddButton = styled.button`
  margin: 0 16px 16px 16px;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.neutral};
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px;

  svg {
    margin-left: 8px;
    position: relative;
    top: 2px;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #0061ab;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #dc143c;
`;

const SearchInput = styled.input`
  width: 97%;
  margin: 0 16px;
  padding: 8px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.border};
  outline: none;
`;

const FilterWrapper = styled.div`
  margin: 0 20px 20px 0;

  input {
    padding: 4px;
    border-radius: 4px;
    font-size: 18px;
    margin-left: 16px;
    border: 1px solid ${({ theme }) => theme.border};
  }

  button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    background-color: #276482;
    color: white;
    cursor: pointer;
    font-size: 16px;
  }
`;

const ExportButton = styled.button`
  margin-left: 16px;
  padding: 10px 20px;
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

const ReusableTable = ({ apiUrl, columns, title, linkedTables = [] }) => {
  const [data, setData] = useState([]);
  // const [linkedData, setLinkedData] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({
    fromDate: "",
    toDate: "",
  });
  const [sortDirection, setSortDirection] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "حدث خطاء أثناء إستدعاء البيانات: " + error.response.data.message
        );
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
      await axios.delete(`${apiUrl}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${apiUrl}/${formData.id}`, formData);
      } else {
        const maxRowNumber = Math.max(
          ...data.map((item) => item.rowNumber || 0)
        );
        const newRowNumber = maxRowNumber + 1;

        await axios.post(apiUrl, { ...formData, rowNumber: newRowNumber });
      }

      setFormData({});
      setEditing(false);
      setFormVisible(false);

      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error saving data:", error);

      if (error.response) {
        setError("حدث خطأ أثناء حفظ البيانات: " + error.response.data.message);
      } else {
        setError("حدث خطأ أثناء الاتصال بالخادم.");
      }
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

  const handleSort = (field) => {
    const currentDirection = sortDirection[field];
    setSortDirection({ [field]: !currentDirection });

    const sortedData = [...data].sort((a, b) => {
      if (a[field] < b[field]) return currentDirection ? -1 : 1;
      if (a[field] > b[field]) return currentDirection ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const getSortIcon = (field) => {
    const direction = sortDirection[field];
    return direction === undefined ? (
      ""
    ) : direction ? (
      <FontAwesomeIcon icon={faChevronUp} />
    ) : (
      <FontAwesomeIcon icon={faChevronDown} />
    );
  };

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

  // Handle changes in filter inputs
  const handleFilterChange = (key, value) => {
    setFilterCriteria({ ...filterCriteria, [key]: value });
  };

  // Filter data based on criteria
  const filteredData = data
    .filter((row) =>
      columns.some((column) =>
        row[column.field]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    )
    .filter((row) => {
      const rowDate = new Date(row.date); // Assuming a `date` field exists in the table
      const fromDate = filterCriteria.fromDate
        ? new Date(filterCriteria.fromDate)
        : null;
      const toDate = filterCriteria.toDate
        ? new Date(filterCriteria.toDate)
        : null;

      if (fromDate && rowDate < fromDate) return false;
      if (toDate && rowDate > toDate) return false;
      return true;
    });

  const exportToPdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // إعداد الخط العربي
    doc.addFileToVFS("Amiri-Regular.ttf", arabicFont);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    // إضافة عنوان التقرير
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 40, {
      align: "center",
    });

    // إعداد البيانات والجداول
    const tableData = filteredData.map((row) =>
      columns.map((col) => row[col.field] || "")
    );

    const tableHeaders = columns.map((col) => col.label);

    // عكس ترتيب الأعمدة لدعم الـ RTL
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

    // حفظ الملف
    doc.save(`${title}.pdf`);
  };

  return (
    <Container>
      <h2>{title}</h2>
      <AddButton onClick={handleAddNew}>
        <FontAwesomeIcon icon={faPlus} /> إضافة جديد
      </AddButton>

      <ExportButton onClick={exportToExcel}>
        <FontAwesomeIcon icon={faFileExcel} /> تصدير إلى Excel
      </ExportButton>
      <ExportButton onClick={exportToPdf}>
        <FontAwesomeIcon icon={faFilePdf} /> تصدير إلى PDF
      </ExportButton>

      <FilterWrapper>
        <input
          type="date"
          value={filterCriteria.fromDate}
          onChange={(e) => handleFilterChange("fromDate", e.target.value)}
          placeholder="من تاريخ"
        />
        <input
          type="date"
          value={filterCriteria.toDate}
          onChange={(e) => handleFilterChange("toDate", e.target.value)}
          placeholder="إلى تاريخ"
        />
        <button
          onClick={() =>
            setFilterCriteria({
              fromDate: "",
              toDate: "",
            })
          }
        >
          إلغاء الفلترة
        </button>
      </FilterWrapper>

      <SearchInput
        type="text"
        placeholder="بحث..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {formVisible && (
        <Overlay>
          <FormContainer onSubmit={handleSubmit}>
            <h3>{editing ? "تعديل" : "إضافة جديد"}</h3>
            {columns.map((field, idx) => (
              <FormGroup key={idx}>
                <label>{!field.hidden && field.label}</label>
                <input
                  type={field.type || "text"}
                  value={formData[field.field] || ""}
                  onChange={(e) => handleChange(field.field, e.target.value)}
                  required={!field.notRequired}
                  hidden={field.hidden}
                />
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
            {error && <p style={{ color: "red" }}>{error}</p>}
          </FormContainer>
        </Overlay>
      )}

      <Table>
        <thead>
          <tr>
            <th>رقم</th>
            {columns.map((col, idx) => (
              <th key={idx} onClick={() => handleSort(col.field)}>
                {col.label} {getSortIcon(col.field)}
              </th>
            ))}
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 3}>جاري التحميل...</td>
            </tr>
          ) : filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <TableRow key={idx}>
                <td>{row.rowNumber || idx + 1}</td>
                {columns.map((col, i) => (
                  <td key={i}>{row[col.field]}</td>
                ))}
                <td>
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
                </td>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 2}>لا توجد بيانات للعرض</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReusableTable;
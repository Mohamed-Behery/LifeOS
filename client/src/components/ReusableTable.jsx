import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPlus,
  faTrash,
  faChevronUp,
  faChevronDown,
  faFileExcel,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  h2 {
    color: ${({ theme }) => theme.text};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;

  th,
  td {
    padding: 8px;
    border: 1px solid ${({ theme }) => theme.border};
    text-align: center;
    font-size: 16px;
  }

  th {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.neutral};
    font-weight: bold;

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
  margin: 16px 0;
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
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;
const ExportButton = styled.button`
  margin: 0 16px;
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

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
  const [sortDirection, setSortDirection] = useState({});
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
      <FontAwesomeIcon icon={faSort} />
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

  const filteredData = data.filter((row) =>
    columns.some((column) =>
      row[column.field]
        ?.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Container>
      <h2>{title}</h2>
      <AddButton onClick={handleAddNew}>
        <FontAwesomeIcon icon={faPlus} /> إضافة جديد
      </AddButton>

      <ExportButton onClick={exportToExcel}>
        <FontAwesomeIcon icon={faFileExcel} /> تصدير إلى Excel
      </ExportButton>

      <SearchInput
        type="text"
        placeholder="بحث..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {formVisible && (
        <Overlay>
          <FormContainer onSubmit={handleSubmit}>
            <h3>{editing ? "تعديل" : "إضافة جديد"}</h3>
            {columns.map((field, idx) => (
              <FormGroup key={idx}>
                <label>{field.label}:</label>
                <input
                  type="text"
                  value={formData[field.field] || ""}
                  onChange={(e) => handleChange(field.field, e.target.value)}
                  required
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
          </FormContainer>
        </Overlay>
      )}

      <Table>
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col, idx) => (
              <th
                key={idx}
                onClick={() => handleSort(col.field)}
                style={{ cursor: "pointer" }}
              >
                {col.label} {getSortIcon(col.field)}
              </th>
            ))}
            <th>تعديل</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + 3}>جاري التحميل...</td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 3}>لا توجد بيانات للعرض</td>
            </tr>
          ) : (
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
                </td>
                <td>
                  <DeleteButton
                    onClick={() => {
                      if (window.confirm("هل تريد حذف هذه الصف؟")) {
                        handleDelete(row);
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </DeleteButton>
                </td>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ReusableTable;

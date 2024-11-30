import ReusableTable from "../components/ReusableTable";

const ExpenseTypes = () => {
  const apiUrl = "/api/expense-types";
  const title = "أنواع المصروفات";
  const columns = [
    { label: "الاسم", field: "name" },
    { label: "الوصف", field: "description", notRequired: true },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default ExpenseTypes;

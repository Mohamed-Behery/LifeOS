import ReusableTable from "../components/ReusableTable";

const Expenses = () => {
  const apiUrl = "/api/expenses";
  const title = "إدارة المصروفات";
  const columns = [
    { label: "التاريخ", field: "date", type: "date", notRequired: true },
    { label: "الوصف", field: "description", notRequired: true },
    { label: "المبلغ", field: "amount" },
    { label: "نوع المصروف", field: "expense_type_id", notRequired: true },
    { label: "الخزينة", field: "cash_register_id", notRequired: true },
    { label: "البنك", field: "bank_id", notRequired: true },
    { label: "الملاحظات", field: "notes", notRequired: true },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Expenses;

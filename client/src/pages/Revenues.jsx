import ReusableTable from "../components/ReusableTable";

const Revenues = () => {
  const apiUrl = "/api/revenues";
  const title = "الدخل";
  const columns = [
    { label: "التاريخ", field: "date", type: "date" },
    { label: "الوصف", field: "description" },
    { label: "المبلغ", field: "amount" },
    { label: "نوع الإيراد", field: "revenue_type_id", notRequired: true },
    { label: "الخزينة", field: "cash_register_id", notRequired: true },
    { label: "البنك", field: "bank_id", notRequired: true },
    { label: "الملاحظات", field: "notes", notRequired: true },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Revenues;

import ReusableTable from "./../components/ReusableTable";

const CashRegisters = () => {
  const apiUrl = "notes";
  const title = "إدارة ملاحظاتك";
  const columns = [
    { label: "العنوان", field: "title" },
    { label: "المحتوى", field: "content" },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default CashRegisters;

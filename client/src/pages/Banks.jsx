import ReusableTable from "../components/ReusableTable";

const Banks = () => {
  const apiUrl = "/api/banks";
  const title = "إدارة البنوك";
  const columns = [
    { label: "الاسم", field: "name" },
    { label: "الرصيد الافتتاحي", field: "opening_balance", notRequired: true },
    {
      label: "الإجمالي الوارد",
      field: "total_income",
      notRequired: true,
      hidden: true,
    },
    {
      label: "الإجمالي الصادر",
      field: "total_expenses",
      notRequired: true,
      hidden: true,
    },
    {
      label: "الرصيد الحالي",
      field: "current_balance",
      notRequired: true,
      hidden: true,
    },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Banks;

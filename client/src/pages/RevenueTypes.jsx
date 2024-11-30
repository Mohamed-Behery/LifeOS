import ReusableTable from "../components/ReusableTable";

const RevenueTypes = () => {
  const apiUrl = "/api/revenue-types";
  const title = "مصادر الدخل";
  const columns = [
    { label: "الاسم", field: "name" },
    { label: "الوصف", field: "description", notRequired: true },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default RevenueTypes;

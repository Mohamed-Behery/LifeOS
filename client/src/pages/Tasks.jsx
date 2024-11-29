import ReusableTable from "./../components/ReusableTable";

const Tasks = () => {
  const apiUrl = "tasks";
  const title = "إدارة مهامك";
  const columns = [
    { label: "العنوان", field: "title" },
    { label: "الوصف", field: "description" },
    { label: "الحالة", field: "status", type: "select" },
    { label: "مكتملة", field: "completed", type: "checkbox" },
  ];

  return <ReusableTable apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Tasks;

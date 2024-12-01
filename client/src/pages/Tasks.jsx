import ReusableCardView from "../components/ReusableCardView";

const Tasks = () => {
  const apiUrl = "tasks";
  const title = "إدارة مهامك";
  const columns = [
    { label: "العنوان", field: "title" },
    { label: "الوصف", field: "description", notRequired: true },
    { label: "الحالة", field: "status", type: "select" },
    { label: "مكتملة", field: "completed", type: "checkbox" },
  ];

  return <ReusableCardView apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Tasks;

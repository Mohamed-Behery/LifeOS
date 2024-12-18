import ReusableCardView from "../components/ReusableCardView";

const Notes = () => {
  const apiUrl = "notes";
  const title = "إدارة ملاحظاتك";
  const columns = [
    { label: "العنوان", field: "title" },
    { label: "المحتوى", field: "content" },
  ];

  return <ReusableCardView apiUrl={apiUrl} columns={columns} title={title} />;
};

export default Notes;
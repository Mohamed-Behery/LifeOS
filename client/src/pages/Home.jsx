import styled from "styled-components";
import Card from "../components/Card";
import { faNoteSticky, faTasks } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  p {
    font-size: 18px;
  }
`;

const Cards = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  padding: 24px 0;
`;

const SectionsContainer = styled.div`
  margin-top: 32px;
`;

function Home() {
  const user = "محمد";

  const sections = [
    { title: "الملاحظات", link: "/notes", icon: faNoteSticky },
    { title: "المهام", link: "/tasks", icon: faTasks },
  ];

  return (
    <Container>
      <div>
        <h2>{user} ، أهلاً بيك في LifeOS</h2>
        <p>نظام إدارة حياتك.</p>
      </div>
      <SectionsContainer>
        <h3>الأقسام:</h3>
        <Cards>
          {sections.map((section, index) => (
            <Card
              key={index}
              title={section.title}
              link={section.link}
              icon={section.icon}
            />
          ))}
        </Cards>
      </SectionsContainer>
    </Container>
  );
}

export default Home;

import styled from "styled-components";

const Container = styled.div`
  p {
    font-size: 18px;
    color: ${({ theme }) => theme.text};
  }
`;

const Heading = styled.h2`
  color: ${({ theme }) => theme.text};
`;

function Home() {
  const user = "محمد";

  return (
    <Container>
      <Heading>{user} ، أهلاً بيك في LifeOS</Heading>
      <p>نظام إدارة حياتك.</p>
    </Container>
  );
}

export default Home;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled(Link)`
  background-color: ${({ theme }) => theme.neutral};
  border-radius: 24px;
  padding: 24px;
  gap: 10px;
  width: 250px;
  height: 150px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border};

  & > * {
    color: ${({ theme }) => theme.text};
  }

  &:hover > * {
    color: ${({ theme }) => theme.primary};
  }

  svg {
    font-size: 48px;
    margin-bottom: 16px;
  }

  span {
    font-weight: 600;
    margin-top: 8px;
    display: block;
  }
`;

function Card({ title, link, icon }) {
  return (
    <Container to={link}>
      <FontAwesomeIcon icon={icon} />
      <span>{title}</span>
    </Container>
  );
}

export default Card;

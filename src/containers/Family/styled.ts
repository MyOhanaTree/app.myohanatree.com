import styled from "styled-components";

export const TreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
  flex-grow: 1
`;

export const Card = styled.div<{ $isMain?: boolean }>`
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;  
  padding: 1rem;
  border: 2px solid ${({ $isMain }) => ($isMain ? "#0077ff" : "#ddd")};
  border-radius: 10px;
  background-color: ${({ $isMain }) => ($isMain ? "#e6f3ff" : "#fff")};
  text-align: center;
  scroll-snap-align: start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e6f3ff;
    border-color: #0077ff;
  }

  @media(width < 991px) {
    ${({ $isMain }) => ($isMain ? "width: 100%;" : "padding: 2rem; .inner {display: none}")}
  }
`;

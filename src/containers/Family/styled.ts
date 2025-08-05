import styled from "styled-components";

export const TreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem 0;
`;

export const CarouselRow = styled.div`
  display: flex;
  justify-content: center;
  overflow-x: auto;
  padding: 0.5rem 1rem;
  gap: 1rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }
`;

export const Card = styled.div<{ $isMain?: boolean }>`
  flex: 0 0 auto;
  min-width: 140px;
  padding: 1rem;
  border: ${({ $isMain }) => ($isMain ? "2px solid #0077ff" : "1px solid #ddd")};
  border-radius: 10px;
  background-color: ${({ $isMain }) => ($isMain ? "#e6f3ff" : "#fff")};
  text-align: center;
  scroll-snap-align: start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

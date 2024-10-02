import styled from "styled-components";

interface CustomProps {
  $customStyles?: any;
}

export const CardWrap = styled.div<CustomProps>`
  margin-bottom: 1rem;
  box-shadow: 0px 4px 12px 0px rgba(113, 125, 150, 0.05);
  & > div {
    box-shadow: none;
  }
  & .card {
    border-radius: 6px; 
    border-color: ${(props) => props.theme.colors.base_300};
  }
  
  & .card .card-header { 
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  
  & .card .card-title {
    font-size: 1.125rem; 
    font-weight: 600; 
    margin: 0; 
    color: ${(props) => props.theme.colors.base_800};
  }

  & .card .card-title:has(*) {
    display: flex;
    align-items: center;
  }
  
  & .card .card-body {
    padding: 1.5rem;
  }

  & .card .card-header, 
  & .card .card-footer {
    background-color: #fff; padding: 1rem;
    border: none;
  }
  & .card .card-header:first-child { 
    border-radius: calc(0.35rem - 1px) calc(0.35rem - 1px) 0 0;
  }
  & .card .card-footer:first-child { 
    border-radius: 0 0 calc(0.35rem - 1px) calc(0.35rem - 1px);
  }  
  ${(props) => props.$customStyles}
  
`;
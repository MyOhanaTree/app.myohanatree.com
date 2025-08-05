import styled from "styled-components";
import { themevals } from "@/theme/themevals";
import { Box } from "theme-ui";


export const CardWrap = styled(Box)`
  && { margin-bottom: 1rem; }
`;

export const CardBody = styled.div`
  flex: 1 1 auto;
  padding: 1.5rem;  
`;

export const CardHeader = styled.div`
  border-radius: calc(0.35rem - 1px) calc(0.35rem - 1px) 0 0;
  background-color: #fff;
  padding: 1rem;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 0;
`;

export const CardTitle = styled.h5`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  color: ${themevals.colors.base_800};
`;


export const CardFooter = styled.div`
  background-color: #fff;
  padding: 1rem;
  border: none;
  border-radius: 0 0 calc(0.35rem - 1px) calc(0.35rem - 1px);
`;
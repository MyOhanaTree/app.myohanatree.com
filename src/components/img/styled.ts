import styled from "styled-components";

interface CustomProps {
  $customStyles?: React.CSSProperties;
}

export const IMGWrapper = styled.img<CustomProps>`${(props: any) => props?.$customStyles}`
import styled from "styled-components";
import { themevals } from "@/theme/themevals";

export const RegisterFooterStyles = styled.div`
    margin-top: 30px;
    flex: 1;
    display: flex;
    align-items: flex-end;
`;

export const FooterCreds = styled.p`
    color:${themevals.colors.base_600};
    font-size:0.75rem;
    text-align:center;
    font-weight:500;
    margin-bottom:0;
`

export const BackButton = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    margin-top:30px;
    margin-bottom:40px;
    span{
        color:${themevals.colors.body};
        font-weight:500;
        font-size:14px;
    }
    a{
        display:flex;
        text-decoration:none;
        align-items:center;
    }
`
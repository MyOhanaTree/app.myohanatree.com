import styled from "styled-components";
import { themevals } from "theme/themevals";

export const LoginFooterStyles = styled.div`
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

export const ForgotPasswordLink = styled.div`
    margin-top:30px;
    margin-bottom:40px;
    text-align:center;
    a{
        text-decoration:none;
        color:${themevals?.colors?.body};
        font-size:14px;
        font-weight:500;
    }
`
import styled from "styled-components";

export const LoginContainerStyles = {
    display:"flex",
    flexDirection:"column"
}

export const LoginFooterStyles = {
    flex:1,
    display:"flex",
    alignItems:"flex-end"
}

export const FooterCreds = styled.p`
    color:${props => props.theme.colors.base_600};
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
        color:${props => props.theme?.colors?.body};
        font-size:14px;
        font-weight:500;
    }
`
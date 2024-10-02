import styled from "styled-components";

export const CheckboxWrapper = styled.div`
    label{
        color:${props => props.theme.colors.body};
        font-size:14px;
        font-weight:500;

    }
    input:focus{
        box-shadow:none !important;
        border-color:${props => props.theme.colors.base_300};
    }

    input{
        cursor:pointer;
        border-color:${props => props.theme.colors.base_300}
    }

    input:checked{
        background-color: ${props => props.theme.colors.body};
        border-color:${props => props.theme.colors.body} !important;
    }
`

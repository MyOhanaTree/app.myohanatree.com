import styled from "styled-components";

export const PageWrapper = styled.div`
    width:100%;    
    flex-grow: 1;
    display: flex;
    flex-direction: column;    
    padding:40px;
    @media (max-width: 991px)  {    
        padding: 25px;
    }    
`

export const PageInner = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
`;
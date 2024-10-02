import styled from "styled-components";
import { Button as rsButton } from 'reactstrap';
import { themevals as theme } from "theme/themevals";
import { darken } from "helpers/default"

interface CustomProps {
  submitting?: boolean;
  $styles?: any;
}

export const Button = styled(rsButton)<CustomProps>`    
  position: relative;
  font-size: 1rem;  
  border-radius: 6px;
  text-align: center;
  padding-left: 2rem;
  padding-right: 2rem;
  min-width: 30px;   
  max-width: 100%; 
  display: inline-flex;
  justify-content:center;
  align-items:center;
  font-weight: 500;  

  &.btn-clear {
    padding: 0;
    background: 0;
  }

  &.btn-primary,
  &.btn-outline-primary {
    --bs-btn-bg: ${theme.colors.primary};
    --bs-btn-color: ${theme.colors.white};
    --bs-btn-border-color: ${theme.colors.primary};   
    --bs-btn-hover-color: ${theme.colors.white};
    --bs-btn-hover-bg: ${darken(30,theme.colors.primary)};
    --bs-btn-hover-border-color: ${darken(40,theme.colors.primary)};
    --bs-btn-focus-shadow-rgb: 0, 0, 0;
    --bs-btn-active-color: ${theme.colors.white};
    --bs-btn-active-bg: ${darken(40,theme.colors.primary)};
    --bs-btn-active-border-color: ${darken(50,theme.colors.primary)};
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: ${theme.colors.white};
    --bs-btn-disabled-bg: ${theme.colors.primary};
    --bs-btn-disabled-border-color: ${theme.colors.primary};
    --bs-gradient: none;
  }

  &.btn-outline-primary {
    --bs-btn-color: ${theme.colors.primary};
    --bs-btn-bg: transparent;
  }

  &.btn-secondary,
  &.btn-outline-secondary {
    --bs-btn-bg: ${theme.colors.secondary};
    --bs-btn-color: ${theme.colors.white};
    --bs-btn-border-color: ${theme.colors.secondary};   
    --bs-btn-hover-color: ${theme.colors.white};
    --bs-btn-hover-bg: ${darken(30,theme.colors.secondary)};
    --bs-btn-hover-border-color: ${darken(40,theme.colors.secondary)};
    --bs-btn-focus-shadow-rgb: 0, 0, 0;
    --bs-btn-active-color: ${theme.colors.white};
    --bs-btn-active-bg: ${darken(40,theme.colors.secondary)};
    --bs-btn-active-border-color: ${darken(50,theme.colors.secondary)};
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: ${theme.colors.white};
    --bs-btn-disabled-bg: ${theme.colors.secondary};
    --bs-btn-disabled-border-color: ${theme.colors.secondary};
    --bs-gradient: none;
  }

  &.btn-outline-secondary {
    --bs-btn-color: ${theme.colors.secondary};
    --bs-btn-bg: transparent;
  }

  &.btn-danger,
  &.btn-outline-danger {
    --bs-btn-bg: ${theme.colors.danger};
    --bs-btn-color: ${theme.colors.white};
    --bs-btn-border-color: ${theme.colors.danger};   
    --bs-btn-hover-color: ${theme.colors.white};
    --bs-btn-hover-bg: ${darken(30,theme.colors.danger)};
    --bs-btn-hover-border-color: ${darken(40,theme.colors.danger)};
    --bs-btn-focus-shadow-rgb: 0, 0, 0;
    --bs-btn-active-color: ${theme.colors.white};
    --bs-btn-active-bg: ${darken(40,theme.colors.danger)};
    --bs-btn-active-border-color: ${darken(50,theme.colors.danger)};
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: ${theme.colors.white};
    --bs-btn-disabled-bg: ${theme.colors.danger};
    --bs-btn-disabled-border-color: ${theme.colors.danger};
    --bs-gradient: none;
  }

  &.btn-outline-danger {
    --bs-btn-color: ${theme.colors.danger};
    --bs-btn-bg: transparent;
  }

  &.btn-success,
  &.btn-outline-success {
    --bs-btn-bg: ${theme.colors.success};
    --bs-btn-color: ${theme.colors.white};
    --bs-btn-border-color: ${theme.colors.success};   
    --bs-btn-hover-color: ${theme.colors.white};
    --bs-btn-hover-bg: ${darken(30,theme.colors.success)};
    --bs-btn-hover-border-color: ${darken(40,theme.colors.success)};
    --bs-btn-focus-shadow-rgb: 0, 0, 0;
    --bs-btn-active-color: ${theme.colors.white};
    --bs-btn-active-bg: ${darken(40,theme.colors.success)};
    --bs-btn-active-border-color: ${darken(50,theme.colors.success)};
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: ${theme.colors.white};
    --bs-btn-disabled-bg: ${theme.colors.success};
    --bs-btn-disabled-border-color: ${theme.colors.success};
    --bs-gradient: none;
  }

  &.btn-outline-success {
    --bs-btn-color: ${theme.colors.success};
    --bs-btn-bg: transparent;
  }

  &.btn-warning,
  &.btn-outline-warning {
    --bs-btn-bg: ${theme.colors.warning};
    --bs-btn-color: ${theme.colors.white};
    --bs-btn-border-color: ${theme.colors.warning};   
    --bs-btn-hover-color: ${theme.colors.white};
    --bs-btn-hover-bg: ${darken(30,theme.colors.warning)};
    --bs-btn-hover-border-color: ${darken(40,theme.colors.warning)};
    --bs-btn-focus-shadow-rgb: 0, 0, 0;
    --bs-btn-active-color: ${theme.colors.white};
    --bs-btn-active-bg: ${darken(40,theme.colors.warning)};
    --bs-btn-active-border-color: ${darken(50,theme.colors.warning)};
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: ${theme.colors.white};
    --bs-btn-disabled-bg: ${theme.colors.warning};
    --bs-btn-disabled-border-color: ${theme.colors.warning};
    --bs-gradient: none;
  }

  &.btn-outline-warning {
    --bs-btn-color: ${theme.colors.warning};
    --bs-btn-bg: transparent;
  }

  ${(props) => props?.$styles}
`;
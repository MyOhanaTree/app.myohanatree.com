import styled from "styled-components";
import { themevals } from "theme/themevals";

interface CustomProps {
  $customStyles?: any;
  $disabled?: boolean;
}

export const CheckboxWrapper = styled.div<CustomProps>`
  --form-check-bg: #fff;
  --form-check-bg-image: none;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  margin-bottom: 20px;
  /* cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")}; */

  label {
    cursor: pointer;
    user-select: none;
  }

  input {
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    margin-top: 0.25em;
    vertical-align: top;
    appearance: none;
    background-color: var(--form-check-bg);
    background-image: var(--form-check-bg-image);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 1px solid #dee2e6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;

    border-radius: 0.25em;
    cursor: pointer;
    border-color: ${themevals.colors.base_300};
  }

  input:focus {
    box-shadow: none !important;
    border-color: ${themevals.colors.base_300};
  }

  input:disabled {
    pointer-events: none;
    cursor: not-allowed;
    background-color: #e9ecef;
  }

  input:active {
    filter: brightness(90%);
  }

  input:checked {
    --form-check-bg-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 20 20%27%3e%3cpath fill=%27none%27 stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%273%27 d=%27m6 10 3 3 6-6%27/%3e%3c/svg%3e");
    background-color: ${themevals.colors.body};
    border-color: ${themevals.colors.body} !important;
  }
  ${(props) => props.$customStyles}
`;

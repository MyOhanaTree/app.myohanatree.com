import styled from "styled-components";

interface CustomProps {
  disabled?: boolean;
  $active?: boolean;
  $submitting?: boolean;
  $customStyles?: any;
  $errors?: any;
}


export const InputWrap = styled.div<CustomProps>`
  display: flex;
  flex-direction: column;
  position:relative;  
  max-width: 100%;    
  margin-bottom: 20px;
  input {
    border: none!important;
    padding: 0!important;
    font-size: 1rem;
    flex-grow: 1;
  }
  ${(props) => props.disabled ? `opacity: .5` : ``}
  ${(props) => props.$customStyles}
`;

export const labelStyles = {
  marginBottom: 0,
  display: "flex",
  fontSize: 14,
  fontWeight: 500
};

export const LabelWrapper = styled.div<CustomProps>`
  margin-bottom: 10px;
  display: flex;
  width: 100%;
  label {    
    color: ${props => props.theme.colors.body};
    ${(props) => props.disabled ? `opacity: .5` : ``}
    ${labelStyles}
  }
  small {
    font-style: italic; font-size: .75rem; color: ${(props) => props.theme.colors.ltgrey};
  }
`;

export const DropDownWrap = styled.div`
  position: relative;
`;

export const InputDropdownWrap = styled.div<CustomProps>`  
  display: ${(props) => props.$active ? "block" : "none"};
  position: absolute;
  top: 100%; 
  right: 0;
  z-index: 1032;  
`;

export const InputDropdown = styled.div`      
  display: flex;
  gap: 36px;
  padding: 24px 12px;
  border-radius: 5px;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 12px 0px rgba(113, 125, 150, 0.05);
  border: 1px solid ${(props) => props.theme.colors.base_300}; 
  margin-top: 10px;
  & .react-datepicker {min-width: 250px; position: relative;}
  & .react-datepicker .react-datepicker__triangle, & .react-datepicker .react-datepicker__aria-live {display: none;}
  & .react-datepicker .react-datepicker__navigation {align-items: center; background: none; display: flex; justify-content: center; text-align: center; cursor: pointer; position: absolute; top: 2px; padding: 0; border: none; z-index: 1; text-indent: -999em; overflow: hidden; right: 0;}    
  & .react-datepicker .react-datepicker__navigation.react-datepicker__navigation--previous {right: 20px;}
  & .react-datepicker .react-datepicker__navigation.react-datepicker__navigation--next {right: 0;}
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon {position: relative; height: 20px; width: 20px;}
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon::before {border-color: ${(props) => props.theme.colors.base_400}; border-style: solid; border-width: 2px 2px 0 0; content: ""; display: block; height: 8px; width: 8px; position: absolute; top: 6px; left: 8px; transform: rotate(45deg);}
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon-double::after {border-color: ${(props) => props.theme.colors.base_400}; border-style: solid; border-width: 2px 2px 0 0; content: ""; display: block; height: 8px; width: 8px; position: absolute; top: 6px; left: 2px; transform: rotate(45deg);}
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon:hover::before,
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon:hover::after {border-color: ${(props) => props.theme.colors.base_800};}
  & .react-datepicker .react-datepicker__navigation .react-datepicker__navigation-icon--previous {transform: rotate(180deg);}
     & .react-datepicker .react-datepicker__header .react-datepicker__custom-year-selector {display: flex; justify-content: center; gap: 5px;}
  & .react-datepicker .react-datepicker__header {display: flex; flex: no-wrap; flex-direction: column;}
  & .react-datepicker .react-datepicker__header .react-datepicker__current-month {flex: 1;  color: ${(props) => props.theme.colors.base_800}; font-size: 1rem; margin-bottom: 1rem; padding: 0 5px; font-weight: 600;}
  & .react-datepicker .react-datepicker__header .react-datepicker__day-names {display: flex; flex: no-wrap; text-align: center; color: ${(props) => props.theme.colors.base_500}; margin-bottom: 5px;} 
  & .react-datepicker .react-datepicker__header .react-datepicker__day-names .react-datepicker__day-name {flex: 1 1; width: 36px; height: 36px;}
  & .react-datepicker .react-datepicker__month {display: flex; flex: no-wrap; flex-direction: column;}
  & .react-datepicker .react-datepicker__month .react-datepicker__week {display: flex; flex: no-wrap; text-align: center;}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day {position: relative; z-index: 1; flex: 1; align-self: center; font-weight: 500; border-radius: 50%; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--outside-month {color: ${(props) => props.theme.colors.base_400}}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--selected {background-color: ${(props) => props.theme.colors.base_300}; color: ${(props) => props.theme.colors.white};}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--selected:before {content: ""; position: absolute; top: 4px; left: 4px; right: 4px; bottom: 4px; z-index: -1; border-radius: 50%; background-color: ${(props) => props.theme.colors.base_800}}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--disabled {color: ${(props) => props.theme.colors.base_400};}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--today {background-color: ${(props) => props.theme.colors.base_200};}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--in-range {background-color: ${(props) => props.theme.colors.base_300}; color: ${(props) => props.theme.colors.body}; border-radius: 0;}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--range-start {border-radius: 50% 0 0 50%; background-color: ${(props) => props.theme.colors.base_300}; color: ${(props) => props.theme.colors.white}}
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--range-end {border-radius: 0 50% 50% 0; background-color: ${(props) => props.theme.colors.base_300}; color: ${(props) => props.theme.colors.white}}  
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--range-start.react-datepicker__day--range-end {border-radius: 50%;}  
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--range-start:before,
  & .react-datepicker .react-datepicker__month .react-datepicker__week .react-datepicker__day.react-datepicker__day--range-end:before {content: ""; position: absolute; top: 4px; left: 4px; right: 4px; bottom: 4px; z-index: -1; border-radius: 50%; background-color: ${(props) => props.theme.colors.base_800}}
  & .react-datepicker-datesets {display: flex; flex-direction: column; white-space: nowrap; gap: 2px; width: 100%;}
  & .react-datepicker-datesets .react-datepicker-datesets-set {flex: 0 1; display: grid; align-content: center; cursor: pointer; padding: 5px 12px; border-radius: 4px;}
  & .react-datepicker-datesets .react-datepicker-datesets-set.active,
  & .react-datepicker-datesets .react-datepicker-datesets-set:hover {background-color: ${(props) => props.theme.colors.base_300}; color: ${(props) => props.theme.colors.base_800}}
  & .react-datepicker-datesets .react-datepicker-datesets-set.react-datepicker-datesets-reset {margin-top: auto; color: ${(props) => props.theme.colors.base_500};}
  & .react-datepicker .react-datepicker__time-list {padding: 0; list-style-type: none; max-height: 50px; overflow: auto;}
  & .react-datepicker .react-datepicker__time-list .react-datepicker__time-list-item:hover {background-color: ${(props) => props.theme.colors.base_300};}
  & .react-datepicker .react-datepicker__time-list .react-datepicker__time-list-item--selected {background-color: ${(props) => props.theme.colors.base_800}!important; color: ${(props) => props.theme.colors.white}!important;}

  @media (max-width: 991px){
    flex-wrap: wrap-reverse;
  }
`;

export const InputValue = styled.div<CustomProps>` 
  display: flex;
  justify-content: start;
  align-items: center;
  height: 44px;
  border-radius: 5px;
  padding-left: 10px;
  padding-right: 10px;
  min-height:44px;
  min-width: 175px; 
  max-width: 100%;
  background: ${props => props.theme.colors.white};
  border: 1px solid ${(props) => props.$errors ? props.theme.colors.danger + "!important" : props.theme.colors.base_300};
  color: ${props => props.theme.colors.body};
  cursor: pointer;
  gap: 13px;
  & svg {
    height: 15px;
    width: 15px;    
  }
  & span {
    flex: 1 1 auto;
    white-space: nowrap;
    overflow: auto;    
    cursor: text;
  }
  & span::-webkit-scrollbar {
    display: none;
    width: 0;
    heihgt: 0;
    background-color: transparent;
  }
  & span::-webkit-scrollbar-thumb {
    display: none;
    background-color: transparent;
  }
`;


export const Error = styled.div` 
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;  
  color:${(props) => props.theme.colors.danger};
  margin-top:2px;
  font-size:14px;
  
`
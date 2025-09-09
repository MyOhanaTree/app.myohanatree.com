import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Flex, Heading, Text, useThemeUI } from "theme-ui";

import { LoginFooterStyles, FooterCreds, BackButton } from "./styled";

import LoginCard from "@/components/ui/LoginCard";
import { useToast } from "@/components/toast";
import PasswordInput from "@/components/forms/PasswordInput";
import LoadingButton from "@/components/ui/LoadingButton";
import axios from "axios";
import { GoArrowLeft } from "react-icons/go";

const ResetPassword = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [validForm, setValidForm] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [responseErrors] = useState<any>(false);

  const _onSubmit = async (values: any) => {
    const token = searchParams.get("token");

    const { data: res } = await axios.post("/auth/reset-password", {
      token:token,
      password: values.password,    
      passwordConfirm: values.passwordConfirm,    
    }).catch((err) => ({ data: err?.response?.data }));


    if(res?.success){
      toast.add(res.message, "var(--theme-ui-colors-green)");
      navigate("/login");
    } else {      
      setValidForm(false);      
      setErrorMessage(res?.error?.message || "Error resetting password.");      
    }    
  };
  
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const ResetSchema = Yup.object().shape({
    password: Yup.string().required("This field is required.").matches(passwordRules, { message: "Please create a stronger password" }),
    passwordConfirm: Yup.string().oneOf([Yup.ref("password"), undefined], "Passwords don't match.").required("Confirm Password is required."),
  });

  return (
    <LoginCard>
      <Flex sx={{flexDirection:"column"}}>        
        {validForm && (<>
          <Heading as="h2" sx={{ color: theme?.colors?.base_800, textAlign: "center", marginTop: "30px" }}>Password Reset</Heading>          
          <Text sx={{ color: theme?.colors?.body, textAlign: "center"}}>
            Enter and confirm your new password.
          </Text>
          <Text sx={{ color: theme?.colors?.base_600, textAlign: "center"}}>Passwords must be a minimum of 5 characters, include 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.</Text>
        </>)}
        {!validForm && errorMessage && <>          
          <Heading as="h2" sx={{ color: theme?.colors?.body, textAlign: "center", marginTop: "30px" }}>Password Reset Link Error</Heading>          
          <Text sx={{ color: theme?.colors?.danger, textAlign: "center", fontWeight: "600"}}>{errorMessage}</Text>
        </>}
        {validForm && (          
        <Formik initialValues={{ password: "", passwordConfirm: "" }} onSubmit={_onSubmit} validationSchema={ResetSchema}>
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
            return (
              <Form noValidate autoComplete="off">
                <PasswordInput 
                  name="password" 
                  label="New Password" 
                  autoComplete="new-password" 
                  value={values.password || ""}
                  onChange={(val: any) => setFieldValue("password",val)}
                  $errors={errors.password && submitCount > 0 ? errors.password : null} 
                  $responseErrors={responseErrors}
                />
                <PasswordInput
                  name="passwordConfirm"
                  label="Confirm New Password"
                  autoComplete="new-password"
                  value={values.passwordConfirm || ""}
                  onChange={(val: any) => setFieldValue("passwordConfirm",val)}
                  $errors={errors.passwordConfirm && submitCount > 0 ? errors.passwordConfirm : null}
                />
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting}
                  $loading={isSubmitting}
                  sx={{width:"100%",margin : "10px auto 0px auto"}}
                >
                  Save New Password                  
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
        )}
        <BackButton>
          <Link to={validForm ? "/login" : "/forgot-password"}>                
            <GoArrowLeft />                
            <span>{validForm ? "Back to Login" : "Send New Password Reset"}</span>
          </Link>
        </BackButton>        
        <LoginFooterStyles>          
          <FooterCreds>© {import.meta.env.VITE_REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>        
        </LoginFooterStyles>
      </Flex>
    </LoginCard>
  );
};

export default ResetPassword;

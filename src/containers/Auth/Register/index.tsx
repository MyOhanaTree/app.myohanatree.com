import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { Box, Divider, Flex, Heading, Text, useThemeUI } from "theme-ui";
import * as Yup from "yup";

import { FooterCreds, RegisterFooterStyles, BackButton } from "./styled";

import LoadingButton from "@/components/ui/LoadingButton";
import PasswordInput from "@/components/forms/PasswordInput";
import LoginCard from "@/components/ui/LoginCard";
import { useToast } from "@/components/toast";
import { BackArrowIcon } from "@/components/svg";
import axios from "axios";

const Register = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [validForm, setValidForm] = useState<boolean>(true);
  const [responseErrors, setResponseErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<any>("");

  const _onSubmit = async (values: any) => {
    const token = searchParams.get("token");
		const { data: res } = await axios.post("/auth/register",{ 
      token : token || "", 
      password : values.password, 
      passwordConfirm: values.passwordConfirm, 
    }).catch((err) => ({ data: err?.response?.data }));


    if (res?.success) {      
      setSuccessMessage("Success! You are officially registered.");
    } else {      
      toast.add(res?.error?.message ?? "Error finishing registration, please try again later" , "var(--theme-ui-colors-red)");
      setResponseErrors(true);
    }
  };

  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.  
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("This field is required."),
    password: Yup.string().required("This field is required.").matches(passwordRules, { message: "Please create a stronger password" }),
    passwordConfirm: Yup.string().oneOf([Yup.ref("password"), undefined], "Passwords don't match.").required("Confirm Password is required."),
  });

  useEffect(() => { 
    const token = searchParams.get("token");
    if (!token) {
      setValidForm(false);
      setErrorMessage("Invalid Link.");
    }
  }, [searchParams]);

  return (
    <LoginCard>
      <Flex sx={{flexDirection:"column"}}>           
        {!validForm && (<>
          <Heading as="h2" sx={{ color: theme?.colors?.base_800, textAlign: "center", marginTop: "30px" }}>Registration Link Error</Heading>                                                        
          {errorMessage && (<Text sx={{ color: theme?.colors?.danger, textAlign: "center", fontWeight: "600"}}>{errorMessage}</Text>)}          
        </>)}          
        {validForm && (
          <>
          {successMessage && (
            <>
              <Heading as="h2" sx={{ color: theme?.colors?.base_800, textAlign: "center", marginTop: "30px" }}>Registration</Heading>                                                        
              <Text sx={{textAlign: "center"}}>
                {successMessage}
              </Text>              
              <BackButton>
                <Link to={"/login"}>
                  <BackArrowIcon fill={theme?.colors?.body} width={"20px"} height={"auto"} mr={"10px"} />                      
                  <span>Back to Login</span>
                </Link>
              </BackButton>              
            </>
          )}
          {!successMessage && (
            <>     
              <Heading as="h2" sx={{ color: theme?.colors?.base_800, textAlign: "center", marginTop: "30px" }}>Registration</Heading>                                                        
                             
              <Text sx={{color: theme?.colors?.base_600, textAlign: "center", fontSize: "75rem"}}>Passwords must be a minimum of 5 characters, include 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.</Text>            
              <Formik initialValues={{ password: "", passwordConfirm: "" }} onSubmit={_onSubmit} validationSchema={UserSchema} enableReinitialize={true}>
                {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
                  return (
                    <Form noValidate autoComplete="off">
                      <PasswordInput 
                        name="password" 
                        label="Password" 
                        value={values.password || ""}
                        onChange={(val: any) => setFieldValue("password",val)}
                        autoComplete="new-password" 
                        $errors={errors.password && submitCount > 0 ? errors.password : null} 
                        $responseErrors={responseErrors}
                      />
                      <PasswordInput
                        name="passwordConfirm"
                        label="Confirm Password"
                        value={values.passwordConfirm || ""}
                        onChange={(val: any) => setFieldValue("passwordConfirm",val)}
                        $errors={errors.passwordConfirm && submitCount > 0 ? errors.passwordConfirm : null}
                      />
                      <LoadingButton
                        type="submit"
                        disabled={isSubmitting}
                        $loading={isSubmitting}
                        sx={{width : "100%", margin : "10px auto 0px auto"}}
                      >
                        Register
                      </LoadingButton>
                    </Form>
                  );
                }}
              </Formik>
            </>          
          )}
          </>
        )}     
        <RegisterFooterStyles>          
          <FooterCreds>© {import.meta.env.VITE_REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>          
        </RegisterFooterStyles>
      </Flex>
    </LoginCard>
  );
};

export default Register;

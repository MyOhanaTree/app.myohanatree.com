import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Flex, Heading, Text, useThemeUI } from "theme-ui";

import { LoginFooterStyles, FooterCreds, BackButton } from "./styled";

import LoginCard from "@/components/ui/LoginCard";
import TextInput from "@/components/forms/TextInput";
import LoadingButton from "@/components/ui/LoadingButton";
import { useToast } from "@/components/toast";
import axios from "axios";
import { GoArrowLeft } from "react-icons/go";


const ForgotPassword = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const toast = useToast();
  const navigate = useNavigate();
  const [responseErrors,setResponseErrors] = useState(false);

  const _onSubmit = async (values: any) => {
    const { data: res} = await axios.post("/auth/forgot-password", {
      email: values.email
    }).catch((err) => ({ data : { success : false}}));
    
    if(res?.success){
      toast.add(res?.message ?? "Email sent to reset password","var(--theme-ui-colors-green)");
      navigate("/login");
    }else{        
      toast.add(res?.message ?? "Internal Error","var(--theme-ui-colors-red)");
      setResponseErrors(true);
    }
  };

  const ResetSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("This field is required."),
  });

  return (
    <LoginCard>
      <Flex sx={{flexDirection:"column"}}>        
        <Heading as="h2" sx={{ color: theme?.colors?.base_800, textAlign: "center", marginTop: "30px" }}>Forgot Password?</Heading>
        <Text sx={{color: theme?.colors?.body, textAlign: "center"}}>
          No worries. We will send you reset instructions.
        </Text>        
        <Formik initialValues={{ email: "" }} onSubmit={_onSubmit} validationSchema={ResetSchema}>
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
            return (
              <Form noValidate autoComplete="off">
                <TextInput 
                  type="email"
                  name="email" 
                  label="Email" 
                  value={values.email}
                  onChange={(val: any) => setFieldValue("email",val)}
                  $errors={errors.email && submitCount > 0 ? errors.email : null} 
                  $responseErrors={responseErrors}
                />
                <LoadingButton                      
                  type="submit"                      
                  disabled={isSubmitting}
                  $loading={isSubmitting}
                >
                  Reset Password
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
        <BackButton>
          <Link to={"/login"}>
            <GoArrowLeft />
            <span>Back to Login</span>
          </Link>
        </BackButton>      
        <LoginFooterStyles>          
          <FooterCreds>© {import.meta.env.VITE_REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>          
        </LoginFooterStyles>
      </Flex>
    </LoginCard>
  );
};

export default ForgotPassword;

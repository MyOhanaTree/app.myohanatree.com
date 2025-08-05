import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Divider, Flex, useThemeUI } from "theme-ui";

import { LoginFooterStyles, FooterCreds, BackButton } from "./styled";

import LoginCard from "@/components/ui/LoginCard";
import H2 from "@/components/typography/H2";
import P from "@/components/typography/P";
import TextInput from "@/components/forms/TextInput";
import LoadingButton from "@/components/ui/LoadingButton";
import { BackArrowIcon } from "@/components/svg";
import { useToast } from "@/components/toast";
import axios from "axios";


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
      toast.add(res?.message,"var(--theme-ui-colors-green)");
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
        <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>
          Forgot Password?
        </H2>
        <P color={theme?.colors?.body} align={"center"}>
          No worries. We will send you reset instructions.
        </P>        
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
            <BackArrowIcon fill={theme?.colors?.body} width={"20px"} height={"auto"} margin={"0 10px 0 0"} />
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

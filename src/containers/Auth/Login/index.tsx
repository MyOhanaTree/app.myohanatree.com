import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { Box, Divider, Flex, useThemeUI } from "theme-ui";
import * as Yup from "yup";
import axios from "axios";

import { FooterCreds, ForgotPasswordLink, LoginFooterStyles } from "./styled";

import { doLogin } from "api/Auth";
import UserContext from "context/User";

import AdminLogo from "components/img/AdminLogo";
import TextInput from "components/forms/TextInput";
import LoadingButton from "components/ui/LoadingButton";
import PasswordInput from "components/forms/PasswordInput";
import Checkbox from "components/forms/Checkbox";
import LoginCard from "components/ui/LoginCard";
import H2 from "components/typography/H2";
import { useToast } from "components/toast";



const Login = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const { setUser } = useContext<any>(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const redirectUrl = queryParams.get('redirect');

  const toast = useToast();

  const [responseErrors, setResponseErrors] = useState(false);

  const _onSubmit = async (values: any, actions: any) => {
    localStorage.removeItem("user");
    const res = await doLogin({ email: values.email, password: values.password, rememberMe : values.rememberMe ? values.rememberMe : false });

    if (res?.success) {      
      setUser({ ...res?.user });
      localStorage.setItem("user", JSON.stringify({user_id : res.user.id, tokens : {...res.tokens}}));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.tokens.accessToken}`;
      navigate(redirectUrl || "/");
    } else {
      localStorage.removeItem("user");
      toast.add(res?.message ? res.message : "Error loging in, please try again later" , "var(--theme-ui-colors-red)");
      setResponseErrors(true);
      setUser(null);      
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("This field is required."),
    password: Yup.string().required("This field is required."),
  });

  return (
    <LoginCard>
      <Flex sx={{flexDirection:"column"}}>        
        <Box sx={{ textAlign : "center"}}>            
          <AdminLogo alt="" customStyles={{maxWidth: "300px", margin: "auto"}}/>   
        </Box>        
        <Divider />
        <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"} mb={"30px"}>Login</H2>
        <Formik initialValues={{ email: "", password: "" }} onSubmit={_onSubmit} validationSchema={LoginSchema}>
          {({ isSubmitting, errors, submitCount, values, setFieldValue }) => {
            return (
              <Form noValidate autoComplete="off">
                <TextInput 
                  type="email"
                  name="email" 
                  label="Email" 
                  value={values.email || ""}
                  onChange={(val: any) => setFieldValue("email",val)}
                  $errors={errors.email && submitCount > 0 ? errors.email : null} 
                  $responseErrors={responseErrors}
                />
                <PasswordInput 
                  name="password" 
                  label="Password" 
                  value={values.password || ""}
                  onChange={(val: any) => setFieldValue("password",val)}
                  $errors={errors.password && submitCount > 0 ? errors.password : null} 
                  $responseErrors={responseErrors}
                />
                <Checkbox 
                  label="Remember Me" 
                  name="rememberMe" 
                  checked={values.rememberMe}
                  onChange={(val: any) => { setFieldValue("rememberMe",val);}}
                />
                <LoadingButton
                  type="submit"
                  disabled={isSubmitting}           
                  $loading={isSubmitting}           
                  sx={{width:"100%",margin : "40px auto 0px auto"}}
                >
                  Login                  
                </LoadingButton>
              </Form>
            );
          }}
        </Formik>
        <ForgotPasswordLink>
          <Link to={"/forgot-password"}>Forgot password?</Link>
        </ForgotPasswordLink>      
        <LoginFooterStyles>
          <FooterCreds>© {process.env.REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>        
        </LoginFooterStyles>          
      </Flex>
    </LoginCard>
  );
};

export default Login;
import React, { useState, useContext, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { useThemeUI } from "theme-ui";
import * as Yup from "yup";
import axios from "axios";

import { LoginFooterStyles, FooterCreds, ForgotPasswordLink } from "./styled";

import AdminLogo from "components/img/AdminLogo";
import TextInput from "components/forms/TextInput";
import BasicButton from "components/forms/BasicButton";
import PasswordInput from "components/forms/PasswordInput";
import Checkbox from "components/forms/Checkbox";
import LoginCard from "components/ui/LoginCard";
import H2 from "components/typography/H2";
import { useToast } from "components/toast";

import { doLogin } from "api/Auth";
import UserContext from "context/User";

const Login = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const { setUser } = useContext<any>(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [responseErrors, setResponseErrors] = useState(false);

  const _onSubmit = async (values: any, actions: any) => {
    localStorage.removeItem("user");
    const res = await doLogin({ email: values.email, password: values.password, rememberMe : values.rememberMe ? values.rememberMe : false });

    if (res?.success) {      
      setUser({ ...res?.user });
      localStorage.setItem("user", JSON.stringify({user_id : res.user.id, tokens : {...res.tokens}}));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.tokens.accessToken}`;
      navigate("/");
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

  useEffect(() => { 
    document.title = process.env.REACT_APP_NAME + " | Login"; 
  }, []);

  return (
    <LoginCard>
      <Container style={{display: "flex",flexDirection:"column"}}>
      <Row>
          <Col className="text-center">            
            <AdminLogo alt="" customStyles={{maxWidth: "300px", margin: "auto"}}/>                     
          </Col>
        </Row>
        <Row>
          <Col>
            <hr />
            <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"} mb={"30px"}>
              Login
            </H2>
            <Formik initialValues={{ email: "", password: "" }} onSubmit={_onSubmit} validationSchema={LoginSchema}>
              {({ isSubmitting, errors, submitCount, values, setFieldValue }) => {
                return (
                  <Form noValidate autoComplete="off">
                    <TextInput 
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
                    <BasicButton
                      type="submit"
                      $submitting={isSubmitting}                      
                      styles={{width:"100%",margin : "40px auto 0px auto"}}
                    >Login</BasicButton>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col>
            <ForgotPasswordLink theme={theme}>
              <Link to={"/forgot-password"}>Forgot password?</Link>
            </ForgotPasswordLink>
          </Col>
        </Row>
        <Row style={LoginFooterStyles}>
          <Col>
            <FooterCreds theme={theme}>© {process.env.REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>
          </Col>
        </Row>
      </Container>
    </LoginCard>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link, useSearchParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { useThemeUI } from "theme-ui";
import * as Yup from "yup";

import { FooterCreds, RegisterFooterStyles, BackButton } from "./styled";

import AdminLogo from "components/img/AdminLogo";
import BasicButton from "components/forms/BasicButton";
import PasswordInput from "components/forms/PasswordInput";
import LoginCard from "components/ui/LoginCard";
import H2 from "components/typography/H2";
import { useToast } from "components/toast";

import { completeRegistration } from "api/Auth";
import Subtext from "components/typography/Subtext";
import P from "components/typography/P";
import TextInput from "components/forms/TextInput";
import { BackArrowIcon } from "components/svg";

const Register = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [regEmail,setEmail] = useState(searchParams.get("email"));
  const [validForm, setValidForm] = useState<boolean>(true);
  const [responseErrors, setResponseErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<any>("");

  const _onSubmit = async (values: any, actions: any) => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");
    const res = await completeRegistration({ token : token || "", userId :  userId || "", password : values.password, passwordConfirm: values.passwordConfirm, email : values.email});
    if (res?.success) {      
      setSuccessMessage("Success! You are officially registered.");
    } else {      
      toast.add(res?.message ? res.message : "Error finishing registration, please try again later" , "var(--theme-ui-colors-red)");
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
    document.title = process.env.REACT_APP_NAME + " | Registration"; 

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");  
    setEmail(searchParams.get("email"));
    if (!token || !userId) {
      setValidForm(false);
      setErrorMessage("Invalid Link.");
    }
  }, [searchParams]);

  return (
    <LoginCard>
      <Container style={{display: "flex",flexDirection:"column"}}>
        <Row>
          <Col className="text-center">            
            <AdminLogo alt="" customStyles={{maxWidth: "300px", margin: "auto"}}/>
          </Col>
        </Row>         
        {!validForm && (
          <Row>
            <Col>
              <hr />     
              <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>   
                Registration Link Error    
              </H2>
              {errorMessage && (                            
                <P color={theme?.colors?.danger} align={"center"} fontWeight={"600"}>
                  {errorMessage}
                </P>            
              )}
            </Col>
          </Row>
        )}          
        {validForm && (
          <>
          {successMessage && (
            <>
              <Row>
                <Col>
                  <hr />
                  <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>
                    Registration
                  </H2>                               
                </Col>
              </Row>
              <Row>
                <P align={"center"}>
                  {successMessage}
                </P>
              </Row>
              <Row>
                <Col>
                  <BackButton theme={theme}>
                    <Link to={"/login"}>
                      <BackArrowIcon fill={theme?.colors?.body} width={"20px"} height={"auto"} mr={"10px"} />                      
                      <span>Back to Login</span>
                    </Link>
                  </BackButton>
                </Col>
              </Row>
            </>
          )}
          {!successMessage && (
            <>
              <Row>
                <Col>
                  <hr />
                  <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>
                    Registration
                  </H2>                               
                  <Subtext color={theme?.colors?.mdgrey} align="center">Passwords must be a minimum of 5 characters, include 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.</Subtext>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Formik initialValues={{ email: regEmail?.replace(" ","+"), password: "", passwordConfirm: "" }} onSubmit={_onSubmit} validationSchema={UserSchema} enableReinitialize={true}>
                    {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
                      return (
                        <Form noValidate autoComplete="off">
                          <TextInput 
                            type="email" 
                            name="email" 
                            label="Email" 
                            value={values.email}
                            onChange={(val: any) => setFieldValue("email",val)}
                            readonly={true} 
                            autoComplete="off" 
                            $errors={errors.email && submitCount > 0 ? errors.email : null} 
                            $responseErrors={responseErrors}
                          />
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
                          <BasicButton                            
                            type="submit"
                            $submitting={isSubmitting}
                            styles={{width : "100%", margin : "10px auto 0px auto"}}
                          >Register</BasicButton>
                        </Form>
                      );
                    }}
                  </Formik>
                </Col>
              </Row>  
            </>          
          )}
          </>
        )}     
        <Row style={RegisterFooterStyles}>
          <Col>
            <FooterCreds theme={theme}>© {process.env.REACT_APP_NAME}, 2023 & beyond. All Rights Reserved</FooterCreds>
          </Col>
        </Row>
      </Container>
    </LoginCard>
  );
};

export default Register;

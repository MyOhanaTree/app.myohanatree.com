import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { Container, Row, Col } from "reactstrap";
import * as Yup from "yup";
import { useThemeUI } from "theme-ui";

import { LoginFooterStyles, FooterCreds, BackButton } from "./styled";

import AdminLogo from "components/img/AdminLogo";
import LoginCard from "components/ui/LoginCard";
import H2 from "components/typography/H2";
import P from "components/typography/P";
import BasicButton from "components/forms/BasicButton";
import { useToast } from "components/toast";
import Subtext from "components/typography/Subtext";
import PasswordInput from "components/forms/PasswordInput";
import { BackArrowIcon } from "components/svg";

import { resetPassword, checkPasswordResetToken } from "api/Auth";

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
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");
    const res = await resetPassword({ token : token?.toString() || "" , userId : userId?.toString() || "" , password : values.password, passwordConfirm : values.passwordConfirm });
    if(res?.success){
      toast.add(res.message, "var(--theme-ui-colors-green)");
      navigate("/login");
    } else {      
      setValidForm(false);      
      setErrorMessage(res?.message || "Error resetting password.");      
    }    
  };
  
  // min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
  const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
  const ResetSchema = Yup.object().shape({
    password: Yup.string().required("This field is required.").matches(passwordRules, { message: "Please create a stronger password" }),
    passwordConfirm: Yup.string().oneOf([Yup.ref("password"), undefined], "Passwords don't match.").required("Confirm Password is required."),
  });

  useEffect(() => { 
    document.title = process.env.REACT_APP_NAME + " | Reset Password";
    const checkToken = async () => {
      const token = searchParams.get("token");
      const userId = searchParams.get("userId");
  
      if (!token || !userId) {
        setValidForm(false);
        setErrorMessage("Password Reset Link is invalid.");
      } else {
        const res = await checkPasswordResetToken({ token, userId });
        if(res.success){
          setValidForm(true);
        }else{
          setValidForm(false);
          setErrorMessage(res.message);
        }
      }
    };
    checkToken(); 
  }, [searchParams]);

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
            {validForm && (
              <>
                <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>
                  Password Reset
                </H2>
                <P color={theme?.colors?.body} align={"center"}>
                  Enter and confirm your new password.
                </P>
                <Subtext color={theme?.colors?.mdgrey} align="center">Passwords must be a minimum of 5 characters, include 1 uppercase letter, 1 lowercase letter, and 1 numeric digit.</Subtext>
              </>
            )}
            {!validForm && errorMessage &&
            <>
            <H2 color={theme?.colors?.body} align={"center"} mt={"30px"}>
              Password Reset Link Error
            </H2>
            <P color={theme?.colors?.danger} align={"center"} fontWeight={"600"}>
              {errorMessage}
            </P>
          </>
            }
          </Col>
        </Row>
        {validForm && (
          <Row>
            <Col>
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
                      <BasicButton                        
                        type="submit"
                        $submitting={isSubmitting}
                        styles={{width:"100%",margin : "10px auto 0px auto"}}
                      >Save New Password</BasicButton>
                    </Form>
                  );
                }}
              </Formik>
            </Col>
          </Row>
        )}
        <Row>
          <Col>
            <BackButton theme={theme}>
              <Link to={validForm ? "/login" : "/forgot-password"}>                
                <BackArrowIcon fill={theme?.colors?.body} width={"15px"} height={"auto"} mr={"10px"} />                
                <span>{validForm ? "Back to Login" : "Send New Password Reset"}</span>
              </Link>
            </BackButton>
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

export default ResetPassword;

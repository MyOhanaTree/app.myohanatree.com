import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useThemeUI } from "theme-ui";

import { LoginFooterStyles, FooterCreds, BackButton } from "./styled";

import LoginCard from "components/ui/LoginCard";
import AdminLogo from "components/img/AdminLogo";
import H2 from "components/typography/H2";
import P from "components/typography/P";
import TextInput from "components/forms/TextInput";
import BasicButton from "components/forms/BasicButton";
import { BackArrowIcon } from "components/svg";
import { useToast } from "components/toast";

import { sendForgotPassword } from "api/Auth";

const ForgotPassword = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const toast = useToast();
  const navigate = useNavigate();
  const [responseErrors,setResponseErrors] = useState(false);

  const _onSubmit = async (values: any, actions: any) => {
    try {
      const res = await sendForgotPassword({ email : values.email });   
      if(res?.success){
        toast.add(res?.message,"var(--theme-ui-colors-green)");
        navigate("/login");
      }else{        
        toast.add(res?.message,"var(--theme-ui-colors-red)");
        setResponseErrors(true);
      }
    } catch(err){      
      toast.add(err.message || "Error requesting password reset.","var(--theme-ui-colors-red)");
      setResponseErrors(true);
    }
  };

  const ResetSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("This field is required."),
  });


  useEffect(() => { 
    document.title = process.env.REACT_APP_NAME + " | Forgot Password"; 
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
            <H2 color={theme?.colors?.base_800} align={"center"} mt={"30px"}>
              Forgot Password?
            </H2>
            <P color={theme?.colors?.body} align={"center"}>
              No worries. We will send you reset instructions.
            </P>
          </Col>
        </Row>
        <Row>
          <Col>
            <Formik initialValues={{ email: "" }} onSubmit={_onSubmit} validationSchema={ResetSchema}>
              {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
                return (
                  <Form noValidate autoComplete="off">
                    <TextInput 
                      name="email" 
                      label="Email" 
                      value={values.email}
                      onChange={(val: any) => setFieldValue("email",val)}
                      $errors={errors.email && submitCount > 0 ? errors.email : null} 
                      $responseErrors={responseErrors}
                    />
                    <BasicButton                      
                      type="submit"                      
                      $submitting={isSubmitting}
                    >Reset Password</BasicButton>
                  </Form>
                );
              }}
            </Formik>
          </Col>
        </Row>
        <Row>
            <Col>
              <BackButton theme={theme}>
                <Link to={"/login"}>
                  <BackArrowIcon fill={theme?.colors?.body} width={"20px"} height={"auto"} margin={"0 10px 0 0"} />
                  <span>Back to Login</span>
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

export default ForgotPassword;

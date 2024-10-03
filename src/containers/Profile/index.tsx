import React, { useContext, useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import Header from "../../components/ui/Header";
import Page from "../../components/ui/Page";

import UserContext from "../../context/User";

import { profileUpdate } from "../../api/Auth";
import { useToast } from "../../components/toast";
import { useThemeUI } from "theme-ui";
import TextInput from "../../components/forms/TextInput";
import BasicButton from "../../components/forms/BasicButton";
import BasicCard from "../../components/ui/BasicCard";

import { Languages } from "../../helpers/Languages";
import SelectInput from "../../components/forms/SelectInput";
import StyledDiv from "../../components/ui/StyledDiv";


export const Profile = () => {
    const { user, setUser } = useContext<any>(UserContext);  

    const themeContext = useThemeUI();
    const { theme } = themeContext;
    const toast = useToast();  
    
    const _onSubmit = async (values: any) => {

      const vals = {
        firstName: values.firstName,
        lastName: values.lastName,
        metaData : { languages : (values.metaData.languages || []).join(",")}  
      }

      const res = await profileUpdate(vals);
      if(res?.success){
        setUser((old: any) => {
          return {...old,firstName: values.firstName,lastName: values.lastName}
        });
        toast.add(res.message, theme?.colors?.green);
      } else {         
        toast.add(res?.message || "Error updating profile.", theme?.colors?.danger);     
      }    
    };
    
    const profileSchema = Yup.object().shape({
      firstName: Yup.string().required("First Name is required."),
      lastName: Yup.string().required("Last Name is required."),
    });

    useEffect(() => {
      document.title = process.env.REACT_APP_NAME + " | Profile"
    }, []);

    return (
    <>
      <Header title="Profile"></Header>
      <Page> 
        <BasicCard>  
          {user && 
            <Formik initialValues={{...user, metaData : { languages : (((user?.data || [])?.find((i: any) => i.key === "languages"))?.value || "").split(",")}}} onSubmit={_onSubmit} validationSchema={profileSchema} >
              {({ isSubmitting, errors, values, submitCount, setFieldValue }) => { 
                return (                
                <Form noValidate autoComplete="off">
                  <StyledDiv styles={{display : "flex", gap : "15px"}}>                    
                    <div>First Name</div>
                    <StyledDiv styles={{flex : 1}}>
                      <TextInput 
                        name="firstName"  
                        value={values.firstName}
                        onChange={(val: any) => setFieldValue("firstName",val)}                      
                        $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}                                    
                      /> 
                    </StyledDiv>
                  </StyledDiv>
                  <StyledDiv styles={{display : "flex", gap : "15px"}}>                    
                    <div>Last Name</div>
                    <StyledDiv styles={{flex : 1}}>
                      <TextInput 
                        name="lastName"   
                        value={values.lastName}
                        onChange={(val: any) => setFieldValue("lastName",val)}                       
                        $errors={errors.lastName && submitCount > 0 ? errors.lastName : null}                                    
                      />                       
                    </StyledDiv>
                  </StyledDiv>                  
                  <hr />                                                                          
                  <div>  
                    <BasicButton 
                      styles={{margin : ".25rem 0 .25rem 0.625rem"}}                                       
                      type="submit" 
                      $submitting={isSubmitting}
                    >Update Profile</BasicButton>
                  </div>           
                </Form>
                );
              }}
            </Formik>     
          }   
        </BasicCard>   
      </Page>
    </>
  );
};

export default Profile;

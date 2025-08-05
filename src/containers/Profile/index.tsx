import React, { useContext, useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Box, useThemeUI } from "theme-ui";

import UserContext from "@/context/User";

import Page from "@/components/ui/Page";
import { useToast } from "@/components/toast";
import TextInput from "@/components/forms/TextInput";
import BasicCard from "@/components/ui/BasicCard";
import LoadingButton from "@/components/ui/LoadingButton";


export const Profile = () => {
    const { user, setUser } = useContext<any>(UserContext);  

    const themeContext = useThemeUI();
    const { theme } = themeContext;
    const toast = useToast();  
    
    const _onSubmit = async (values: any) => {
      
      const { data: res } = await axios.put("/auth/profile", {
        firstName: values.firstName,
        lastName: values.lastName,
      }).catch((err) => ({ data: err?.response?.data }));

      if(res?.success){
        setUser((old: any) => {
          return {...old,firstName: values.firstName,lastName: values.lastName}
        });
        toast.add(res.message, theme?.colors?.green);
      } else {         
        toast.add(res?.error?.message || "Error updating profile.", theme?.colors?.danger);     
      }    
    };
    
    const profileSchema = Yup.object().shape({
      firstName: Yup.string().required("First Name is required."),
      lastName: Yup.string().required("Last Name is required."),
    });

    useEffect(() => {
      document.title = import.meta.env.REACT_APP_NAME + " | Profile"
    }, []);

    return (
    <>
      <Page> 
        {user && 
          <Formik initialValues={{...user, metaData : { languages : (((user?.data || [])?.find((i: any) => i.key === "languages"))?.value || "").split(",")}}} onSubmit={_onSubmit} validationSchema={profileSchema} >
            {({ isSubmitting, errors, values, submitCount, setFieldValue }: any) => (                
              <Form noValidate autoComplete="off">
                <BasicCard>  
                  <Box sx={{display : "flex", gap : "15px"}}>                    
                    <div>First Name</div>
                    <Box sx={{flex : 1}}>
                      <TextInput 
                        name="firstName"  
                        value={values.firstName}
                        onChange={(val: any) => setFieldValue("firstName",val)}                      
                        $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}                                    
                      /> 
                    </Box>
                  </Box>
                  <Box sx={{display : "flex", gap : "15px"}}>                    
                    <div>Last Name</div>
                    <Box sx={{flex : 1}}>
                      <TextInput 
                        name="lastName"   
                        value={values.lastName}
                        onChange={(val: any) => setFieldValue("lastName",val)}                       
                        $errors={errors.lastName && submitCount > 0 ? errors.lastName : null}                                    
                      />                       
                    </Box>
                  </Box>  
                </BasicCard>                   
                <Box sx={{display: "flex", justifyContent: "flex-end"}}>  
                  <LoadingButton 
                    sx={{margin : ".25rem 0 .25rem 0.625rem"}}                                       
                    type="submit" 
                    $loading={isSubmitting}
                  >Update Profile</LoadingButton>
                </Box>           
              </Form>
            )}
          </Formik>     
        }   
      </Page>
    </>
  );
};

export default Profile;

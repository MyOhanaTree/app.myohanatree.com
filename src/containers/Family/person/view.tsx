import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, Flex, Spinner, Text } from "theme-ui";
import axios from "axios";

import Page from "@/components/ui/Page";
import { useToast } from "@/components/toast";
import TextInput from "@/components/forms/TextInput";
import LoadingButton from "@/components/ui/LoadingButton";
import BasicModal from "@/components/ui/BasicModal";
import BasicCard from "@/components/ui/BasicCard";
import SelectDate from "@/components/forms/SelectDate";
import moment from "moment-timezone";
import SelectSearch from "@/components/forms/SelectSearch";


export interface Person {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  birthDate: string;
  parents?: string[];  
  userId?: string
}

export default function PersonView() {
  const { id } = useParams();
  const toast = useToast();  
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);  
  const [person, setPerson] = useState<Person | null>(null);
  const [confirmModal, setConfirmModal] = useState<any>(null);
  const [showTab, setShowTab] = useState<string>("details");

  const getUsers = async ({ query = {}, controller = null, excludeInterceptor = false}: any) => {		
    const params: any = {params : query, excludeInterceptor}
    if(controller?.signal){
      params.signal = controller.signal
    }
    const res = await axios.get("/users", params).catch((err) => ({ data: { items: [] } }))
    return res?.data;
  };

  const getMembers = async ({ query = {}, controller = null, excludeInterceptor = false}: any) => {		
    const params: any = {params : query, excludeInterceptor}
    if(controller?.signal){
      params.signal = controller.signal
    }
    const res = await axios.get("/family/all", params).catch((err) => ({ data: { items: [] } }))
    return res?.data;
  };

  const loadInit = async () => {
    const { data } = await axios.get(`/family/${id}`).catch((err) => ({ data: err?.response?.data }));    

    if(data?.id){
      setPerson({...data, parents: (Array.isArray(data?.parents) && data?.parents?.map((p: any) => p.id)) });
    }
    setLoading(false);
  }
  
  const ValidateSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),
  }); 

  const updateMember = async (values: { firstName?: string; lastName?: string; birthDate?: string; deathDate?: string; parents?: string[], userId?: string }) => {
    const update: any = {...values};
    update.parents = values?.parents?.map((p) => ({id: p, type: "parent"}));

    const { data } = await axios.put(`/family/${id}`, update).catch((err) => ({ data: err?.response?.data }));    
    if(data?.id){ 
      toast.add("Updated","var(--theme-ui-colors-green)");      
    }else{
      toast.add(data?.error?.message ?? "Internal Error","var(--theme-ui-colors-red)");
    }    
  }

  useEffect(() => {    
    document.title = import.meta.env.VITE_REACT_APP_NAME
    loadInit();
  }, []);

  const confirmDelete = async () => { 
		const { data: res }: any = await axios.delete(`/family/${id}`).catch((err) => ({ data: err?.response?.data }));
    if(res?.success){       
      toast.add(res?.message ? res.message : "deleted","var(--theme-ui-colors-green)");
      navigate("/");
    }else{
      toast.add(res?.error?.message ?? "Error deleting","var(--theme-ui-colors-red)");
    }     
    setConfirmModal(false)          
  };  


  const submitDelete = async () => {    
    setConfirmModal(<BasicModal 
      title="Delete Member?" 
      actions={[<Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>,<Button variant="danger" onClick={confirmDelete}>Confirm</Button>]} 
      onCloseClick={() => setConfirmModal(false)}       
    >
      <Text>Are you sure you want to delete {person?.fullName}?</Text>
    </BasicModal>);
  }

  if(loading) return <Page><Spinner /></Page>

  return (
    <Page sx={{gap: "1rem"}}>   
      <Flex sx={{gap: "1rem"}}>
        <Button type="button" disabled={showTab === "details"} onClick={() => setShowTab("details")}>Details</Button>
        <Button type="button" disabled={showTab === "settings"} onClick={() => setShowTab("settings")}>Settings</Button>
      </Flex>
      {showTab === "details" && (
        <Formik initialValues={{...person }} onSubmit={updateMember} validationSchema={ValidateSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }: any) => { 
            return (                
            <Form noValidate autoComplete="off">
              <BasicCard>
                <TextInput
                  name="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={(val: any) => setFieldValue("firstName",val)}
                  $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}                                    
                />                   
                <TextInput 
                  name="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={(val: any) => setFieldValue("lastName",val)}
                  $errors={errors.lastName && submitCount > 0 ? errors.lastName : null}                                    
                /> 
                <SelectDate
                  name="birthDate"
                  label="Birth Date"
                  value={values.birthDate && moment(values.birthDate).unix()}
                  onChange={(val: any) => setFieldValue("birthDate",val && moment((val) * 1000).format('YYYY-MM-DD') )}
                  $errors={errors.birthDate && submitCount > 0 ? errors.birthDate : null}  
                />   
                <SelectDate
                  name="deathDate"
                  label="Death Date"
                  value={values.deathDate && moment(values.deathDate).unix()}
                  onChange={(val: any) => setFieldValue("deathDate",val && moment((val) * 1000).format('YYYY-MM-DD'))}
                  $errors={errors.deathDate && submitCount > 0 ? errors.deathDate : null}  
                /> 
                <SelectSearch
                  api={getMembers}
                  label="Parents"
                  value={values.parents}
                  onChange={(val: any) => setFieldValue("parents",val)}
                  $errors={errors.parents && submitCount > 0 ? errors.parents : null}  
                  keyLabel={["firstName","lastName"]}
                  labelDivider=" "                  
                  multiple
                />
              </BasicCard>
              <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px", justifyContent : "flex-end", width : "100%"}}>
                <Button 
                  variant="outline.danger"
                  type="button" 
                  onClick={submitDelete} 
                >Delete</Button>  
                <LoadingButton
                  type="submit" 
                  $loading={isSubmitting}
                >Update</LoadingButton>                
              </Box>                
            </Form>
            );
          }}
        </Formik>
      )}
      {showTab === "settings" && (
        <Formik initialValues={{...person }} onSubmit={updateMember} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }: any) => { 
            return (                
            <Form noValidate autoComplete="off">
              <BasicCard>
                <SelectSearch
                  api={getUsers}
                  label="Connected User"
                  value={values.userId}
                  onChange={(val: any) => setFieldValue("userId",val?.id)}
                  $errors={errors.userId && submitCount > 0 ? errors.userId : null}  
                  keyLabel={["firstName","lastName"]}
                  labelDivider=" "
                  preload={values.userId ? true : false}
                />
              </BasicCard>
              <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px", justifyContent : "flex-end", width : "100%"}}>
                <LoadingButton
                  type="submit" 
                  $loading={isSubmitting}
                >Update</LoadingButton>                
              </Box>                
            </Form>
            );
          }}
        </Formik>
      )}
      {confirmModal} 
    </Page>      
  );
}
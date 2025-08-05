import React, { useContext, useEffect, useState } from "react";
import { Button, Spinner, Flex, Box } from "theme-ui";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import moment from "moment-timezone";

import UserContext from "@/context/User";

import Page from "@/components/ui/Page";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "@/components/ui/Modal";
import SelectDate from "@/components/forms/SelectDate";
import TextInput from "@/components/forms/TextInput";
import LoadingButton from "@/components/ui/LoadingButton";
import SelectSearch from "@/components/forms/SelectSearch";
import { useToast } from "@/components/toast";
import FamilyTree, { Person } from "./FamilyTree";


const Dashboard = () =>{  

  const toast = useToast();  
  
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [person, setPerson] = useState<Person | null>(null);
  const [search, setSearch] = useState<string | null>(null)

  const { user } = useContext<any>(UserContext);  

  const toggleModal = () => setShowModal(!showModal)

  const loadInit = async (id?: string) => {
    const { data } = await axios.get(`/family${id ? `?id=${id}` : ""}`).catch((err) => ({ data: err?.response?.data }));    
    if(data?.id){
      setPerson(data);
    }
    setLoading(false);
  }

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

  const createMember = async (values: { firstName?: string; lastName?: string; birthDate?: string; deathDate?: string; parents?: string[], userId?: string }) => {
    const { data } = await axios.post("/family", {
      firstName: values.firstName,
      lastName: values.lastName,
      birthDate: values.birthDate,
      deathDate: values.deathDate,
      parents: values?.parents?.map((p) => ({id: p, type: "parent"})),
      userId: values.userId   
    }).catch((err) => ({ data: err?.response?.data }));
    
    if(data?.id){ 
      toast.add("Added to family tree","var(--theme-ui-colors-green)");      
    }else{
      toast.add(data?.error?.message ?? "Error adding person","var(--theme-ui-colors-red)");
    }    
    setShowModal(false);  
    loadInit(person?.id)
  }

  const CreateSchema = Yup.object().shape({      
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),   
    birthDate: Yup.string().required("Birth Date is required."),
  }).noUnknown(true);

  useEffect(() => {    
    if(search){
      loadInit(search)
    }
  },[search])

  useEffect(() => {    
    document.title = import.meta.env.VITE_REACT_APP_NAME;     
    
    loadInit()
  },[])


  if(loading) return <Page><Spinner /></Page>


  return ( 
    <>
      <Page>    
        <Box sx={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3}}>
          {user?.permissions.includes("familyCreate") && <Button onClick={toggleModal}>Add</Button>}
          <Box sx={{flexGrow: 1}}>
            <SelectSearch
              api={getMembers}    
              value={search ?? ""}        
              onChange={(val: any) => setSearch(val?.id)}            
              keyLabel={["firstName","lastName"]}
              labelDivider=" "   
              sx={{margin: "0!important"}} 
            />
          </Box>
        </Box>
        {person && <FamilyTree person={person} select={(e: string) => loadInit(e)} />}
      </Page>  
      <Modal isOpen={showModal} toggle={toggleModal} size="lg" centered={true}>
        <Formik initialValues={{}} onSubmit={createMember} validationSchema={CreateSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }: any) => { 
            return (                
            <Form noValidate autoComplete="off">
              <ModalHeader toggle={toggleModal}>New</ModalHeader>
              <ModalBody> 
                <Flex sx={{display : ["block","flex"], gap: 2, "> *" : { flex: 1 }}}>                  
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
                </Flex>
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
                <SelectSearch
                  api={getUsers}
                  label="Connect User"
                  value={values.userId}
                  onChange={(val: any) => setFieldValue("userId",val?.id)}
                  $errors={errors.userId && submitCount > 0 ? errors.userId : null}  
                  keyLabel={["firstName","lastName"]}
                  labelDivider=" "
                />
              </ModalBody>
              <ModalFooter>                
                <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px"}}>
                  <Button 
                    variant="outline.primary"
                    type="button" 
                    onClick={toggleModal} 
                  >Cancel</Button>   
                  <LoadingButton
                    variant="outline.success"                     
                    type="submit" 
                    $loading={isSubmitting}
                  >Create</LoadingButton>
                </Box>                
              </ModalFooter>
            </Form>
            );
          }}
        </Formik>
      </Modal>  
    </>   
  );            
};

export default Dashboard;
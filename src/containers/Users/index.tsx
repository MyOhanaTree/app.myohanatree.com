import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Box, Button, Flex } from "theme-ui";
import axios from "axios";

import { Modal, ModalBody, ModalHeader, ModalFooter } from "@/components/ui/Modal";
import TableData from "@/components/ui/TableData";
import Page from "@/components/ui/Page";
import TextInput from "@/components/forms/TextInput";
import SelectInput from "@/components/forms/SelectInput";
import { useToast } from "@/components/toast";
import BasicModal from "@/components/ui/BasicModal";
import P from "@/components/typography/P";
import LoadingWheel from "@/components/ui/LoadingWheel";
import LoadingButton from "@/components/ui/LoadingButton";

export default function Users() {

  const toast = useToast();  

  const [refreshData, setRefreshData] = useState(false);  
  const [permissions, setPermissions] = useState<any[]>([]);

  const [editModal, toggleEditModal] = useState<boolean>(false);
  const [inviteModal, toggleInviteModal] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<any>(null);  

  const [confirmModal, setConfirmModal] = useState<any>(false);
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);

  const columnHelper = createColumnHelper();


  const getUsers = async ({ query = {}, controller = null, excludeInterceptor = false}: any) => {		
    const params: any = {params : query, excludeInterceptor}
    if(controller?.signal){
      params.signal = controller.signal
    }
    const res = await axios.get("/users", params).catch((err) => ({ data: { items: [] } }))
    return res?.data;
  };

  const columns = [
    columnHelper.accessor("firstName", {
      id: "firstName",
      cell: (info) => (
        <Box onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </Box>
      ),
      header: () => <span>First Name</span>,
    }),
    columnHelper.accessor("lastName", {
      id: "lastName",
      cell: (info) => (
        <Box sx={{textWrap:"nowrap"}} onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </Box>
      ),
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor("email", {
      id: "email",
      cell: (info) => (
        <Box onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </Box>
      ),
      header: () => <span>Email</span>,
    }),
    columnHelper.accessor("status", {
      id: "status",
      cell: (info) => (        
        <Box onClick={() => setEditModal(info.row.original)}>
            {(() => {
              switch(info.getValue()){
                case(1):
                  return "Active";            
                case(2):
                  return "Pending";            
                default:
                  return "Inactive";            
              }
            })()}
        </Box>
      ),     
      header: () => <span>Status</span>,
    }),
  ];                    

  const setEditModal = (the_user: any) => {      
    if(the_user){
      setUserInfo(the_user);
      toggleEditModal(true);
    } else {
      setUserInfo(null);
      toggleEditModal(false);
    }
  };  

  const UserSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required."),
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),   
  }).noUnknown(true);

  const submitUserUpdate = async (values: any) => {       
    const { data: res }: any = await axios.put(`/users/${userInfo?.id}`, {
      firstName : values.firstName,
      lastName: values.lastName,
      email: values.email,
      permissions: values.permissions,
    }).catch((err) => ({ data: err?.response?.data }));

    if(res?.firstName){ 
      toast.add("User updated","var(--theme-ui-colors-green)");
      setRefreshData(true);
      setTimeout(() => { setRefreshData(false) }, 100);         
    }else{
      toast.add(res?.error?.message ?? "Error updating user","var(--theme-ui-colors-red)");
    }    
    toggleEditModal(false);        
  }; 

  const submitInviteUser = async (values: any, { setErrors}: any) => {
            
    const { data: res }: any = await axios.post("/users/invite", {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      permissions: values.permissions,
    }).catch((err) => ({ data: err?.response?.data }));

    if(res?.success){
      toast.add(res?.message ? res.message : "User invited","var(--theme-ui-colors-green)");
      if(res.link){
        toast.add(res.link,"var(--theme-ui-colors-green)");
      }
      toggleInviteModal(false);    
      setRefreshData(true);
      setTimeout(() => { setRefreshData(false) }, 100);   
    } else {  
      toast.add(res?.error?.message ?? "Error inviting user","var(--theme-ui-colors-red)");
    }     
  };  

  const InviteSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required."),
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),
  });  

  const confirmDeleteUser = async () => { 
    setConfirmSubmit(true);       

		const { data: res }: any = await axios.delete(`/users/${userInfo?.id}`).catch((err) => ({ data: err?.response?.data }));
    if(res?.success){ 
      toast.add(res?.message ? res.message : "User deleted","var(--theme-ui-colors-green)");
      setRefreshData(true);    
      setTimeout(() => { setRefreshData(false) }, 100);   
    }else{
      toast.add(res?.error?.message ?? "Error deleting user","var(--theme-ui-colors-red)");
    } 
    setConfirmSubmit(false);   
    setConfirmModal(false)          
  };  
  
  const cancelDeleteUser = async () => {
    setConfirmModal(false)
  }

  const submitDeleteUser = async () => {
    toggleEditModal(false);  
    setConfirmModal(<BasicModal title="Delete User?" confirm_click={confirmDeleteUser} cancel_click={cancelDeleteUser} $submitting={confirmSubmit}>
      <P>Are you sure you want to delete <strong>{userInfo?.firstName} {userInfo?.lastName}</strong>?</P>
    </BasicModal>);
  }

  const toggleEdit = () => toggleEditModal(!editModal);
  const toggleInvite = () => toggleInviteModal(!inviteModal);


  useEffect(() => {
    const initPermissions = async () => {
      const res = await axios.get("/users/permissions").catch((err) => ({ data: [] }));
      setPermissions(res?.data);

    };
    initPermissions();    
  }, []);

  useEffect(() => {
    document.title = import.meta.env.VITE_REACT_APP_NAME + " | Users"
  }, []);

  return (
    <>
      <Page>                
        <TableData 
          api={getUsers} 
          defaultSortBy="createdAt"
          defaultSortDir="DESC"
          columns={columns} 
          refresh={refreshData} 
          actions={[
            <Button 
              key="1"
              variant="primary"
              type="button"              
              onClick={toggleInvite} 
            >Add User</Button>,            
          ]} 
        />
      </Page>
      <Modal isOpen={editModal} toggle={toggleEdit} size="lg" centered={true}>
        <Formik initialValues={{...userInfo }} onSubmit={submitUserUpdate} validationSchema={UserSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }: any) => { 
            return (                
            <Form noValidate autoComplete="off">
              <ModalHeader toggle={toggleEdit}>Edit User</ModalHeader>
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
                <Flex sx={{ gap: 2, "> *" : { flex: 1 }}}>                  
                  <TextInput 
                    type="email" 
                    name="email" 
                    label="Email"
                    value={values.email}
                    onChange={(val: any) => setFieldValue("email",val)}
                    $errors={errors.email && submitCount > 0 ? errors.email : null}                                    
                  />                  
                  {Object.entries(permissions).length === 0 ? (
                    <LoadingWheel width="15px" stroke="3px" />
                  ) : (
                    <SelectInput 
                      name="permissions" 
                      label="Permissions"                       
                      value={values?.permissions}
                      onChange={(val: any) => setFieldValue("permissions",val)}
                      options={Object.entries(permissions).map(([value,label]) => ({ value, label}))}  
                      multiple={true} 
                      $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                    />
                  )}
                </Flex>
                {userInfo.status === 2 && ( 
                  <div>
                    <p><strong>Resend Activation Link</strong></p>                    
                  </div>
                )}                
              </ModalBody>
              <ModalFooter>
                <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px", justifyContent : "space-between", width : "100%"}}>
                  <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px"}}>                    
                    <Button 
                      variant="danger"
                      type="button" 
                      onClick={submitDeleteUser} 
                    >Delete</Button> 
                    
                  </Box>
                  <Box sx={{display: "flex", flexWrap : "wrap-reverse", gap : "20px"}}>
                    <Button 
                      variant="outline.primary"
                      type="button" 
                      onClick={toggleEdit} 
                    >Cancel</Button>   
                    <LoadingButton 
                      variant="outline.secondary"                     
                      type="submit" 
                      $loading={isSubmitting}
                    >Update</LoadingButton>
                  </Box>
                </Box>                
              </ModalFooter>
            </Form>
            );
          }}
        </Formik>
      </Modal>
      <Modal isOpen={inviteModal} toggle={toggleInvite} centered={true}>
        <Formik initialValues={{email:"",permissions: [],firstName:"",lastName:""}} onSubmit={submitInviteUser} validationSchema={InviteSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
            return (              
            <Form noValidate autoComplete="off">
              <ModalHeader toggle={toggleInvite}>Add User</ModalHeader>
              <ModalBody> 
                <Flex sx={{ gap: 2, "> *" : { flex: 1 }}}>                  
                  <TextInput
                    type="email" 
                    name="email" 
                    label="Email"  
                    value={values.email}
                    onChange={(val: any) => setFieldValue("email",val)}
                    autoComplete="off"
                    $errors={errors.email && submitCount > 0 ? errors.email : null}  
                  />                  
                  {permissions.length === 0 && <LoadingWheel width="15px" stroke="3px" />}
                  {permissions.length > 0 && <SelectInput 
                    name="permissions" 
                    label="Permissions" 
                    value={values.permissions ?? []}
                    onChange={(val: any) => setFieldValue("permissions",val)}
                    options={permissions}  
                    multiple={true} 
                    $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                  />}
                </Flex>                  
                <Flex sx={{ gap: 2, "> *" : { flex: 1 }}}>                  
                  <TextInput 
                    name="firstName" 
                    label="First Name" 
                    value={values.firstName}
                    onChange={(val: any) => setFieldValue("firstName",val)}
                    autoComplete="off"
                    $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}  
                  />                  
                  <TextInput 
                    name="lastName" 
                    label="Last Name" 
                    value={values.lastName}
                    onChange={(val: any) => setFieldValue("lastName",val)}
                    autoComplete="off"
                    $errors={errors.lastName && submitCount > 0 ? errors.lastName : null} 
                  />                                              
                </Flex>
              </ModalBody>
              <ModalFooter>
                <Button 
                  variant="outline.primary"
                  type="button" 
                  onClick={toggleInvite} 
                >Cancel</Button>
                <LoadingButton 
                  variant="secondary"          
                  type="submit" 
                  $loading={isSubmitting}
                >Invite</LoadingButton>                
              </ModalFooter>
            </Form>
          );
        }}            
        </Formik>
      </Modal>
      {confirmModal}      
    </>
  );
}
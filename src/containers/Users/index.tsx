import React, { useEffect, useMemo, useState, useContext } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col } from "reactstrap";
import { createColumnHelper } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { getUsers, checkUser, updateUser, inviteUser, deleteUser, restoreUser, allPermissions } from "api/Users";

import Header from "components/ui/Header";
import TableData from "components/ui/TableData";
import Page from "components/ui/Page";
import BasicButton from "components/forms/BasicButton";
import TextInput from "components/forms/TextInput";
import SelectInput from "components/forms/SelectInput";
import { useToast } from "components/toast";
import BasicModal from "components/ui/BasicModal";
import StyledDiv from "components/ui/StyledDiv";
import P from "components/typography/P";
import LoadingWheel from "components/ui/LoadingWheel";

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

  const columns = [
    columnHelper.accessor("firstName", {
      id: "firstName",
      cell: (info) => (
        <div onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </div>
      ),
      header: () => <span>First Name</span>,
    }),
    columnHelper.accessor("lastName", {
      id: "lastName",
      cell: (info) => (
        <div onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </div>
      ),
      header: () => <span>Last Name</span>,
    }),
    columnHelper.accessor("email", {
      id: "email",
      cell: (info) => (
        <div onClick={() => setEditModal(info.row.original)}>
          {info.getValue()}
        </div>
      ),
      header: () => <span>Email</span>,
    }),
    columnHelper.accessor("status", {
      id: "status",
      cell: (info) => (        
        <div onClick={() => setEditModal(info.row.original)}>
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
        </div>
      ),     
      header: () => <span>Status</span>,
    }),
  ];                    

  const setEditModal = (the_user: any) => {      
    if(the_user){
      the_user.metaData = { languages : (((the_user?.data || [])?.find((i: any) => i.key === "languages"))?.value || "").split(",")}
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

  const submitUserUpdate = async (values: any, actions: any) => {   
    const update = {
      firstName : values.firstName,
      lastName: values.lastName,
      email: values.email,
      permissions: values.permissions,
    }
    
    const res = await updateUser({ data : userInfo, update });
    if(res?.firstName){ 
      toast.add("User updated","var(--theme-ui-colors-green)");
      setRefreshData(true);
      setTimeout(() => { setRefreshData(false) }, 100);         
    }else{
      toast.add(res?.message ? res.message : "Error updating user","var(--theme-ui-colors-red)");
    }    
    toggleEditModal(false);        
  }; 

  const submitInviteUser = async (values: any, { setErrors}: any) => {
  
    const invite = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      permissions: values.permissions,
    };
      
    const check = await checkUser({ invite });
    if(check.length > 0) {
      setErrors({ email: `${invite.email} already exists and can't be invited again` });
    } else {
      const res = await inviteUser({ invite });
      if(res?.success){
        toast.add(res?.message ? res.message : "User invited","var(--theme-ui-colors-green)");
        if(res.link){
          toast.add(res.link,"var(--theme-ui-colors-green)");
        }
        toggleInviteModal(false);    
        setRefreshData(true);
        setTimeout(() => { setRefreshData(false) }, 100);   
      } else {  
        toast.add(res?.message ? res.message : "Error inviting user","var(--theme-ui-colors-red)");
      }
    } 
  };  

  const InviteSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required."),
    firstName: Yup.string().required("First Name is required."),
    lastName: Yup.string().required("Last Name is required."),
  });  

  const confirmDeleteUser = async () => { 
    setConfirmSubmit(true);   
    const res = await deleteUser({ data: userInfo });
    if(res?.success){ 
      toast.add(res?.message ? res.message : "User deleted","var(--theme-ui-colors-green)");
      setRefreshData(true);    
      setTimeout(() => { setRefreshData(false) }, 100);   
    }else{
      toast.add(res?.message ? res.message : "Error deleting user","var(--theme-ui-colors-red)");
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

  const submitRestoreUser = async () => {
    const res = await restoreUser({ data: userInfo });    
    if(res?.id){ 
      toggleEditModal(false); 
      toast.add("User restored.","var(--theme-ui-colors-green)");      
      setRefreshData(true);
      setTimeout(() => { setRefreshData(false) }, 100);   
    }else{
      toast.add(res?.message ? res.message : "Error restoring user","var(--theme-ui-colors-red)");
    }           
  }

  const toggleEdit = () => toggleEditModal(!editModal);
  const toggleInvite = () => toggleInviteModal(!inviteModal);


  useEffect(() => {
    const initPermissions = async () => {
      try {
        const res = await allPermissions();                  
        if(Array.isArray(res)){
          const newperms = res.map((r: any) => { const [key, value] = Object.entries(r)[0]; return { value : key, label : value} });
          setPermissions(newperms);          
        } 
      } catch (e) { }
    };
    initPermissions();    
  }, []);

  useEffect(() => {
    document.title = process.env.REACT_APP_NAME + " | Users"
  }, []);

  return (
    <>
      <Header title="Users"></Header>      
      <Page>                
        <TableData 
          api={getUsers} 
          columns={columns} 
          refresh={refreshData} 
          actions={[
            <BasicButton 
              key="1"
              scheme="primary"              
              onClick={toggleInvite} 
            >Add User</BasicButton>,            
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
                <Row>
                  <Col lg="6">
                    <TextInput 
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      onChange={(val: any) => setFieldValue("firstName",val)}
                      $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}                                    
                    /> 
                  </Col>
                  <Col lg="6">
                    <TextInput 
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onChange={(val: any) => setFieldValue("lastName",val)}
                      $errors={errors.lastName && submitCount > 0 ? errors.lastName : null}                                    
                    /> 
                  </Col>
                  <Col lg="6">
                    <TextInput 
                      type="email" 
                      name="email" 
                      label="Email"
                      value={values.email}
                      onChange={(val: any) => setFieldValue("email",val)}
                      $errors={errors.email && submitCount > 0 ? errors.email : null}                                    
                    />
                  </Col>
                  <Col lg="6">
                    {permissions.length === 0 && <LoadingWheel width="15px" stroke="3px" />}
                    {permissions.length > 0 && <SelectInput 
                      name="permissions" 
                      label="Permissions"                       
                      value={values?.permissions}
                      onChange={(val: any) => setFieldValue("permissions",val)}
                      options={permissions}  
                      multiple={true} 
                      $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                    />}
                  </Col>                    
                  {userInfo.status === 2 && (
                    <Col className="text-center">
                      <p><strong>Send Activation Link</strong></p>
                      <p>{`${process.env.REACT_APP_BASEURL}/register?token=${userInfo.verifyMeToken}&userId=${userInfo?.id}&email=${userInfo.email}`}</p>
                    </Col>                                                                                                                        
                  )}
                </Row>                                                                        
              </ModalBody>
              <ModalFooter>
                <StyledDiv styles={{display: "flex", flexWrap : "wrap-reverse", gap : "20px", justifyContent : "space-between", width : "100%"}}>
                  <StyledDiv styles={{display: "flex", flexWrap : "wrap-reverse", gap : "20px"}}>                    
                    <BasicButton 
                      scheme="danger"
                      outline={true}
                      type="button" 
                      onClick={submitDeleteUser} 
                    >Delete</BasicButton> 
                    {values.status === 0 && <>
                      <BasicButton 
                        scheme="warning"
                        outline={true}
                        type="button" 
                        onClick={submitRestoreUser} 
                      >Restore</BasicButton> 
                    </>}
                  </StyledDiv>
                  <StyledDiv styles={{display: "flex", flexWrap : "wrap-reverse", gap : "20px"}}>
                    <BasicButton 
                      outline={true}                  
                      type="button" 
                      onClick={toggleEdit} 
                    >Cancel</BasicButton>   
                    <BasicButton 
                      scheme="secondary"                     
                      outline={true}
                      type="submit" 
                      $submitting={isSubmitting}
                    >Update</BasicButton>
                  </StyledDiv>
                </StyledDiv>                
              </ModalFooter>
            </Form>
            );
          }}
        </Formik>
      </Modal>
      <Modal isOpen={inviteModal} toggle={toggleInvite} centered={true}>
        <Formik initialValues={{email:"",permission:[],firstName:"",lastName:""}} onSubmit={submitInviteUser} validationSchema={InviteSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
            return (              
            <Form noValidate autoComplete="off">
              <ModalHeader toggle={toggleInvite}>Add User</ModalHeader>
              <ModalBody> 
                <Row>
                  <Col lg="6">
                    <TextInput
                      type="email" 
                      name="email" 
                      label="Email"  
                      value={values.email}
                      onChange={(val: any) => setFieldValue("email",val)}
                      autoComplete="off"
                      $errors={errors.email && submitCount > 0 ? errors.email : null}  />
                  </Col>
                  <Col lg="6">
                    {permissions.length === 0 && <LoadingWheel width="15px" stroke="3px" />}
                    {permissions.length > 0 && <SelectInput 
                      name="permissions" 
                      label="Permissions" 
                      value={values.permissions}
                      onChange={(val: any) => setFieldValue("permissions",val)}
                      options={permissions}  
                      multiple={true} 
                      $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                    />}
                  </Col>                
                  <Col lg="6">
                    <TextInput 
                      name="firstName" 
                      label="First Name" 
                      value={values.firstName}
                      onChange={(val: any) => setFieldValue("firstName",val)}
                      autoComplete="off"
                      $errors={errors.firstName && submitCount > 0 ? errors.firstName : null}  
                    />
                  </Col>
                  <Col lg="6">
                    <TextInput 
                      name="lastName" 
                      label="Last Name" 
                      value={values.lastName}
                      onChange={(val: any) => setFieldValue("lastName",val)}
                      autoComplete="off"
                      $errors={errors.lastName && submitCount > 0 ? errors.lastName : null} 
                    />                                              
                  </Col>
                </Row>                
              </ModalBody>
              <ModalFooter>
                <BasicButton 
                  outline={true}                
                  type="button" 
                  onClick={toggleInvite} 
                >Cancel</BasicButton>
                <BasicButton 
                  scheme="secondary"          
                  type="submit" 
                  $submitting={isSubmitting}
                >Invite</BasicButton>                
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
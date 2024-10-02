import React, { useEffect, useMemo, useState, useContext } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Row, Col } from "reactstrap";
import { createColumnHelper } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import { getUsers, checkUser, updateUser, inviteUser, deleteUser, resendInvite, restoreUser } from "api/Users";
import { getRoles } from "api/Roles";

import Header from "components/ui/Header";
import TableData from "components/ui/TableData";
import Page from "components/ui/Page";
import BasicButton from "components/forms/BasicButton";
import TextInput from "components/forms/TextInput";
import SelectInput from "components/forms/SelectInput";
import { useToast } from "components/toast";
import BasicModal from "components/ui/BasicModal";
import { SendEmailIcon } from "components/svg"
import StyledDiv from "components/ui/StyledDiv";
import P from "components/typography/P";
import LoadingWheel from "components/ui/LoadingWheel";
import UserContext from "context/User";

export default function Users() {

  const navigate = useNavigate();
  const toast = useToast();  
  const { user }: any = useContext(UserContext);

  const [refreshData, setRefreshData] = useState(false);  

  const roleList: any[] = useMemo(() => [], []);
  const [editModal, toggleEditModal] = useState<boolean>(false);
  const [inviteModal, toggleInviteModal] = useState<boolean>(false);

  const [userInfo, setUserInfo] = useState<any>(null);  

  const [confirmModal, setConfirmModal] = useState<any>(false);
  const [confirmSubmit, setConfirmSubmit] = useState<boolean>(false);
  const [resendInviteSubmit, setResendInviteSubmit] = useState<boolean>(false);

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
    columnHelper.accessor("roles", {
      id: "roles",
      cell: (info: any) => (        
        <div onClick={() => setEditModal(info.row.original)}>
            {info.getValue()?.map((i: any) => i.title).join(', ')}
        </div>
      ),     
      header: () => <span>Roles</span>,
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
    roles: Yup.array().required("1 Role is required.").min(1, 'Roles must have at least one item')
  }).noUnknown(true);

  const submitUserUpdate = async (values: any, actions: any) => {   
    const update = {
      firstName : values.firstName,
      lastName: values.lastName,
      email: values.email,
      roles: values.roles,
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
      roles: values.roles,
    };
      
    const check = await checkUser({ invite });
    if(check.length > 0) {
      setErrors({ email: `${invite.email} already exists and can't be invited again` });
    } else {
      const res = await inviteUser({ invite });
      if(res?.success){
        toast.add(res?.message ? res.message : "User invited","var(--theme-ui-colors-green)");
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
    roles: Yup.array().required("1 Role is required.").min(1, 'Roles must have at least one item')
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
  
  const resendUserInvite = async () => {        
    setResendInviteSubmit(true);
    const res = await resendInvite({ data: userInfo });    
    if(res?.success){ 
      toggleEditModal(false); 
      toast.add("User invite resent.","var(--theme-ui-colors-green)");        
    }else{
      toast.add(res?.message ? res.message : "Error resending invite","var(--theme-ui-colors-red)");
    }           
    setResendInviteSubmit(false);
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
    const initRoles = async () => {
      try {
        const res = await getRoles({ query : { recordsPer : 1000}});   
        if(res.items){
          for(let i = 0; i < res.items.length; i++){
            const item = res.items[i];
            roleList.push({ value : item.id, label : item.title});
          }
        } 
      } catch (e) { }
    };
    initRoles();    
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
            (user?.roles?.flatMap((role: any) => role.permissions) || []).find((x: any) => ["roleAccess"].includes(x)) ?
              <BasicButton 
                key="2"
                outline
                scheme="primary"              
                onClick={() => navigate("/roles")} 
              >Roles</BasicButton>
            : null
          ]} 
        />
      </Page>
      <Modal isOpen={editModal} toggle={toggleEdit} size="lg" centered={true}>
        <Formik initialValues={{...userInfo, roles : userInfo?.roles?.map((r: any) => r.id), metaData : { languages : userInfo?.data?.find((i: any) => i.key === 'languages')?.value.split(',') }}} onSubmit={submitUserUpdate} validationSchema={UserSchema} >
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
                    {roleList.length === 0 && <LoadingWheel width="15px" stroke="3px" />}
                    {roleList.length > 0 && <SelectInput 
                      name="roles" 
                      label="Roles"                       
                      value={values?.roles}
                      onChange={(val: any) => setFieldValue("roles",val)}
                      options={roleList}  
                      multiple={true} 
                      $errors={errors.roles && submitCount > 0 ? errors.roles : null}  
                    />}
                  </Col>                    
                  {userInfo.status === 2 && (
                    <Col className="text-center">
                      <BasicButton 
                        scheme="clear"
                        styles={{
                          margin : "0 auto 1rem",
                          paddingLeft : "1rem",
                          paddingRight : "1rem",
                          width : "175px"                        
                        }}                        
                        type="button" 
                        onClick={resendUserInvite} 
                        $submitting={resendInviteSubmit}
                      ><SendEmailIcon fill={"var(--theme-ui-colors-body)"} width={"20px"} height={"auto"} mr={"10px"} /><span>Resend Invite</span></BasicButton> 
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
                    >Update User</BasicButton>
                  </StyledDiv>
                </StyledDiv>                
              </ModalFooter>
            </Form>
            );
          }}
        </Formik>
      </Modal>
      <Modal isOpen={inviteModal} toggle={toggleInvite} centered={true}>
        <Formik initialValues={{email:"",roles:[],firstName:"",lastName:""}} onSubmit={submitInviteUser} validationSchema={InviteSchema} >
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
                    {roleList.length === 0 && <LoadingWheel width="15px" stroke="3px" />}
                    {roleList.length > 0 && <SelectInput 
                      name="roles" 
                      label="Roles" 
                      value={values.roles}
                      onChange={(val: any) => setFieldValue("roles",val)}
                      options={roleList}  
                      multiple={true} 
                      $errors={errors.roles && submitCount > 0 ? errors.roles : null}  
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
                >Send Invite</BasicButton>                
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
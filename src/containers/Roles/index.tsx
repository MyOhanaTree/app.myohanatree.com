import React, { useEffect, useMemo, useState } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { createColumnHelper } from "@tanstack/react-table";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import Header from "components/ui/Header";
import Page from "components/ui/Page";
import BasicButton from "components/forms/BasicButton";
import TextInput from "components/forms/TextInput";
import { useToast } from "components/toast";
import SelectInput from "components/forms/SelectInput";
import TableData from "components/ui/TableData";

import { getRoles, allPermissions, createRole, updateRole } from "api/Roles";

export default function Roles() {
  const columnHelper = createColumnHelper();
  const permissionList: any = useMemo(() => [], []);

  const [refreshData, setRefreshData] = useState(false);  

  const [roleInfo, setRoleInfo] = useState(null);  
  const [editModalOpen, seteditModalOpen] = useState(false);
  const [createModal, toggleCreateModal] = useState(false);

  const toast = useToast();

  const columns = [
    columnHelper.accessor("title", {
      id: "title",
      cell: (info) => (
        <div onClick={() => openEditModal(info.row.original)}>
        {info.getValue()}
      </div>
      ),
      header: () => <span>Title</span>,
    }),
    columnHelper.accessor((row: any) => row.permissions, {
      id: "permissions",
      cell: (info) => (
        <div onClick={() => openEditModal(info.row.original)}>
        {info.getValue() ? info.getValue().join(", ") : ""}
      </div>
      ),
      header: () => <span>Permissions</span>,
    }),    
  ];               

  const openEditModal = (role: any) => {
    setRoleInfo(role);
    seteditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setRoleInfo(null);
    seteditModalOpen(false);
  }; 

  const submitRoleUpdate = async (values: any, actions: any) => {   
    const update = {
      title : values.title,
      permissions : values.permissions
    }  
    
    const res = await updateRole({ data: roleInfo, update });
    if(res?.title){ 
      toast.add("Role updated","var(--theme-ui-colors-green)");
      setRefreshData(true);    
      setTimeout(() => { setRefreshData(false) }, 100);          
    }else{
      toast.add(res?.message ? res.message : "Error updating role","var(--theme-ui-colors-red)");
    }          
    closeEditModal();        
  };  

  const UpdateSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),    
  });

  const toggleCreate = () => toggleCreateModal(!createModal);

  const submitCreateRole = async (values: any, { setErrors}: any) => {
  
    const role = {
      title: values.title,
      permissions : values.permissions
    };
    
    const res = await createRole({ data: role });
    if(res?.title){ 
      toast.add("Role created","var(--theme-ui-colors-green)");
      toggleCreateModal(false);

      setRefreshData(true);    
      setTimeout(() => { setRefreshData(false) }, 100);          
    }else{
      toast.add(res?.message ? res.message : "Error creating role","var(--theme-ui-colors-red)");
    }    
  };  

  const CreateSchema = Yup.object().shape({
    title: Yup.string().required("Title is required."),
  });

  useEffect(() => {    
    document.title = process.env.REACT_APP_NAME + " | Roles"

    const getPermissions = async () => {
      try {    
        const res = await allPermissions();
        if(typeof res === "object"){
          for (const [key, value] of Object.entries(res)) {
            permissionList.push({ value : key, label : value});
          }
        } 
      } catch (e) { }
    };    
    getPermissions();         
  }, [permissionList]); 

  return (
    <>
      <Header title="Roles"></Header>      
      <Page>                
        <TableData 
          api={getRoles} 
          columns={columns} 
          refresh={refreshData} 
          actions={[<BasicButton key="1" onClick={toggleCreate}>Add Role</BasicButton>]} 
        />
      </Page>

      <Modal isOpen={editModalOpen} toggle={closeEditModal} centered={true}>
        <Formik initialValues={roleInfo} onSubmit={submitRoleUpdate} validationSchema={UpdateSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {              
            return (
              <Form noValidate autoComplete="off">
                <ModalHeader toggle={closeEditModal}>Edit Role</ModalHeader>
                <ModalBody>
                  <TextInput 
                    name="title"
                    label="Title"
                    value={values.title}
                    onChange={(val: any) => setFieldValue("title",val)}
                    $errors={errors.title && submitCount > 0 ? errors.title : null}                                    
                  />     
                  <SelectInput 
                    name="permissions" 
                    label="Permissions" 
                    value={values.permissions}
                    onChange={(val: any) => setFieldValue("permissions",val)}
                    options={permissionList}  
                    multiple={true}
                    $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                  />                                  
                </ModalBody>
                <ModalFooter>
                  <>
                    <BasicButton 
                      outline={true}
                      styles={{margin:".25rem 0.625rem .25rem 0"}}                    
                      type="button" 
                      onClick={closeEditModal} 
                    >Cancel</BasicButton>
                    <BasicButton 
                      styles={{margin:".25rem 0.625rem .25rem 0"}}
                      type="submit" 
                      $submitting={isSubmitting}
                    >Update Role</BasicButton>
                  </>
                </ModalFooter>
              </Form>
            );
          }}
        </Formik>
      </Modal> 
      <Modal isOpen={createModal} toggle={toggleCreate} centered={true}>
        <Formik initialValues={{key : "", title: "", permissions: []}} onSubmit={submitCreateRole} validationSchema={CreateSchema} >
          {({ isSubmitting, errors, values, submitCount, setFieldValue }) => {
            return (              
            <Form>
              <ModalHeader toggle={toggleCreate}>Create Role</ModalHeader>
              <ModalBody>                   
                <TextInput 
                  name="title" 
                  label="Title" 
                  value={values.title}
                  onChange={(val: any) => setFieldValue("title",val)}
                  $errors={errors.title && submitCount > 0 ? errors.title : null}  
                />
                <SelectInput 
                  name="permissions" 
                  label="Permissions" 
                  value={values.permissions}
                  onChange={(val: any) => setFieldValue("permissions",val)}
                  options={permissionList}  
                  multiple={true}
                  $errors={errors.permissions && submitCount > 0 ? errors.permissions : null}  
                />                
              </ModalBody>
              <ModalFooter>
                <>
                  <BasicButton 
                    outline={true}               
                    styles={{margin:".25rem 0.625rem .25rem 0"}}
                    type="button" 
                    onClick={toggleCreate} 
                  >Cancel</BasicButton>
                  <BasicButton 
                    styles={{margin:".25rem 0.625rem .25rem 0"}}
                    type="submit" 
                    $submitting={isSubmitting}
                  >Create Role</BasicButton>                
                </>
              </ModalFooter>
            </Form>
          );
        }}            
        </Formik>
      </Modal>       
    </>
  );
}

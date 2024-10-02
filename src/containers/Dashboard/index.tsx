import React, { useEffect } from "react";
import Header from "components/ui/Header";
import Page from "components/ui/Page";
import { useNavigate } from "react-router-dom";

const Dashboard = () =>{  
  
  useEffect(() => {    
    document.title = process.env.REACT_APP_NAME + " | Dashboard"        
  },[])

  return (
    <>
      <Header title="Dashboard"></Header>
      <Page>            
        <h1>Coming Soon</h1>    
      </Page>
    </>
  );            
};

export default Dashboard;
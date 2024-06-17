
import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from "./pages/auth/authcontext";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/dashboard";
import Library from "./pages/content/Library";
import Category from "./pages/category/index";
import Sidebar from "./components/common/sidebar";
import { isAdminLoggedIn } from './utils/auth';
import PrivateRoute from './utils/privateRoute';
import Router from "./routes/index"
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  
  return (
    
      <div className="flex overflow-hidden ">
            {isAuthenticated && <Sidebar />}
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
                <Route path="/category" element={isAuthenticated ? <Category /> : <Navigate to="/" />} />
                <Route path="/:category_name/:subcategory_name" element={isAuthenticated ? <Library /> : <Navigate to="/" />} />
          </Routes>
         
      </div>
      
  );
 

}
export default App;



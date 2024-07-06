
import React, { useContext, useState,useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/dashboard";
import Library from "./pages/content/Library";
import Category from "./pages/category/index";
import Sidebar from "./components/common/sidebar";
import Subcategory from "./pages/subcategory/index"

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    
  }, []);
  
  return (
    
      <div className="flex overflow-hidden h-fit">
        {isAuthenticated ? (
        <>
          <Sidebar />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/subcategory" element={<Subcategory />} />
            <Route path="/:category_name/:subcategory_name" element={<Library />} />
            {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
         
      </div>
      
  );
 

}
export default App;



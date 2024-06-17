import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from "../pages/dashboard/dashboard";
import Category from '../pages/category/index';

const Content = () => {
    return (
        <div className="flex-1 p-6">
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/catgeory" element={<Category />} />
            </Routes>
        </div>
    );
};

export default Content;

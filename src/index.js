import { createRoot } from 'react-dom/client';
import React from 'react';

// 首頁 + 登入、註冊、忘記密碼
import Home from './Home/Home';
import SignUp from './Home/SignUp';
import Forgot from './Home/Forgot';
// 月曆
import App from './App';

import { BrowserRouter, Route, Routes } from "react-router-dom";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                {/* 登入 */}
                <Route path='/' element={<Home />} />
                {/* 註冊 */}
                <Route path='signup' element={<SignUp />} />
                {/* 忘記密碼 */}
                <Route path='forgot' element={<Forgot />} />
                {/* 日曆 */}
                <Route path='calendar' element={<App />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
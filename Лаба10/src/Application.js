import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Posts from './pages/Posts';
import Albums from './pages/Albums';
import Todos from './pages/Todos';
import Users from './pages/Users';

export default function App() {
    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/posts" element={<Posts />} />
                        <Route path="/albums" element={<Albums />} />
                        <Route path="/todos" element={<Todos />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/" element={<Posts />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarLearner from './components/NavbarLearner';
import NavbarCreator from './components/NavbarCreator';
import NavbarHome from './components/NavbarHome';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';

import CreateCourse from './components/CreateCourse';
import CourseCreatorDashboard from './components/CourseCreatorDashboard';
import CreatorCourseDetails from './components/CreatorCourseDetails';
import LearnerDashboard from './components/LearnerDashboard';
import LearnerCourseDetails from './components/LearnerCourseDetails';
import LearnerLessonPage from './components/LearnerLessonPage';
import CourseDiscovery from './components/CourseDiscovery';
import CreatorLessonPage from './components/CreatorLessonPage';

const App = () => {
    const [role, setRole] = useState(null); // Store the user's role

    // Load the user's role from localStorage on initial render
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setRole(parsedUser.role);
        }
    }, []);

    // Handle user login, store user data, and update role
    const handleLogin = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setRole(userData.role);
    };

    // Handle user logout and clear session data
    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setRole(null);
    };

    return (
        <Router>
            {/* Render navbar based on the user's role */}
            {role === 'learner' && <NavbarLearner onLogout={handleLogout} />}
            {role === 'creator' && <NavbarCreator onLogout={handleLogout} />}
            {!role && <NavbarHome />}

            <Routes>
                {/* Routes for authentication */}
                <Route path="/" element={<Register />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />

                {/* Creator routes */}
                <Route path="/create-course" element={<CreateCourse />} />
                <Route path="/creator-dashboard" element={<CourseCreatorDashboard />} />
                <Route path="/creator/courses/:id" element={<CreatorCourseDetails />} />
                <Route path="/creator/lessons/:id" element={<CreatorLessonPage />} />

                {/* Learner routes */}
                <Route path="/learner-dashboard" element={<LearnerDashboard />} />
                <Route path="/learner/courses/:id" element={<LearnerCourseDetails />} />
                <Route path="/learner/lessons/:id" element={<LearnerLessonPage />} />

                {/* Shared routes */}
                <Route path="/course-discovery" element={<CourseDiscovery />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default App;

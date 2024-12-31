import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarLearner from './components/NavbarLearner';
import NavbarCreator from './components/NavbarCreator';
import NavbarHome from './components/NavbarHome';
import Footer from './components/Footer';
import Register from './components/Register';
import Login from './components/Login';
import { UserContext } from './UserContext';
import CreateCourse from './components/CreateCourse';
import CourseCreatorDashboard from './components/CourseCreatorDashboard';
import CreatorCourseDetails from './components/CreatorCourseDetails';
import LearnerDashboard from './components/LearnerDashboard';
import LearnerCourseDetails from './components/LearnerCourseDetails';
import LearnerLessonPage from './components/LearnerLessonPage';
import CourseDiscovery from './components/CourseDiscovery';
import CreatorLessonPage from './components/CreatorLessonPage';
import styles from './App.module.css';
import TestModules from './components/TestModules';

const App = () => {
    const { role, handleLogin, handleLogout } = useContext(UserContext);

    return (
        <Router>
            <div className={styles.appContainer}>
                <header>
                    {/* Render navbar based on the user's role */}
                    {role === 'learner' && <NavbarLearner onLogout={handleLogout} />}
                    {role === 'creator' && <NavbarCreator onLogout={handleLogout} />}
                    {!role && <NavbarHome />}
                </header>

                <main className={styles.mainContent}>
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
                        <Route path="/test-modules" element={<TestModules />} />
                    </Routes>
                </main>
                <footer>
                    {/* Footer Component */}
                    <Footer />
                </footer>
            </div>
        </Router>
    );
};

export default App;

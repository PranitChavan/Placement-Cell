import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Landing from './Components/Pages/Landing';
import StudentDetails from './Components/Pages/StudentDetails';
import { useAuth } from './Context/AuthContext';
import Dashboard from './Components/Pages/Dashboard';
import Navbar from './Components/Pages/Navbar';
import Applicants from './Components/Pages/Applicants';

function App() {
  const { currentUser } = useAuth();

  const RequiredAuth = ({ children, operation }) => {
    if (currentUser && operation === 'Landing') {
      return <Navigate to={'/Dashboard'} />;
    }

    if (!currentUser && window.location.pathname !== '/Landing') {
      return <Navigate to={'/Landing'} />;
    }

    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar loggedInOrNot={currentUser} />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <RequiredAuth operation={'Landing'}>
                <Landing />
              </RequiredAuth>
            }
          ></Route>
          <Route
            path="/Landing"
            element={
              <RequiredAuth operation={'Landing'}>
                <Landing />
              </RequiredAuth>
            }
          ></Route>
          <Route
            path="/StudentDetails"
            element={
              <RequiredAuth>
                <StudentDetails />
              </RequiredAuth>
            }
          ></Route>
          <Route
            path="/Dashboard"
            element={
              <RequiredAuth>
                <Dashboard />
              </RequiredAuth>
            }
          ></Route>
          <Route
            path="/Applicants"
            element={
              <RequiredAuth>
                <Applicants />
              </RequiredAuth>
            }
          ></Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

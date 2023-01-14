import './App.css';
import Landing from './Components/Landing';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import StudentForm from './Components/StudentForm';
import { useAuth } from './contexts/AuthContext';
import Dashboard from './Components/Dashboard';

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
            path="/StudentForm"
            element={
              <RequiredAuth>
                <StudentForm />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

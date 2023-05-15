import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import { useAuth } from './Context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import Landing from './Components/Pages/Landing';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Components/UI/Navigation/Navbar';
import SearchRoomsDetails from './Test';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const StudentDetails = lazy(() => import('./Components/Forms/StudentDetails'));
const Applicants = lazy(() => import('./Components/Pages/Teachers/Applicants'));
const Drawer = lazy(() => import('./Components/UI/Navigation/Drawer'));
const FormDialog = lazy(() => import('./Components/Forms/TeacherForm'));
const Dashboard = lazy(() => import('./Components/Pages/Dashboard'));
const PlacedStudents = lazy(() => import('./Components/Pages/Teachers/PlacedStudents'));
const Placed = lazy(() => import('./Components/Pages/Students/Placed'));
const JobStatus = lazy(() => import('./Components/Pages/Students/JobStatus'));
const Students = lazy(() => import('./Components/Pages/Teachers/Students'));
const AppliedJobs = lazy(() => import('./Components/Pages/Teachers/AppliedJobs'));
const StudentAppliedJobs = lazy(() => import('./Components/Pages/Students/StudentAppliedJobs'));

const queryClient = new QueryClient();

function App() {
  const { currentUser } = useAuth();

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

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
      <SearchRoomsDetails />
      <ThemeProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar currentUser={currentUser} />
            <Suspense fallback={<h1>Loading...</h1>}>
              {currentUser && <Drawer currentUser={currentUser} />}
              {currentUser && <FormDialog />}
            </Suspense>

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
                    <Suspense>
                      <StudentDetails />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/Dashboard"
                element={
                  <RequiredAuth>
                    <Suspense>
                      <Dashboard />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/Applicants/:postId"
                element={
                  <RequiredAuth>
                    <Suspense>
                      <Applicants />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/PlacedForm"
                element={
                  <RequiredAuth>
                    <Suspense>
                      <Placed />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/PlacedStudents"
                element={
                  <RequiredAuth>
                    <Suspense>
                      <PlacedStudents />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path={`/jobstatus/:postId/:studentId`}
                element={
                  <RequiredAuth>
                    <Suspense>
                      <JobStatus />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/students"
                element={
                  <RequiredAuth>
                    <Suspense>
                      <Students />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
              <Route
                path="/students/jobsApplied/:studentId"
                exact
                element={
                  <RequiredAuth>
                    <Suspense>
                      <AppliedJobs />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>

              <Route
                path="/appliedjobs"
                exact
                element={
                  <RequiredAuth>
                    <Suspense>
                      <StudentAppliedJobs />
                    </Suspense>
                  </RequiredAuth>
                }
              ></Route>
            </Routes>
          </Router>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

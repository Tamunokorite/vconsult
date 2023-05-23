import React, { useEffect, useState } from 'react';
import './App.css';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Home from './Home';
import About from './About';
import Login from './auth/Login';
import Register from './auth/Register';
import Reset from './auth/Reset';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, logout } from "./firebase";
import ViewAppointments from './appointments/ViewAppointments';
import BookAppointment from './appointments/BookAppointment';
import ViewAppointment from './appointments/ViewAppointment';
import AppointmentCalendar from './appointments/AppointmentCalendar';
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import Withdraw from './withdraw';
// import useGoogle from './TestCalendar';

function App() {
  const [user, loading, error] = useAuthState(auth);
  const [balance, setBalance] = useState(0);
  const [isDoctor, setIsDoctor] = useState(false);
  const getDoctorStatus = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setIsDoctor(data.userType === "doctor");
        // alert(data.userType === "doctor");
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
    }
  };
  const fetchBalance = async () => {
    try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setBalance(data.balance);
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
    }
};
  useEffect(() => {
    if (user) {
      getDoctorStatus();
      fetchBalance();
    };
  }, [user, loading, error]);
  return (
    <div className="App">
      <Router>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Container fluid>
            <Navbar.Brand href="/">VConsult</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href='/'>Home</Nav.Link>
                <Nav.Link href='/about'>About</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                <Nav.Item>
                  <Nav.Link href='/login' className={user ? "d-none" : ""}>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/register' className={user ? "d-none" : ""}>Register</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/dashboard' className={user ? "" : "d-none"}>Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className={user ? "" : "d-none"} onClick={logout}>Logout</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href='/withdraw' className={isDoctor ? "" : "d-none"}>Withdraw (Balance: ₦{balance/100})</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> 
        <Routes>
          <Route path="/login" Component={Login}></Route>
          <Route path="/register" Component={Register}></Route>
          <Route path="/doctors/register" Component={Register}></Route>
          <Route path="/reset" Component={Reset}></Route>
          <Route path="/dashboard" Component={Dashboard}></Route>
          <Route path="/doctors/dashboard" Component={Dashboard}></Route>
          <Route path="/appointments" Component={ViewAppointments}></Route>
          <Route path="/appointments/:id" Component={ViewAppointment}></Route>
          <Route path="/doctors/appointments" Component={ViewAppointments}></Route>
          <Route path="/doctors/appointments/:id" Component={ViewAppointment}></Route>
          <Route path="/doctors/requests" Component={ViewAppointments}></Route>
          <Route path="/appointments/book" Component={BookAppointment}></Route>
          <Route path="/about" Component={About}></Route>
          <Route path="/calendar" Component={AppointmentCalendar}></Route>
          <Route path="/withdraw" Component={Withdraw}></Route>
          {/* <Route path="/testgoogle" Component={useGoogle}></Route> */}
          {/* <Route path="/zoomtest" Component={Meeting}></Route> */}
          <Route path="/" Component={Home}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import './App.css';
import { Navbar, Container, Nav, Row, Col } from 'react-bootstrap';
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
import ZoomMeetingButton from './TestZoom';
import GoogleCalendar from './TestCalendar';


const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 pt-3">
      <Container>
        <Row>
          <Col xs={12} md={4}>
            <h5>About Us</h5>
            <p>
              vConsult is a revolutionary telemedicine app that connects you with experienced doctors from the comfort of your own home. With vConsult, you can have virtual appointments and consultations with licensed medical professionals, eliminating the need for in-person visits and long waiting times.
            </p>
          </Col>
          <Col xs={12} md={4}>
            <h5>Contact</h5>
            <p>Email: info@example.com</p>
            <p>Phone: +1234567890</p>
          </Col>
          <Col xs={12} md={4}>
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
            </ul>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12} className="text-center">
            <p>&copy; {new Date().getFullYear()} vConsult. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

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
    } catch (err) {
      console.error(err);
      alert("An error occurred while fetching user data");
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
      alert("An error occurred while fetching user data");
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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand href="/">vConsult</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
              </Nav>
              <Nav className="justify-content-end">
                <Nav.Item>
                  <Nav.Link as={Link} to="/login" className={user ? "d-none" : ""}>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/register" className={user ? "d-none" : ""}>Register</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/dashboard" className={user ? "" : "d-none"}>Dashboard</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className={user ? "" : "d-none"} onClick={logout}>Logout</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/withdraw" className={isDoctor ? "" : "d-none"}>Withdraw (Balance: ₦{balance/100})</Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctors/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<ViewAppointments />} />
          <Route path="/appointments/:id" element={<ViewAppointment />} />
          <Route path="/doctors/appointments" element={<ViewAppointments />} />
          <Route path="/doctors/appointments/:id" element={<ViewAppointment />} />
          <Route path="/doctors/requests" element={<ViewAppointments />} />
          <Route path="/appointments/book" element={<BookAppointment />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<GoogleCalendar />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/zoomtest" element={<ZoomMeetingButton />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;

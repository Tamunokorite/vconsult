import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { Row, Col, Card, Container } from "react-bootstrap";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where, onSnapshot } from "firebase/firestore";
export default function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [userType, setUserType] = useState("patient");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    if (user) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        onSnapshot(q, (querySnapshot) => {
            setUserType(querySnapshot.docs[0].data().userType ? querySnapshot.docs[0].data().userType : "patient");
          })
    }
    fetchUserName();
  }, [user, loading]);
//   console.log(userType);
  if (userType === "patient") {
    return (
        <Container className="d-flex flex-column align-items-center mt-5">
            <Row><p>Hello, {name}</p></Row>
            <Row xs={12} md={6} className="mt-2 mb-2">
                <Col xs={12} md={6} className="mt-4 mb-4">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>My Appointments</Card.Title>
                            <Card.Text>
                            Take a look at your appointments and get ready for them. Please don't miss your appointments.
                            </Card.Text>
                            <Card.Link href="/appointments">View Appointments</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row xs={12} md={6} className="mt-2 mb-2">
                <Col xs={12} md={6} className="mb-4">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Book an Appointment</Card.Title>
                            <Card.Text>
                            We have Doctors that handle Primary Care, Men's Health, Women's Health, and many other specializations
                            </Card.Text>
                            <Card.Link href="/appointments/book">Book Now</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
      );
  }
  else {
    return (
        <Container className="d-flex flex-column align-items-center mt-5">
            <Row><p>Hello, {name}</p></Row>
            <Row xs={12} md={6} className="mt-2 mb-2">
                <Col xs={12} md={6} className="mb-4">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>View Appointments</Card.Title>
                            <Card.Text>
                            View new appointment requests from patients
                            </Card.Text>
                            <Card.Link href="/doctors/requests">View Requests</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row xs={12} md={6} className="mt-2 mb-2">
                <Col xs={12} md={6} className="mt-4 mb-4">
                    <Card style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>My Appointments</Card.Title>
                            <Card.Text>
                            Take a look at your appointments and get ready for them. Please don't miss your appointments.
                            </Card.Text>
                            <Card.Link href="/doctors/appointments">View Appointments</Card.Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
  }
}
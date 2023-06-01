import React from "react";
import Index1 from './img/indeximg1.jpg';
import Index2 from './img/indeximg2.jpg';
import Index3 from './img/indeximg3.avif';
import Index4 from './img/indeximg4.jpg';
import { Container, Row, Col, Carousel, Button } from "react-bootstrap";

export default function Home() {
  return (
    <Container fluid>
      <Row className="mb-5">
        <Col className="p-0 h-100">
          <Carousel fade className="h-100">
            <Carousel.Item>
              <img
                className="d-block w-100 home-img"
                src={Index1}
                alt="First slide"
              />
              <Carousel.Caption className="carousel-caption">
                <h3>Need To See a Doctor Now?</h3>
                <p>You're at the Right Place</p>
                <Button variant="outline-primary" href="/register">
                  Get Started
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 home-img"
                src={Index2}
                alt="Second slide"
              />

              <Carousel.Caption className="carousel-caption">
                <h3>Book Virtual Appointments</h3>
                <p>Make an Appointment to See a Doctor Today</p>
                <Button variant="outline-primary" href="/register">
                  Get Started
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 home-img"
                src={Index3}
                alt="Third slide"
              />

              <Carousel.Caption className="carousel-caption">
                <h3>Virtual Consultation</h3>
                <p>Meet with Your Doctor Remotely, from Any Location</p>
                <Button variant="outline-primary" href="/register">
                  Get Started
                </Button>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} className="mt-5">
          <img
            className="d-block w-100"
            src={Index4}
            alt="Second slide"
          />
        </Col>
        <Col xs={12} md={6}>
          <div className="about-section">
            <h3 className="h1">vConsult - Your Online Doctor</h3>
            <p>
              vConsult is a revolutionary telemedicine app that connects you with experienced doctors from the comfort of your own home. With vConsult, you can have virtual appointments and consultations with licensed medical professionals, eliminating the need for in-person visits and long waiting times.
            </p>
            <p>
              Our app offers a convenient and secure platform where you can discuss your health concerns, receive medical advice, and even get prescriptions, all through video calls or chat. We cover a wide range of medical specialties, ensuring that you find the right doctor for your specific needs.
            </p>
            <p>
              Whether you're dealing with minor illnesses, chronic conditions, or need a second opinion, vConsult is here to provide accessible and reliable healthcare. Our doctors are highly qualified, compassionate, and dedicated to delivering exceptional virtual care to patients like you.
            </p>
            <Button variant="outline-primary" href="/register">
              Get Started
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

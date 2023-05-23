import React from "react";
import Index1 from './img/indeximg1.jpg';
import { Container, Row, Col, Carousel, Button } from "react-bootstrap";

export default function Home()
{
    return (
        <Container fluid>
            <Row className="mb-5">
                <Col className="p-0 h-100">
                    <Carousel fade className="h-100">
                        <Carousel.Item>
                            <img
                            className="d-block w-100 img-fluid h-100"
                            src={Index1}
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            <h3>First slide label</h3>
                            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            <Button variant="outline-primary" href="/register">Get Started</Button>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100 img-fluid h-100"
                            src={Index1}
                            alt="Second slide"
                            />

                            <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <Button variant="outline-primary" href="/register">Get Started</Button>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100 img-fluid h-100"
                            src={Index1}
                            alt="Third slide"
                            />

                            <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>
                                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                            </p>
                            <Button variant="outline-primary" href="/register">Get Started</Button>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}><h3 className="h1">Book virtual appointments with Doctors from the comfort of your home</h3></Col>
                <Col xs={12} md={6}>
                    <img
                    className="d-block w-100"
                    src={Index1}
                    alt="Second slide"
                    />
                </Col>
                <Col xs={12} md={6}><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut vestibulum justo. Nunc auctor, dolor dignissim efficitur luctus, velit urna congue turpis, ut congue eros ligula non dolor. Praesent sed fermentum risus, id ultrices odio. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur placerat augue sit amet fringilla tempus. Mauris eu consequat enim. Mauris lorem elit, gravida sit amet bibendum id, viverra sed tellus. Vestibulum at rhoncus nisl, quis auctor erat. Etiam lectus elit, commodo at nisl ac, laoreet feugiat metus.</p></Col>
            </Row>
        </Container>
    )
}
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const Home: React.FC = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-4xl font-bold mb-4">Welcome to Coriander</h1>
          <p className="text-lg text-gray-600">
            Your new Electron + React + Tailwind + Bootstrap application is ready!
          </p>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Feature 1</Card.Title>
              <Card.Text>Some quick example text for the first feature card.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Feature 2</Card.Title>
              <Card.Text>Some quick example text for the second feature card.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Feature 3</Card.Title>
              <Card.Text>Some quick example text for the third feature card.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

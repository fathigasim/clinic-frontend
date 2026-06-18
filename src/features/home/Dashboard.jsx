import React from "react";
import WeeklyInvoiceCharts from "../invoice/components/WeeklyInvoiceCharts";
import MonthlyInvoiceCharts from "../invoice/components/MonthlyInvoiceCharts";
import DailyInvoiceCharts from "../invoice/components/DailyInvoiceCharts";
import InvoiceByDateReport from "../invoice/components/InvoiceByDateReport";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Card,
} from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="bg-dark text-white min-vh-100 p-0"
        >
          <div className="p-3 border-bottom">
            <h4>Clinic</h4>
          </div>

          <Nav className="flex-column p-3">
            <Nav.Link className="text-white">
              Dashboard
            </Nav.Link>

            <Nav.Link className="text-white">
              Patients
            </Nav.Link>

            <Nav.Link className="text-white">
              Doctors
            </Nav.Link>

            <Nav.Link className="text-white">
              Appointments
            </Nav.Link>

            <Nav.Link className="text-white">
              Invoices
            </Nav.Link>

            <Nav.Link className="text-white">
              Payments
            </Nav.Link>

            <Nav.Link className="text-white">
              Reports
            </Nav.Link>

            <Nav.Link className="text-white">
              Settings
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-0">
          {/* Top Navbar */}
          <Navbar bg="light" className="shadow-sm px-4">
            <Navbar.Brand>
              Dashboard
            </Navbar.Brand>

            <Nav className="ms-auto">
              <Nav.Link>Profile</Nav.Link>
              <Nav.Link>Logout</Nav.Link>
            </Nav>
          </Navbar>

          <Container fluid className="p-4">
            {/* Stats Cards */}
            <Row className="g-3">
              <Col md={3}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Total Patients</h6>
                    <h2>250</h2>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Appointments</h6>
                    <h2>35</h2>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Invoices</h6>
                    <h2>120</h2>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={3}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h6>Revenue</h6>
                    <h2>$5,200</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Welcome Section */}
            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <h4>Welcome Back</h4>
                    <p>
                      Manage patients, appointments,
                      invoices and payments from one
                      place.
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* Monthly & Weekly Stats */ }
             <Row className="mt-4">
              <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                   <MonthlyInvoiceCharts />
                  </Card.Body>
                </Card>
              </Col>
               <Col md={6}>
                <Card className="shadow-sm">
                  <Card.Body>
                   <WeeklyInvoiceCharts />
                  </Card.Body>
                </Card>
              </Col>
            </Row>

             {/* Daily Stats */ }
             <Row className="mt-4">
              <Col md={10}>
                <Card className="shadow-sm">
                  <Card.Body>
                   <DailyInvoiceCharts />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
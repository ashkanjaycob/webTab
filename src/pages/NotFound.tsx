import { Link } from "react-router-dom";
import { Container, Row, Card, Button } from "react-bootstrap";
import { House, RouterFill } from "react-bootstrap-icons";

const NotFoundPage = () => {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "75vh" }}
    >
      <Row>
        <Card className="text-center border-0 p-4">
          <Card.Body>
            <RouterFill size={60} className="text-danger mb-4" />
            <Card.Title className="display-5 fw-bold text-danger">
              404 - Page Not Found
            </Card.Title>
            <Card.Text className="text-muted fs-5">
              Oops! The page you are looking for does not exist.
            </Card.Text>
            <Button as={Link} to="/" variant="danger" className="mt-3">
              Back To Home
              <House className="me-2 mx-2" />
            </Button>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default NotFoundPage;

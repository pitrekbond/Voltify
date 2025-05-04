import { Modal, Button, Image, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";

function AddToCartModal({ show, onHide, product, qty }) {
  const navigate = useNavigate();

  function handleGoToCart() {
    navigate("/cart");
  }
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center justify-content-center gap-2">
          <FaCircleCheck color="green" size={20} />
          Added to Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="align-items-center">
          <Col xs={4}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              rounded
              className="border"
            />
          </Col>
          <Col xs={8}>
            <p className="mb-2">
              <strong>{product.name}</strong>
            </p>
            <p className="mb-0">Quantity: {qty}</p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="outline-dark" onClick={onHide}>
          Continue shopping
        </Button>
        <Button variant="dark" onClick={handleGoToCart}>
          Go to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddToCartModal;

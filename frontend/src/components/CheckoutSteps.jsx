import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <Nav className="justify-content-center mb-4 checkout-steps">
      <Nav.Item className={step1 ? "active" : ""}>
        {step1 ? (
          <LinkContainer to="/login">
            <Nav.Link className="step-link">Sign In</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-link">
            Sign In
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step2 ? "active" : ""}>
        {step2 ? (
          <LinkContainer to="/shipping">
            <Nav.Link className="step-link">Shipping</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-link">
            Shipping
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step3 ? "active" : ""}>
        {step3 ? (
          <LinkContainer to="/payment">
            <Nav.Link className="step-link">Payment</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-link">
            Payment
          </Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item className={step4 ? "active" : ""}>
        {step4 ? (
          <LinkContainer to="/placeorder">
            <Nav.Link className="step-link">Place Order</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled className="step-link">
            Place Order
          </Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
}

export default CheckoutSteps;

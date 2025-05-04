import { Button, Col, Form, Row } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { savePaymentMethod } from "../slices/cartSlice";

function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  useEffect(
    function () {
      if (!shippingAddress) {
        navigate("/shipping");
      }
    },
    [navigate, shippingAddress]
  );

  function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }

  useEffect(() => {
    document.title = "Payment";
  }, []);

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h1>Payment method</h1>
          <Form className="mt-4" onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label as="legend">Select Method</Form.Label>
              <Col>
                <Form.Check
                  type="radio"
                  className="my-2 black-radio"
                  label="PayPal / Credit Card"
                  id="PayPal"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check>
                {/* <Form.Check
                  type="radio"
                  className="my-2 black-radio"
                  label="Credit Card"
                  id="CreditCard"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={paymentMethod === "CreditCard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></Form.Check> */}
              </Col>
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              className="mt-4 py-2 px-2"
              style={{ fontSize: "1.2rem" }}
            >
              Continue
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default PaymentScreen;

import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { saveShippingAddress } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { COUNTRIES } from "./../constants";
import CheckoutSteps from "../components/CheckoutSteps";

function ShippingScreen() {
  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function submitHandler(e) {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      toast.error("Please fill in all fields");
      return;
    }
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  }

  useEffect(() => {
    document.title = "Shipping";
  }, []);

  return (
    <>
      <CheckoutSteps step1 step2 />
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h1>Shipping</h1>
          <Form onSubmit={submitHandler} className="mt-4">
            <Form.Group controlId="address" className="my-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="gray-focus"
              />
            </Form.Group>
            <Form.Group controlId="city" className="my-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="gray-focus"
              />
            </Form.Group>
            <Form.Group controlId="postalCode" className="my-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="gray-focus"
              />
            </Form.Group>
            <Form.Group controlId="country" className="my-3">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="gray-focus"
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              className="mt-4 py-2 px-2"
              style={{ fontSize: "1.2rem" }}
            >
              Proceed to payment
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default ShippingScreen;

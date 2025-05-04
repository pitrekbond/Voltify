import { Button, Col, Image, ListGroup, Row } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Loader from "./../components/Loader";

function PlaceOrderScreen() {
  const {
    shippingAddress,
    paymentMethod,
    cartItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = useSelector((state) => state.cart);
  const { address, city, postalCode, country } = shippingAddress;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(
    function () {
      if (!shippingAddress.address) {
        navigate("/shipping");
      } else if (!paymentMethod) {
        navigate("/payment");
      }
    },
    [navigate, paymentMethod, shippingAddress]
  );

  async function placeOrderHandler() {
    try {
      const res = await createOrder({
        cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCart());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error.data.detail);
    }
  }

  useEffect(() => {
    document.title = "Place order";
  }, []);

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="mt-5">
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item className="py-4">
              <h2>Shipping</h2>
              <strong>Address:</strong> {address}, {postalCode} {city},{" "}
              {country}
            </ListGroup.Item>
            <ListGroup.Item className="py-4">
              <h2>Payment Method</h2>
              <strong>Method:</strong> {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item className="py-4">
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="py-4">
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/product/${item._id}`}
                            className="product-title-link"
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={3}>
                          {item.qty} x ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup className="listgroup-border">
            <ListGroup.Item className="py-3 text-center">
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Items:</Col>
                <Col>${itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Shipping:</Col>
                <Col>
                  {shippingPrice === "0.00" ? "FREE" : `$${shippingPrice}`}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Tax:</Col>
                <Col>${taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>
                  <b>Total:</b>
                </Col>
                <Col>
                  <b>${totalPrice}</b>
                </Col>
              </Row>
            </ListGroup.Item>
            {error && (
              <ListGroup.Item>
                <Message variant="danger">
                  {error?.data?.message || error.error}
                </Message>
              </ListGroup.Item>
            )}
            <ListGroup.Item className="py-3">
              <Button
                type="button"
                variant="dark"
                style={{
                  width: "50%",
                  margin: "0 auto",
                  display: "block",
                  fontSize: "1.2rem",
                }}
                className="py-2"
                disabled={cartItems.length === 0}
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
              {isLoading && <Loader />}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default PlaceOrderScreen;

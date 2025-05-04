import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

function CartScreen() {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function updateCartQtyHandler(item, qty) {
    dispatch(addToCart({ ...item, qty }));
  }

  function deleteItemHandler(productId) {
    dispatch(removeFromCart(productId));
  }

  function checkoutHandler() {
    navigate("/login?redirect=/shipping");
  }

  useEffect(() => {
    document.title = "Cart";
  }, []);

  return (
    <Row>
      <Col md={8}>
        <h1>Your cart</h1>
        {cartItems.length === 0 ? (
          <>
            {" "}
            <Message>
              Your cart is empty. Add items to the cart to proceed.
            </Message>
            <LinkContainer to="/">
              <Button
                variant="dark"
                style={{
                  width: "70%",
                  margin: "0 auto",
                  display: "block",
                  fontSize: "1.2rem",
                }}
                className="py-2"
              >
                Go to products
              </Button>
            </LinkContainer>
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id} className="py-3">
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      to={`/product/${item._id}`}
                      className="product-title-link"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </Col>
                  <Col md={2}>
                    <span className="cart-price">${item.price}</span>
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        updateCartQtyHandler(item, Number(e.target.value))
                      }
                      className="gray-focus"
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      className="py-2"
                      onClick={() => deleteItemHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <ListGroup className="listgroup-border">
          <ListGroup.Item className="py-4 text-center">
            <h3>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
              items)
            </h3>
            <span className="cart-price">
              {" "}
              $
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="py-4">
            <Button
              type="button"
              variant="dark"
              style={{
                width: "70%",
                margin: "0 auto",
                display: "block",
                fontSize: "1.2rem",
              }}
              className="py-2"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </Button>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}

export default CartScreen;

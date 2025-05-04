import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import { usePayPalScriptReducer, PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { toast } from "react-toastify";

function OrderDetailsScreen() {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [payOrder, { isLoading: isLoadingPay }] = usePayOrderMutation();
  const {
    data: paypal,
    isLoading: isLoadingPaypal,
    error: errorPaypal,
  } = useGetPayPalClientIdQuery();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  useEffect(
    function () {
      if (!errorPaypal && !isLoadingPaypal && paypal.clientId) {
        const loadPayPalScript = async function () {
          paypalDispatch({
            type: "resetOptions",
            value: {
              "client-id": paypal.clientId,
              currency: "USD",
            },
          });
          paypalDispatch({ type: "setLoadingStatus", value: "pending" });
        };
        if (order && !order.isPaid) {
          if (!window.paypal) {
            loadPayPalScript();
          }
        }
      }
    },
    [order, paypal, paypalDispatch, errorPaypal, isLoadingPaypal]
  );

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Order paid successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  async function markAsDeliveredHandler() {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
      toast.success("Order delivered!");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  useEffect(() => {
    document.title = "Order Details";
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    isDelivered,
  } = order;

  return (
    <Row className="mt-2">
      <Col md={8}>
        <h1>Your order details</h1>
        <ListGroup variant="flush">
          <ListGroup.Item
            className="py-4"
            // style={{ borderBottom: "1px solid #dee2e6" }}
          >
            <h2 className="mb-4">Order Items</h2>
            <ListGroup className="listgroup-border">
              {orderItems.map((item) => (
                <ListGroup.Item key={item._id} className="py-4 ">
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link
                        to={`/product/${item.product}`}
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
          </ListGroup.Item>
          <ListGroup.Item className="py-4">
            <h2 className="mb-4">Shipping</h2>
            <p>
              <strong>Name:</strong> {order?.user?.name || "User deleted"}
            </p>
            <p>
              <strong>Email:</strong> {order?.user?.email || "User deleted"}
            </p>
            <p>
              <strong>Delivery Address:</strong> {shippingAddress.address},{" "}
              {shippingAddress.postalCode} {shippingAddress.city},{" "}
              {shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <Message variant="success">Delivered {order.deliveredAt}</Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </ListGroup.Item>
          <ListGroup.Item className="py-4">
            <h2 className="mb-4">Payment</h2>
            <p>
              <strong>Payment Method:</strong> {paymentMethod}
            </p>
            {order.isPaid ? (
              <Message variant="success">Paid {order.deliveredAt}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </ListGroup.Item>
        </ListGroup>
      </Col>
      <Col md={4}>
        <Card className="mt-5">
          <ListGroup variant="flush">
            <ListGroup.Item className="py-3 text-center">
              <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Items</Col>
                <Col>${itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Shipping</Col>
                <Col>
                  {shippingPrice === "0.00" ? "FREE" : `$${shippingPrice}`}
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>Tax</Col>
                <Col>${taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="py-3">
              <Row>
                <Col>
                  <b>Total</b>
                </Col>
                <Col>
                  <b>${totalPrice}</b>
                </Col>
              </Row>
            </ListGroup.Item>
            {!isPaid && (
              <ListGroup.Item className="py-3">
                {isLoadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <div>
                    {/* <Button
                      onClick={onApproveTest}
                      style={{ marginBottom: "10px" }}
                    >
                      Test Pay Order
                    </Button> */}
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                )}
              </ListGroup.Item>
            )}
            {isPaid && userInfo.isAdmin && !isDelivered && (
              <ListGroup.Item className="py-3">
                {isDelivering ? (
                  <Loader />
                ) : (
                  <Button
                    type="button"
                    variant="dark"
                    style={{
                      width: "70%",
                      margin: "0 auto",
                      display: "block",
                      fontSize: "1.2rem",
                    }}
                    onClick={markAsDeliveredHandler}
                  >
                    Mark as Delivered
                  </Button>
                )}
              </ListGroup.Item>
            )}
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default OrderDetailsScreen;

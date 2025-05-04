import { Button, Col, Row, Table } from "react-bootstrap";
import {
  useDeleteOrderMutation,
  useGetMyOrdersQuery,
} from "../slices/ordersApiSlice";
import { FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "./../components/Loader";
import Message from "./../components/Message";
import { useEffect } from "react";
import { toast } from "react-toastify";

function MyOrdersScreen() {
  const { data: orders, isLoading, refetch, error } = useGetMyOrdersQuery();
  const [deleteOrder, { isDeleting }] = useDeleteOrderMutation();

  useEffect(() => {
    document.title = "My orders";
  }, []);

  async function deleteHandler(orderId) {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        refetch();
        toast.success("Order deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  }

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Row className="justify-content-md-center mx-0">
      <Col xs={12}>
        <h1 className="text-center mb-4">My orders</h1>
        <Table bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }}></FaTimes>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }}></FaTimes>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="dark" className="btn-sm mx-2">
                      Details
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn-sm"
                    disabled={order.isPaid}
                    onClick={() => deleteHandler(order._id)}
                  >
                    Cancel order
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isDeleting && <Loader />}
      </Col>
    </Row>
  );
}

export default MyOrdersScreen;

import { Card, Col, Row } from "react-bootstrap";
import { useGetAllOrdersQuery } from "../../slices/ordersApiSlice";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";

const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

function Statistics() {
  const { data: orders, isLoading, error } = useGetAllOrdersQuery();
  const [topProductsByQuantity, setTopProductsByQuantity] = useState([]);
  const [topProductsByRevenue, setTopProductsByRevenue] = useState([]);
  const [allOrdersCount, setAllOrdersCount] = useState(0);
  const [paidOrdersCount, setPaidOrdersCount] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [ordersByDay, setOrdersByDay] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const COLORS2 = ["#6A5ACD", "#20B2AA", "#CD853F", "#DC143C", "#9370DB"];

  useEffect(() => {
    if (orders) {
      setAllOrdersCount(orders.length);

      const paidOrders = orders.filter((order) => order.isPaid);
      setPaidOrdersCount(paidOrders.length);

      setRevenue(paidOrders.reduce((acc, order) => acc + order.totalPrice, 0));

      setAverageOrderValue(
        paidOrders.reduce((acc, order) => acc + order.totalPrice, 0) /
          paidOrders.length
      );

      let productStats = [];

      paidOrders.forEach((order) => {
        order.orderItems.forEach((item) => {
          // Check if product already exists in the array
          const existingProduct = productStats.find(
            (product) => product.productId === item.product
          );

          if (existingProduct) {
            // Update existing product stats
            existingProduct.totalQuantity += item.qty;
            existingProduct.totalRevenue += item.qty * item.price;
          } else {
            // Add new product to the array
            productStats.push({
              productId: item.product,
              name: item.name,
              totalQuantity: item.qty,
              totalRevenue: item.qty * item.price,
            });
          }
        });
      });

      // Get top 5 by quantity
      const byQuantity = [...productStats]
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);

      // Get top 5 by revenue
      const byRevenue = [...productStats]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);

      setTopProductsByQuantity(byQuantity);
      setTopProductsByRevenue(byRevenue);

      const dailyOrders = {};
      const orderDates = [];

      orders.forEach((order) => {
        const date = new Date(order.createdAt);
        const dateString = date.toLocaleDateString();
        dailyOrders[dateString] = (dailyOrders[dateString] || 0) + 1;
        orderDates.push(date);
      });

      // Get min and max dates
      const minDate = new Date(Math.min(...orderDates));
      const maxDate = new Date(Math.max(...orderDates));

      // Generate all dates in range
      const allDates = getDateRange(minDate, maxDate);

      // Convert to array format for Recharts with 0 for missing dates
      const ordersByDayArray = allDates.map((date) => {
        const dateString = date.toLocaleDateString();
        return {
          date: dateString,
          count: dailyOrders[dateString] || 0,
        };
      });

      setOrdersByDay(ordersByDayArray);
    }
  }, [orders]);

  useEffect(() => {
    document.title = "Admin - Statistics";
  }, []);

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <Row>
        <h1 className="text-center mb-4">Statistics</h1>
        <Row>
          <Col md={6} className="mb-3">
            <Card
              className="p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="text-center">Top Products by Quantity Sold</h3>
              <div style={{ height: "450px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProductsByQuantity}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="totalQuantity"
                      nameKey="name"
                      // label={({ name, percent }) =>
                      //   `${name}: ${(percent * 100).toFixed(0)}%`
                      // }
                    >
                      {topProductsByQuantity.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} sold`,
                        props.payload.name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card
              className="p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="text-center">Top Products by Revenue Generated</h3>
              <div style={{ height: "450px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProductsByRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="totalRevenue"
                      nameKey="name"
                      // label={({ name, percent }) =>
                      //   `${name}: ${(percent * 100).toFixed(0)}%`
                      // }
                    >
                      {topProductsByRevenue.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS2[index % COLORS2.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `Total revenue $${value.toFixed(2)}`,
                        props.payload.name,
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={3} className="mb-3">
            <Card
              className="text-center p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Title>Total Orders</Card.Title>
              <Card.Body>
                <h2>{allOrdersCount}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card
              className="text-center p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Title>Paid Orders</Card.Title>
              <Card.Body>
                <h2>{paidOrdersCount}</h2>
                {/* <small>
                  {((paidOrdersCount / allOrdersCount) * 100 || 0).toFixed(1)}%
                  of total
                </small> */}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card
              className="text-center p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Title>Total Revenue</Card.Title>
              <Card.Body>
                <h2>${revenue.toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card
              className="text-center p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <Card.Title>Average Order Value</Card.Title>
              <Card.Body>
                <h2>${averageOrderValue.toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card
              className="p-3"
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <h3 className="text-center">Orders Created by Day</h3>
              <div style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ordersByDay}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [
                        `${value} order${value === 1 ? "" : "s"}`,
                      ]}
                      labelFormatter={(date) => `${date}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Number of orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </Row>
    </>
  );
}

export default Statistics;

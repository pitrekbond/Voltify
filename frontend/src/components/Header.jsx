import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaClipboardList,
} from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import Searchbox from "./Searchbox";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

export default function Header() {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  async function logoutHandler() {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              {/* <img src={logo} alt="ShoPro" height={60} width={60} /> */}
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.8rem",
                  letterSpacing: "3px",
                  fontWeight: "600",
                  marginLeft: "10px",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(90deg, #00ff87, #00e676, #00c853)", // Green gradient
                  WebkitBackgroundClip: "text", // For Safari
                  backgroundClip: "text",
                  color: "transparent", // Makes the gradient visible
                  textShadow: "0 0 8px rgba(0, 255, 135, 0.3)", // Green glow
                }}
              >
                Voltify
              </span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin Functionality" id="admin">
                  <LinkContainer to="/admin/orderList">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productList">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userList">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/statistics">
                    <NavDropdown.Item>Statistics</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              <Searchbox />
              {/* Mobile view - icons in one row */}
              <div className="d-flex d-md-none justify-content-around w-100 my-2">
                <LinkContainer to="/cart">
                  <Nav.Link className="px-2">
                    <FaShoppingCart className="icon-large" />
                    {cartItems.length > 0 && (
                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                        {cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/wishlist">
                  <Nav.Link className="px-2">
                    <FaHeart className="icon-large" />
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <Nav.Link className="px-2">
                    <FaClipboardList className="icon-large" />
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown
                    title={<FaUser className="icon-large" />}
                    id="username-mobile"
                    className="px-2"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="px-2">
                      <FaUser className="icon-large" />
                    </Nav.Link>
                  </LinkContainer>
                )}
              </div>

              {/* Desktop view - normal layout */}
              <div className="d-none d-md-flex">
                <LinkContainer to="/cart">
                  <Nav.Link className="nav-link-spacing">
                    <FaShoppingCart className="icon-large" />
                    {cartItems.length > 0 && (
                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                        {cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                      </Badge>
                    )}
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/wishlist">
                  <Nav.Link className="nav-link-spacing">
                    <FaHeart className="icon-large" />
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <Nav.Link className="nav-link-spacing">
                    <FaClipboardList className="icon-large" />
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link className="nav-link-spacing">
                      <FaUser className="icon-large" />
                    </Nav.Link>
                  </LinkContainer>
                )}
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

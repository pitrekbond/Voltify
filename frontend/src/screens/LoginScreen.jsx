import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { LinkContainer } from "react-router-bootstrap";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(
    function () {
      if (userInfo) {
        navigate(redirect);
      }
    },
    [userInfo, navigate, redirect]
  );

  useEffect(() => {
    document.title = "Login";
  }, []);

  const [login, { isLoading }] = useLoginMutation();

  async function submitHandler(e) {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <h1>Sign in</h1>
        <Form onSubmit={submitHandler} className="mt-4">
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="password" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Button
            type="submit"
            variant="dark"
            className="mt-2 py-2 px-4"
            disabled={isLoading}
          >
            Sign In
          </Button>
          {isLoading && <Loader />}
        </Form>

        <div className="py-5">
          New Customer? <br />
          <LinkContainer
            to={{
              pathname: "/register",
              search: redirect ? `redirect=${redirect}` : "",
            }}
          >
            <Button variant="outline-dark" className="mt-2 py-2 px-4">
              Register here
            </Button>
          </LinkContainer>
          {/* <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register here
          </Link> */}
        </div>
      </Col>
    </Row>
  );
}

export default LoginScreen;

import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    document.title = "Register";
  }, []);

  const [register, { isLoading }] = useRegisterMutation();

  async function submitHandler(e) {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

  return (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <h1>Register</h1>
        <Form onSubmit={submitHandler} className="mt-4">
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
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
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Button
            type="submit"
            variant="dark"
            className="mt-2 py-2 px-4"
            disabled={isLoading}
          >
            Register
          </Button>
          {isLoading && <Loader />}
        </Form>

        <div className="py-5">
          Already have an account? <br />
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Log in
          </Link>
        </div>
      </Col>
    </Row>
  );
}

export default RegisterScreen;

import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "./../components/Loader";

function UserProfileScreen() {
  const { userInfo } = useSelector((state) => state.auth);
  const { name: userName, email: userEmail } = userInfo;

  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    document.title = "Update Profile";
  }, []);

  async function submitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passswords do not match!");
    } else {
      try {
        const updatedUser = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...updatedUser }));
        setPassword("");
        setConfirmPassword("");
        toast.success("User profile updated");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  }

  return isLoading ? (
    <Loader />
  ) : (
    <Row className="justify-content-md-center mt-5">
      <Col xs={12} md={6}>
        <h1>User Profile</h1>
        <Form className="mt-4" onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="email" className="my-3">
            <Form.Label>Email</Form.Label>
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
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="my-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="gray-focus"
            />
          </Form.Group>
          <Button
            type="submit"
            variant="dark"
            className="py-2 px-2"
            style={{ fontSize: "1.2rem" }}
            disabled={!name && !email && !password && !confirmPassword}
          >
            Update Profile
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

export default UserProfileScreen;

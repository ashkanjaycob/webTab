import React, { useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Toast } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { setLanguage } from "../../../features/language/languageSlice";
import { deleteCookie } from "../../../utils/cookie";
import { logout } from "../../../features/auth/authSlice";
import Swal from "sweetalert2";
import { Mailbox } from "react-bootstrap-icons";

const AppNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const handleHomeClick = () => {
    if (!isAuthenticated) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000); // Toast will appear for 3 seconds
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: language === "fa" ? "آیا از خروج اطمینان دارید؟" : "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: language === "fa" ? "بله" : "Yes",
      cancelButtonText: language === "fa" ? "خیر" : "No",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCookie("userToken");
        deleteCookie("refreshToken");
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  return (
    <>
      <Toast
        style={{
          position: "fixed",
          bottom: "60px",
          left: "10px",
          zIndex: 9999,
        }}
        show={showToast}
        delay={2000}
        autohide
      >
        <Toast.Body className="bg-danger text-white">
          {language === "fa" ? "ابتدا وارد شوید" : "Please, Login First"}
        </Toast.Body>
      </Toast>

      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>WebTab</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto gap-2 p-2">
              <Nav.Link as={Link} to="/" onClick={handleHomeClick}>
                {language === "fa" ? "خانه" : "Home"}
              </Nav.Link>
              {!isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to="/login">
                    {language === "fa" ? "ورود" : "Login"}
                  </Nav.Link>
                  <Nav.Link as={Link} to="/register">
                    {language === "fa" ? "ثبت‌نام" : "Register"}
                  </Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={handleLogout}>
                  {language === "fa" ? "خروج" : "Logout"}
                </Nav.Link>
              )}
            </Nav>
            <Nav className="p-2">
              {user && (
                <NavDropdown
                  title={
                    language === "fa"
                      ? `${user.name} ${user.lastName}`
                      : `${user.name} ${user.lastName}`
                  }
                  id="user-nav-dropdown"
                >
                  <NavDropdown.Item disabled>
                    {language === "fa" ? "ایمیل: " : <Mailbox  className="mx-2"/>}
                    {user.email}
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              <NavDropdown
                title={language === "fa" ? "زبان‌ها" : "Languages"}
                id="language-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => handleLanguageChange("en")}>
                  English
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleLanguageChange("fa")}>
                  فارسی
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;

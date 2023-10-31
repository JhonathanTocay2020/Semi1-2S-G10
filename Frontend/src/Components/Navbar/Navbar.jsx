import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import React,{ useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

function Navigation() {
    const [userName] = useState(localStorage.getItem('Nombre'));
    let navigate = useNavigate();

    function handleLogout() {
      localStorage.clear();
      navigate("/login");
      window.location.reload();
      return 
    }
  
      if (userName == null) {
        return(
            <Navbar bg="primary" variant='dark' expand="lg">
            <Container>
                <Navbar.Brand href="/home">
                    <i className="bi bi-person-badge-fill"></i>
                    SemiSocial
                </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/home">
                        <i className="bi bi-house"></i>
                        Home
                    </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        )
      }
      return(
      <Navbar bg="primary" variant="dark" expand="lg">
          <Container>
              <Navbar.Brand href="/">
                <i className="bi bi-person-badge-fill"></i>
                SemiSocial
              </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                  <Nav.Link href="/">
                      <i className="bi bi-house"></i>
                      Home
                  </Nav.Link>
                  <Nav.Link href="/profile">
                      <i className="bi bi-person-fill"></i>
                      Editar Perfil
                  </Nav.Link>
                  <Nav.Link href="/noFriendsList">
                      <i className="bi bi-person-plus-fill"></i>
                      Agregar Amigos
                  </Nav.Link>
                  <Nav.Link href="/requests">
                      <i className="bi bi-people-fill"></i>
                      Ver Solicitudes
                  </Nav.Link>
                  
              </Nav>
                <Navbar.Brand>
                  Hola @{userName} !
                  <Button variant="outline-info" style={{marginLeft:15}} onClick={handleLogout}>Cerrar Sesion</Button>
              </Navbar.Brand>
            </Navbar.Collapse>
          </Container>
        </Navbar>    
      );
}
export default Navigation
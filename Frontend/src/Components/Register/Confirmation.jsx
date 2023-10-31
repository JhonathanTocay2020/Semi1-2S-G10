import React, { useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import {Alert} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import config from "../../config";


import '../Login/Login.css';


function Confirmation() {

  const [emailTemp, setEmailTemp] = useState(localStorage.getItem("emailTemp"));

  const [validated, setValidated] = useState(false);
  let navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [alertClass, setAlertClass] = useState("");

  useEffect(() => {

    if (emailTemp!=null){
      document.getElementById("inputEmail").value = emailTemp
    } 

    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [showAlert]);

  const ShowMsg = (alertClass, alertText) => {
    setShowAlert(true);
    setAlertClass(alertClass);
    setAlertText(alertText);
  }

  //********************************************************************************** */

  const handleSubmit = (event) => {

    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() === false) {return}

    const data = {
      correo :event.target.Correo.value,
      codigo:event.target.codigo.value,
    };
    
    config.requestOptionsPOST.body = JSON.stringify(data)
    console.log(`${config.apiUrl}/verificar-cuenta`)
    console.log(data)

    fetch(`${config.apiUrl}/verificar-cuenta`,config.requestOptionsPOST)
    .then(response => {      
        console.log(response);
        if (!response.ok) {
            ShowMsg('danger','Error inesperado al validar codigo.');        
        }
        return response.json();
    })
    .then((data) => {
        if (!data.confirmado) {
            ShowMsg('danger',data.mensaje);
            return
        }
        
        localStorage.clear()

        ShowMsg('success','El correo se ha verificado correctamente.');
        setTimeout(() => {return navigate("/login");}, 2500);
        
    }).catch((error) => {
        console.error(error.message)
        ShowMsg('danger','Error al iniciar sesion: '+error.message);
    });
       
  };



  return (
    <div className="container">
        <div className="card1 card1-container">
        {showAlert && (
          <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
              {alertText}
          </Alert>
        )}
            <img id="profile-img" className="profile-img-card1" src="add.png" alt=''/>
            <p id="profile-name" className="profile-name-card1"></p>
            <p className='h6'>Ingrese el codigo de confirmacion que le fue enviado al correo:</p>
            <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-signin">
                <span id="reauth-email" className="reauth-email"></span>
                <Form.Group>
                  <Form.Control type="email" id="inputEmail" className="form-control" placeholder="Email" required  name='Correo'/>
                  <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Ingrese un correo válido.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Control autoFocus type="number" style={{marginBottom:20}} id="inputPassword" className="form-control" placeholder="Codigo Verificacion" required name='codigo'/>
                  <Form.Control.Feedback type="invalid" style={{marginTop:-15,marginBottom:10}}>Ingrese su Codigo Validacion</Form.Control.Feedback>
                </Form.Group>
                <button className="btn btn-success btn-block" type="submit">Verificar</button>

            </Form>

        </div>
    </div>

  );
}

export default Confirmation;
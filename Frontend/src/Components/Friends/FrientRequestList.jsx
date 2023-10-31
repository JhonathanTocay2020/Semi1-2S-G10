import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import config from '../../config';
import { Modal, Button, Alert } from "react-bootstrap";


function FrientRequestList() {

    const [usuariosDesconocidos, setUsuariosDesconocidos] = useState([])

    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertClass, setAlertClass] = useState("");

    const ShowMsg = (alertClass, alertText) => {
        setShowAlert(true);
        setAlertClass(alertClass);
        setAlertText(alertText);
    }
  

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId===null){
          return navigate("/login");
        } 

        console.log(`${config.apiUrl}/solicitudes-amistad`)
        fetch(`${config.apiUrl}/solicitudes-amistad`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setUsuariosDesconocidos(data.solicitudes)
        }) 
        .catch((error) => {
            console.error(error)
            ShowMsg("danger","Error",error)
        });
    },[]);
    
    function aceptarSolicitud(id) {
        console.log(`${config.apiUrl}/aceptar-amistad/${id}`)
        fetch(`${config.apiUrl}/aceptar-amistad/${id}`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) { console.error(response); }
            console.log(response)
            return response.json();
        })
        .then((data) => {
          console.log(data)
          ShowMsg("warning",data.mensaje)
        })
        .catch((error) => {
          console.error(error.message)
          ShowMsg("danger",error.message)
        });   

    }

    function rechazarSolicitud(id) {
        console.log(`${config.apiUrl}/rechazar-amistad/${id}`)
        fetch(`${config.apiUrl}/rechazar-amistad/${id}`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) { console.error(response); }
            console.log(response)
            return response.json();
        })
        .then((data) => {
            ShowMsg("warning",data.mensaje)
        })
        .catch((error) => {
          console.error(error.message)
          ShowMsg("danger",error.message)
        });   
    }

        return (
            <div style={{padding:20}}>

                {showAlert && (
                    <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                        {alertText}
                    </Alert>
                )}
                 
                <h4>Personas que quiza conozcas</h4>

                <div className="row" style={{marginTop:20}}>
                    {usuariosDesconocidos.length === 0 &&(
                        <Alert variant='info'>¡No hay ninguna solicitud de amistad!</Alert>
                    )}
                    {usuariosDesconocidos.map((soli,index) => (
                        <div className="col-sm-6" key={index}>
                            <div className="card" style={{marginTop:20}}>
                            <div className="card-body">
                                <h5 className="card-title">{soli.nombre}</h5>                                                                
                                <a  className="btn btn-success" 
                                    style={{marginRight:10}} 
                                    onClick={() => aceptarSolicitud(soli.id)}>
                                    <i className="bi bi-check2"></i>
                                    Agregar
                                </a>
                                <a className="btn btn-danger" 
                                    style={{marginRight:10}}
                                    onClick={() => rechazarSolicitud(soli.id)}    
                                >
                                    <i className="bi bi-x-lg"></i>
                                    Rechazar
                                </a>
                                
                            </div>
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        );
    
}

export default FrientRequestList;

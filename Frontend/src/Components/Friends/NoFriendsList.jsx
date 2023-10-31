import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import config from '../../config';
import { Modal, Button, Alert } from "react-bootstrap";


function NoFriendsList() {

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

        console.log(`${config.apiUrl}/listar-desconocidos`)
        fetch(`${config.apiUrl}/listar-desconocidos`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            setUsuariosDesconocidos(data.usuarios)
        }) 
        .catch((error) => {
            console.error(error)
            ShowMsg("danger","Error",error)
        });
    },[]);
    

    function enviarSolicitud(idUsuario) {
        console.log(`${config.apiUrl}/agregar-amigo`)
        const data = {
            usuario : idUsuario
        };
        config.requestOptionsPOST.body = JSON.stringify(data)
        console.log(data)
    
        fetch(`${config.apiUrl}/agregar-amigo`,config.requestOptionsPOST)
        .then(response => {
            if (!response.ok) { console.error(response); }
            console.log(response)
            return response.json();
        })
        .then((data) => {
          if(data.agregado){
            ShowMsg('success',data.mensaje);
          }else{
            ShowMsg('danger',data.mensaje);
          }
          setTimeout(() => {window.location.reload();}, 2500);
        })
        .catch((error) => {
          console.error(error.message)
          ShowMsg("danger","Error",error.message)
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
                        <Alert variant='info'>¡No hay ninguna persona por agregar!</Alert>
                    )}
                    {usuariosDesconocidos.map((soli,index) => (
                        <div className="col-sm-6" key={index}>
                            <div className="card" style={{marginTop:20}}>
                            <div className="card-body">
                                <h5 className="card-title">{soli.nombre}</h5>                                
                                
                                <a  className="btn btn-info" 
                                    style={{marginRight:10}} 
                                    onClick={() => enviarSolicitud(soli.id)}>
                                   <i className="bi bi-person-plus-fill"></i>
                                    Enviar Solicitud
                                </a>
                                
                            </div>
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        );
    
}

export default NoFriendsList;

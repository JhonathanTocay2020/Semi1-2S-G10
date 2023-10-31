import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import config from '../../config';
import { Modal, Button, Alert } from "react-bootstrap";


function FriendsList() {

    const [usuariosAmigos, setUsuariosAmigos] = useState([])

    const ShowMsg = (alertClass, alertText) => {
        setShowAlert(true);
        setAlertClass(alertClass);
        setAlertText(alertText);
    }


    useEffect(() => {

        const userId = localStorage.getItem('userId');
        if (userId === null) {
            return navigate("/login");
        }

        console.log(`${config.apiUrl}/listar-amigos`)
        fetch(`${config.apiUrl}/listar-amigos`, config.requestOptionsGET)
            .then(response => {
                if (!response.ok) {
                    console.error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                setUsuariosAmigos(data.usuarios)
            })
            .catch((error) => {
                console.error(error)
                ShowMsg("danger", "Error", error)
            });
    }, []);


    return (
        <div style={{ padding: 20 }}>

            <h4>Amigos</h4>

            <div className="row" style={{ marginTop: 20 }}>
                {usuariosAmigos.length === 0 && (
                    <Alert variant='info'>¡No hay ningun amigo!</Alert>
                )}
                {usuariosAmigos.map((soli, index) => (
                    <div className="col-sm-6" key={index}>
                        <div className="card" style={{ marginTop: 20 }}>
                            <div className="card-body">
                                <h5 className="card-title">{soli.nombre}</h5>
                            </div>
                        </div>
                    </div>
                ))}


            </div>
        </div>
    );

}

export default FriendsList;

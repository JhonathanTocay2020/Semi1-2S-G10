import React, { useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import config from '../../config';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import {Alert} from 'react-bootstrap';

import styles from './AgregarPublicacion.module.css'; // Archivo CSS para estilos personalizados

function AgregarPublicacion() {

    const [image64, setImage64] = useState("default.jpg");
    const [validated, setValidated] = useState(false);
    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertClass, setAlertClass] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId==null){
          return navigate("/login");
        }
    },[]);

    const ShowMsg = (alertClass, alertText) => {
      setShowAlert(true);
      setAlertClass(alertClass);
      setAlertText(alertText);
    }

    const handleClose = () => {setShow(false)};
    const handleShow = () => {setShow(true)};

    const toBase64 = (event) => {          
        if (event.target.files && event.target.files[0]) {

          if (event.target.files[0].size > config.maxImgSize) {
            ShowMsg('danger',"No es posible subir fotos mayores a 10 MB");
            event.target.value = ''
            return
          }
            const file = event.target.files[0];
            const reader  = new FileReader();            
            reader.onloadend = () => {
                setImage64(reader.result.toString());  
            }
            reader.readAsDataURL(file); 
        }        
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        const form = event.currentTarget;
        event.stopPropagation();
        setValidated(true);
        if (form.checkValidity() === false) {return}

        const data = {
          nombre_foto:event.target.photoName.value,
          descripcion:event.target.descripcion.value,
          imagen:document.getElementById("imgFile").src.split(",")[1]
        };
        console.log(`${config.apiUrl}/subir-foto`)
        console.log(data)
        
        config.requestOptionsPOST.body = JSON.stringify(data)
        fetch(`${config.apiUrl}/subir-foto`,config.requestOptionsPOST)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
          console.log(data)
          if (data.subida){
            //setTimeout(() => {window.location.reload();}, 1500);
            ShowMsg('success',"Foto subida correctamente");
          }
        }) //mensaje de respuesta del server
        .catch((error) => {
          console.error(error.message)
          ShowMsg('danger',"Error al subir la foto: "+error.message );
        });

        
    };

  return (
    <>
        <button className={styles.btnCarrito} onClick={handleShow}>
            <i className="bi bi-file-earmark-plus-fill"></i>
        </button>

        {showAlert && (
              <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                  {alertText}
              </Alert>
        )}

        <Modal size="xl" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nueva Publicacion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-signin">
                
                    <div className='row' style={{padding:20}}>
                        <div className="col-4">
                            <img src={image64} alt="Imagen" id='imgFile'/>
                        </div>
                        <div className="col-6">
                        {showAlert && (
                            <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                                {alertText}
                            </Alert>
                        )}

                        <Row>
                            <Form.Group as={Col} controlId="validationFormik102" className="position-relative">
                                <Form.Label>Nombre de la imagen*</Form.Label>
                                <Form.Control required type="text" name="photoName" placeholder="Nombre1"/>
                                <Form.Control.Feedback tooltip>Todo Bien!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Por favor ingrese un Nombre.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3" style={{marginTop:20}}>
                            <Form.Group as={Col} md="12" >
                                <Form.Label>Seleccione la Imagen*</Form.Label>
                                <Form.Control
                                type="file" required name="image64" onChange={toBase64}
                                accept="image/jpg, image/jpeg, image/png"
                                />
                                <Form.Control.Feedback type="invalid">Por favor seleccione una Imagen.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group as={Col} controlId="validationFormik102" className="position-relative">
                                <Form.Label>Descripcion*</Form.Label>
                                <textarea name='descripcion' className="form-control" id="exampleFormControlTextarea1" rows="3" required></textarea>
                                <Form.Control.Feedback tooltip>Todo Bien!</Form.Control.Feedback>
                                <Form.Control.Feedback type="invalid">Por favor ingrese una descripcion.</Form.Control.Feedback>
                            </Form.Group>
                        </Row>                    
                        <Button type="submit" style={{marginTop:30}}>
                            <i className="bi bi-upload" style={{paddingRight:10}}></i>
                            Publicar
                        </Button>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    </>
  );
}

export default AgregarPublicacion;

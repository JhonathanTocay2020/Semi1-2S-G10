import React, { useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import config from "../../config.js";
import {Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export function EditProfile() {

    const [image64, setImage64] = useState("default.jpg");
    const [validated1, setValidated1] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertClass, setAlertClass] = useState("");

    const [validated2, setValidated2] = useState(false);

    let navigate = useNavigate();

    useEffect(() => {

      const userId = localStorage.getItem('userId');
      if (userId==null){
        return navigate("/login");
      } 
      
      console.log(`${config.apiUrl}/get-fotos-perfil`)
      fetch(`${config.apiUrl}/get-fotos-perfil`,config.requestOptionsGET)
      .then(response => {
          if (!response.ok) {
              console.error(response.statusText);
          }
          return response.json();
      })
      .then((data) => {
        console.log(data)
        for (let i = 0; i < data.fotos.length; i++) {
          if(data.fotos[i].activa==1){
            setImage64(data.fotos[i].url)
          }
        }       
      }) 
      .catch((error) => console.error(error.message));


      console.log(`${config.apiUrl}/get-info-perfil`)
      fetch(`${config.apiUrl}/get-info-perfil`,config.requestOptionsGET)
      .then(response => {
          if (!response.ok) {
              console.error(response.statusText);
          }
          return response.json();
      })
      .then((data) => {
        console.log(data)     
        document.getElementById("txtDpi").value = data.data.dpi
        document.getElementById("txtName").value = data.data.nombre
      }) 
      .catch((error) => console.error(error.message));

    }, []);

    const ShowMsg = (alertClass, alertText) => {
      setShowAlert(true);
      setAlertClass(alertClass);
      setAlertText(alertText);
    }

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
    
    const handleSubmitName = (event) => {

      event.preventDefault();
      const form = event.currentTarget;
      event.stopPropagation();
      setValidated1(true);
      if (form.checkValidity() === false) {return}

      const data = {
        nombre:event.target.Nombre.value,
        dpi:event.target.Dpi.value,
        password:document.getElementById("txtPass").value
      };
      console.log(`${config.apiUrl}/modificar-datos`)
      console.log(data)
      
      config.requestOptionsPOST.body = JSON.stringify(data)
      fetch(`${config.apiUrl}/modificar-datos`,config.requestOptionsPOST)
      .then(response => {
          if (!response.ok) {
              console.error(response.statusText);
          }
          return response.json();
      })
      .then((data) => {
        console.log(data)
        if(data.mensaje == "Datos actualizados"){
          window.location.reload()
        }else{
          ShowMsg('warning',data.mensaje);      
        }
      }) //mostrar error al usuario
      .catch((error) => {
        console.error(error.message)
        ShowMsg('danger',"Error al actualizar el nombre: "+error.message );
      });        
  };

  const handleSubmitPhoto = (event) => {

    event.preventDefault();
    const form = event.currentTarget;
    event.stopPropagation();
    setValidated2(true);
    if (form.checkValidity() === false) {return}
    
    const data = {
      password:document.getElementById("txtPass").value,
      nombre_foto:event.target.NombreFoto.value,
      imagen : document.getElementById("imgFile").src.split(",")[1],
    };

    //foto nueva
    let urlRequest = `${config.apiUrl}/foto-perfil-nueva`
    if (event.target.image64.value===''){
      //foto existente
      urlRequest = `${config.apiUrl}/foto-perfil-existente`
    }

    console.log(data)
    console.log(urlRequest)

    config.requestOptionsPOST.body = JSON.stringify(data)
    fetch(urlRequest,config.requestOptionsPOST)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
            ShowMsg('danger',"Error inesperado al actualizar la foto de perfil");
        }
        if (response.status === 200){
          //window.location.reload();
        }
        return response.json();
    })
    .then((data) => {
      //mostrar error al usuario
      ShowMsg('warning',data.mensaje);     

  //******************************************* Analisis Facial ****************************************************** */
   /*       const datos2 = {
            Imagen: document.getElementById("imgFile").src.split(",")[1]
        };
        console.log(`${config.apiUrl}/obtener-cara`)
        console.log(datos2)
        config.requestOptionsPOST.body = JSON.stringify(datos2)
        fetch(`${config.apiUrl}/obtener-cara`,config.requestOptionsPOST)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            console.log(data)
            if (data.texto !==''){
                localStorage.setItem('photoDetails', data.texto);
            }

        }) //mensaje de respuesta del server
        .catch((error) => {
            console.error(error.message)
        });
  //********************************************** Analisis Facial *************************************************** */
    })
    .catch((error) => {
      console.error(error)
      ShowMsg('danger',"Error al actualizar el nombre: "+error.message );
    });        
};

  return (

    <div className='row' style={{padding:20}}>

        {showAlert && (
            <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                {alertText}
            </Alert>
        )}
        <div className="col-4">
            <h3>Foto de Perfil</h3>
            <img src={image64} alt="Imagen" id='imgFile'/>

            <Row className="mb-3">
        <Form noValidate validated={validated2} onSubmit={handleSubmitPhoto}>
          <Form.Group as={Col} md="12" >
          <Row className="mb-3">
            <Form.Group as={Col} md="12" >
              <Form.Label>Nombre Imagen de Perfil*</Form.Label>
              <Form.Control type="text" name="NombreFoto" placeholder="Nombre1" id='txtNamePhoto' required/>
              <Form.Control.Feedback tooltip>Todo Bien!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Por favor ingrese un nombre.</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Label>Nueva Imagen (Opcional)</Form.Label>
            <Form.Control type="file" name="image64" onChange={toBase64} accept="image/jpg, image/jpeg, image/png"/>
          </Form.Group>
          <Button type="submit" style={{marginTop:15}}>
            <i className="bi bi-pencil-square" style={{paddingRight:10}}></i>
             Editar Foto
          </Button>
          </Form>
        </Row>
        </div>
        <div className="col-6" style={{marginTop:30}}>
        <Form noValidate validated={validated1} onSubmit={handleSubmitName}>
          <Row>                    
            <Form.Group as={Col} className="position-relative">
                <Form.Label>Nombre*</Form.Label>
                <Form.Control type="text" name="Nombre" placeholder="Nombre1" id='txtName' required/>
                <Form.Control.Feedback tooltip>Todo Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Por favor ingrese un Nombre.</Form.Control.Feedback> 
            </Form.Group>
          </Row>      

          <Row>                    
            <Form.Group as={Col} className="position-relative">
                <Form.Label>DPI*</Form.Label>
                <Form.Control type="number" name="Dpi" placeholder="DPI" id='txtDpi' required/>
                <Form.Control.Feedback tooltip>Todo Bien!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">Por favor ingrese un Numero de DPI.</Form.Control.Feedback> 
            </Form.Group>
          </Row>      

          <Row className="mb-3">
          <Form.Group as={Col} md="12" >
            <Form.Label>Contraseña*</Form.Label>
            <Form.Control type="password" required name="password" id='txtPass'/>
            <Form.Control.Feedback type="invalid">Por favor ingrese su contraseña.</Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Button type="submit">
            <i className="bi bi-pencil" style={{paddingRight:10}}></i>
            Editar
        </Button>
        </Form>
        </div>
        
    </div>
  );
}

export default EditProfile
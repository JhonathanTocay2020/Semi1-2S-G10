import React , { useState,useEffect,useRef}from "react";
import Form from 'react-bootstrap/Form';
import {Alert} from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import '../Login/Login.css';
import config from "../../config";

function Registro() {

    const [validated, setValidated1] = useState(false);
    const [image64, setImage64] = useState("");
    let navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertClass, setAlertClass] = useState("");

    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [imgData, setImgData] = useState(null);
    const [showStream, setShowStream] = useState(false);


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

    const handleStartCamera = async () => {
        try {
            setShowStream(true);
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleStopCamera = () => {
        setShowStream(false);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
    };

    const handleCapture = () => {
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              setImgData(reader.result);
              setImage64(reader.result)
            };
          }, 'image/jpeg', 1);
          handleStopCamera();
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        event.stopPropagation();
        setValidated1(true);
        if (form.checkValidity() === false) {
            ShowMsg('danger',"Llene todos los datos, no puede dejar campos vacios");
            return
        }
        if(event.target.password.value != event.target.password2.value){
            ShowMsg('danger',"La contraseña y la confirmacion no coinciden.");
            return
        }
        if(image64==""){
            ShowMsg('danger',"Debe seleccionar una imagen o tomar una fotografia.");
            return
        }
        if(!validarPassword(event.target.password.value)){
            ShowMsg('danger',"La contraseña debe tener entre 8-16 caracteres, una mayuscula, una minuscula, un numero y un simbolo.");
            return
        }
        
        const data = {

            nombre: event.target.nombre.value,
            dpi: event.target.dpi.value,
            correo: event.target.correo.value,
            password: event.target.password.value,
            nombre_foto: "Foto Perfil Inicial",
            imagen: image64.toString().split(",")[1]
        }
        console.log(`${config.apiUrl}/registrar-usuario`)
        console.log(data)

        config.requestOptionsPOST.body = JSON.stringify(data)
        fetch(`${config.apiUrl}/registrar-usuario`,config.requestOptionsPOST)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
                ShowMsg('danger',"Error inesperado al registrar el usuario");
            }
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (!data.registrado){
                ShowMsg('warning',data.mensaje);
                return
            }

        //******************************************* Analisis Facial ****************************************************** */
        /*    const datos2 = {
                Imagen: image64.toString().split(",")[1]
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
        
        localStorage.setItem('emailTemp', event.target.correo.value);
        setTimeout(() => {return navigate("/confirm");}, 2000);
        }) //mensaje de respuesta del server
        .catch((error) => {
            console.error(error.message)
            ShowMsg('danger',"Error al registrar usuario: "+error.message );
        });

        

    };

    function validarPassword(password) {
        const pattern = /^(?=(?:.*\d){1})(?=(?:.*[A-Z]){1})(?=(?:.*[a-z]){1})(?=(?:.*[@$?¡\-_]){1})\S{8,16}$/;
        return pattern.test(password)
    }
  return (
    <div className="container">
        {showStream?(<video ref={videoRef} src={imgData} style={{height:'auto',width:'55%', marginTop:20}}></video>):(<p></p>)}
                    {stream ? (                        
                        <div>
                            <button className="btn btn-dark" onClick={handleCapture}>
                                Tomar Foto
                            </button>                                                           
                        </div>                
                    ):(
        <div className="card1 card1-container">
            {showAlert && (
            <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                {alertText}
            </Alert>
            )}
            <div>
                {imgData ? (<img className="profile-img-card1" src={imgData} style={{height:100}} />) 
                         : (<img className="profile-img-card1" src={'Agregar.png'}/>)}                                    
            </div>
            <p className="h5">Foto de perfil Inicial:</p>
            <div>
                {stream ? (
                    <div></div>
                ) : (
                    <button style={{marginBottom:10, width: '100%'}} onClick={handleStartCamera} className="btn btn-secondary">Encender Cam</button>
                )}                                
            </div>               
            <Form.Control style={{marginBottom:30}} 
                          type="file" 
                          name="ImgFile" 
                          accept="image/jpg, image/jpeg, image/png"
                          required onChange={toBase64}/>

            <Form noValidate validated={validated} onSubmit={handleSubmit} className="form-signin">
                <Form.Group>
                    <Form.Control type="text" id="inputName"  className="form-control" placeholder="Nombre(s)" required autoFocus name='nombre'/>
                    <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Ingrese un nombre.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Control style={{marginBottom:10}} type="number" id="inputLastName" className="form-control" placeholder="DPI" required name='dpi'/>
                    <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Ingrese su DPI.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="email" id="inputEmail" className="form-control" placeholder="Correo Electronico" required name='correo'/>
                    <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Ingrese un Correo Valido.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" id="inputPassword1" className="form-control" placeholder="Contraseña" required name='password'/>
                    <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Por favor ingrese su contraseña.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Form.Control type="password" id="inputPassword2" className="form-control" placeholder="Confirmacion de Contraseña" required name='password2'/>
                    <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}} >Por favor confirme su contraseña.</Form.Control.Feedback>
                </Form.Group>
                <button className="btn btn-dark btn-block" type="submit">Registrarse</button>
            </Form>
            <p>¿Ya tiene cuenta? <a href="/login" className="forgot-password">Iniciar sesion</a></p>
        </div>
        )}
    </div>

  );
}

export default Registro;
import React,{ useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import {Alert} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from "../../config";

import '../../App.css';
import './Login.css';


function Login() {

  const [validated, setValidated1] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertClass, setAlertClass] = useState("");
    const [image64, setImage64] = useState("");

    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [imgData, setImgData] = useState(null);
    const [showStream, setShowStream] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {

      if (localStorage.getItem('userId')!==null){
        return navigate("/home");
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

              const datos = {                    
                  imagen: reader.result.toString().split(",")[1]
              }
              console.log(`${config.apiUrl}/iniciar-sesion-foto`)
              console.log(datos)      
              config.requestOptionsPOST.body = JSON.stringify(datos)
              fetch(`${config.apiUrl}/iniciar-sesion-foto`,config.requestOptionsPOST)
              .then(response => {
                  if (!response.ok) {
                      console.error(response.statusText);
                  }
                  console.log(response);
                  return response.json();
              })
              .then((data) => {
                  console.log(data);
                  let payload = parseJwt(data.token)
                  localStorage.setItem('Nombre', data.nombre); // para usarlos despues
                  localStorage.setItem('token', data.token); // para usarlos despues
                  localStorage.setItem('userId', payload.id);// para usarlos despues
                  
                  navigate("/home");
                  window.location.reload()
                  return
                  if (data.idUsuario === ''){
                      ShowMsg('danger',data.message); 
                      return                  
                  }
                  localStorage.setItem('userId', data.idUsuario);// para usarlos despues
                  localStorage.setItem('userName', data.Usuario);// para usarlos despues
                  localStorage.setItem('Nombre', data.Nombre);// para usarlos despues

                    
                    //******************************************* Analisis Facial ****************************************************** */
                    /*        const datos2 = {
                                Imagen: reader.result.toString().split(",")[1]
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
                                window.location.reload()

                            }) //mensaje de respuesta del server
                            .catch((error) => {
                                console.error(error.message)
                                window.location.reload()
                            });
                     //********************************************** Analisis Facial *************************************************** */
                }) //mensaje de respuesta del server
                .catch((error) => {
                    console.error(error.message)
                    ShowMsg('danger',"Error al iniciar sesion usuario: "+error.message );
                });

            };
          }, 'image/jpeg', 1);
          handleStopCamera();
        }
    };

    const handleSubmitLogin = (event) => {

        event.preventDefault();
        const form = event.currentTarget;
        event.stopPropagation();
        setValidated1(true);
        if (form.checkValidity() === false) {
            ShowMsg('danger','Los datos ingresados son invalidos.');
            return
        }
        
        const data = {
            correo: event.target.Correo.value,
            password: event.target.Contrasenia.value,
        }
        console.log(`${config.apiUrl}/iniciar-sesion`)
        console.log(data)
        config.requestOptionsPOST.body = JSON.stringify(data)

        fetch(`${config.apiUrl}/iniciar-sesion`,config.requestOptionsPOST)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            console.log(response);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.nombre === '' || data.token === '') {
                ShowMsg('danger',data.mensaje);
                return
            }
            let payload = parseJwt(data.token)
            localStorage.setItem('Nombre', data.nombre); // para usarlos despues
            localStorage.setItem('token', data.token); // para usarlos despues
            localStorage.setItem('userId', payload.id);// para usarlos despues
            
            navigate("/home");
            window.location.reload()
            return
        }) //mensaje de respuesta del server
        .catch((error) => {
            console.error(error.message)
            ShowMsg('danger','Error al iniciar sesion: '+error.message);
        });

    };


  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } 

  return (
    <div className="container">
        
      {showStream?(<video ref={videoRef} src={imgData} style={{height:'auto',width:'55%', marginTop:20}}></video>):(<p></p>)}
        {stream ? (                        
            <div>
                <button className="btn btn-primary" onClick={handleCapture}>Tomar Foto</button>                                                           
            </div>                
        ):(  
        <div className="card1 card1-container">
            {showAlert && (
              <Alert className={`alert alert-${alertClass} alert-dismissible fade show`} onClose={() => setShowAlert(false)} dismissible>
                  {alertText}
              </Alert>
            )}
          
            {/*<img id="profile-img" className="profile-img-card1" src="user.png" alt=''/>*/}
            <h1 id="profile-name" className="centered-title">Login</h1>

            <Form noValidate validated={validated} onSubmit={handleSubmitLogin} className="form-signin">
                <span id="reauth-email" className="reauth-email"></span>
                <Form.Group>
                  <Form.Control type="email" id="inputEmail" className="form-control" placeholder="Email" required autoFocus name='Correo'/>
                  <Form.Control.Feedback type="invalid" style={{marginTop:-10,marginBottom:10}}>Ingrese un correo válido.</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Control type="password" id="inputPassword" className="form-control" placeholder="Contraseña" required name='Contrasenia'/>
                  <Form.Control.Feedback type="invalid">Por favor ingrese su contraseña.</Form.Control.Feedback>
                </Form.Group>
                <button className="btn btn-dark btn-block" type="submit">Iniciar Sesion</button>
                </Form>
                <button className="btn boto" style={{width:'100%'}} onClick={handleStartCamera}>Ingresar con Camara</button>
                <div>
                    <p style={{marginTop:10}}><a className="h5" href="/register">¿Desea crear una cuenta?</a></p>
                </div>
          </div>
        )}
      </div>


  );
}

export default Login;
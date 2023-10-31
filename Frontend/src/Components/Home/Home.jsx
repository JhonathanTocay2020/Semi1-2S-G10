import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import config from "../../config.js";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import AgregarPublicacion from './AgregarPublicacion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Row } from 'react-bootstrap';


function Home() {

  let navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);

  const [comentarios, setComentarios] = useState([]);

  const [show, setShow] = useState(false);
  const [idComment, setIdComment] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    console.log(id)  
    setIdComment(id)

    console.log(`${config.apiUrl}/get-comentario/${id}`)
    fetch(`${config.apiUrl}/get-comentario/${id}`,config.requestOptionsGET)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data.comentarios[0])
      setComentarios(data.comentarios[0])
    }) 
    .catch((error) => console.error(error.message));

    setShow(true)
  };

  const addNewComent = (id) => {
    console.log(id)
    
    const data = {
      idpublicacion:id.idComment,
      mensaje:document.getElementById("txtComentario").value
    };
    console.log(`${config.apiUrl}/Comentario`)
    console.log(data)
    config.requestOptionsPOST.body = JSON.stringify(data)
    fetch(`${config.apiUrl}/Comentario`,config.requestOptionsPOST)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data)
      window.location.reload()
    }) //mensaje de respuesta del server
    .catch((error) => {
      console.error(error.message)
    });
  };

  
  useEffect(() => {
    
    const userId = localStorage.getItem('userId');
    if (userId===null){
      return navigate("/login");
    } 

    console.log(`${config.apiUrl}/get-publicacion-todo`)
    fetch(`${config.apiUrl}/get-publicacion-todo`,config.requestOptionsGET)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data)
      setPublicaciones(data.publicaciones)
    }) 
    .catch((error) => console.error(error.message));


    console.log(`${config.apiUrl}/get-etiquetas`)
    fetch(`${config.apiUrl}/get-etiquetas`,config.requestOptionsGET)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data)
      setLabels(data.etiquetas)
    }) 
    .catch((error) => console.error(error.message));

  }, []);

  const getFotoByAlbum = (event) => {    
    const valorSeleccionado = event.target.value;
    const opcionSeleccionada = document.querySelector(`#labels option[value="${valorSeleccionado}"]`);
    
    if (opcionSeleccionada === null) {return}

    const keySeleccionada = opcionSeleccionada.getAttribute('data-key');
    console.log(keySeleccionada);

    if(keySeleccionada == -1){
        console.log(`${config.apiUrl}/get-publicacion-todo`)
        fetch(`${config.apiUrl}/get-publicacion-todo`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
          console.log(data)
          setPublicaciones(data.publicaciones)
        }) 
        .catch((error) => console.error(error.message));

    }else{

        console.log(`${config.apiUrl}/get-publicacion/${keySeleccionada}`)
        fetch(`${config.apiUrl}/get-publicacion/${keySeleccionada}`,config.requestOptionsGET)
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.json();
        })
        .then((data) => {
          console.log(data)
          setPublicaciones(data.publicaciones)
        }) 
        .catch((error) => console.error(error.message));
    }
  }

  if (publicaciones.length === 0) {
    return (
      <div style={{padding:20}}>
      <Form.Group>
        <Form.Label htmlFor="labels">Buscar por etiqueta</Form.Label>
        <Form.Control 
          list="labels" 
          id="exampleDataList" 
          placeholder="Ingrese una etiqueta..."
          onChange={getFotoByAlbum}
        />
        <datalist id="labels">
          <option value="Todos" data-key="-1" />
          {labels.map((pub) => ( 
            <option value={pub.nombre} data-key={pub.id} key={pub.id} />
          ))}
        </datalist>
      </Form.Group>


        <h1 className="h4 text-center text-primary" style={{padding:20}}>
          No hay publicaciones por mostrar.
        </h1>
        <AgregarPublicacion style={{position:'relative',height:'80vh' }}/>
      </div>
    )
  }
    return(    
        <>  
        <div style={{padding:20}}>
          <Form.Group>
              <Form.Label htmlFor="labels">Buscar por etiqueta</Form.Label>
              <Form.Control 
                list="labels" 
                id="exampleDataList" 
                placeholder="Ingrese una etiqueta..."
                onChange={getFotoByAlbum}
                
              />
              <datalist id="labels">
                <option value="Todos" data-key="-1" />
                {labels.map((pub) => ( 
                  <option value={pub.nombre} data-key={pub.id} key={pub.id} />
                ))}
              </datalist>
          </Form.Group>
          {publicaciones.map((pub,index) => ( 
              <div className="row" key={index} style={{padding:'2% 25% 15px 25%'}}>
                <Card className="border-secondary">
                <Card.Body>
                    <Card.Title>{pub.nombre_foto}</Card.Title>
                      <img src={pub.url_foto} className='imgPub'/>
                      <p  style={{marginTop:10}}>Descripcion: <a>(Traducir)</a></p>
                    <Card.Text>
                      {pub.descripcion}
                    </Card.Text>
                    <Button onClick={() => handleShow(pub.id)}>Ver Comentarios...</Button>
                </Card.Body>
                </Card>
              </div>
          ))}
          </div>     
          <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
              <Modal.Title>Comentarios</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {comentarios.length ===0 && (
              <h1 className="h4 text-center text-primary">
                No hay comentarios.
              </h1>
            )}
            {comentarios.map((com,index) => ( 
                <Card key={index} style={{marginBottom:20}}>
                  <Card.Body>
                    <Card.Title>{com.nombre}</Card.Title>
                    <Card.Text>
                      {com.mensaje}
                    </Card.Text>
                  </Card.Body>
              </Card>
              ))}
              
              <div className="row" style={{marginTop:45}}>
                <div className="col">
                  <Form.Control type="text" className="form-control" placeholder="Agregar Comentario" required name='comentario' id='txtComentario'/>                  
                </div>
                <div className="col-auto">
                  <Button variant="primary" onClick={() => addNewComent({idComment})}>+</Button>
                </div>
              </div>
              

            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Traducir(ingles/frances/aleman)
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>
          <AgregarPublicacion style={{position:'relative',height:'80vh' }}/>   
        </>
    )
 
  }
  
  export default Home
  
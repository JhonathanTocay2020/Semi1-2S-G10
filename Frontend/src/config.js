const config = {
    url:"http://"+"127.0.0.1", //"http://127.0.0.1"
    Port : ":4000"//:5000
};
  
export default {
    apiUrl : `${config.url}${config.Port}`,
    requestOptionsPOST : { 
        method: "POST", 
        headers: { "Content-Type": "application/json",
        'access-token': localStorage.getItem("token")
        }, 
        body: {},
        credentials: "same-origin",
    },
    requestOptionsGET:{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access-token': localStorage.getItem("token")
        },
        credentials: 'same-origin'
    },
    maxImgSize : 10000*1024 // 10 MB
};
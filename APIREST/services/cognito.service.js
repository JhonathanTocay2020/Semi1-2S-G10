import aws from 'aws-sdk';
import AmazonCognitoIdentity  from "amazon-cognito-identity-js";
import {configCognito, APP_CLIENT_ID, USER_POOL} from "../config/configCog.js"

export const registrarCognito = async (email, password) => {
    aws.config.update(configCognito);

    const cognito = new aws.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19', 
        region: 'us-east-1' 
    });
      
    const params = {
        ClientId: APP_CLIENT_ID,
        Username: email,
        Password: password
      };

      try {
        const data = await cognito.signUp(params).promise();
        console.log(`User ${data.UserSub} created successfully`);
        return data.UserSub;
      } 
      catch (error) {
        console.error(`Error creating user ${email}: ${error}`);
        return null
      }
}

export const verificarEmail = async (email, codigo) => {
    aws.config.update(configCognito);

    const cognito = new aws.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-19', 
        region: 'us-east-1' 
    });

    const params = {
        ClientId: APP_CLIENT_ID,
        ConfirmationCode: codigo,
        Username: email
      };
      
      try {
        await cognito.confirmSignUp(params).promise();
        return true;
      } catch (error) {
        return false;
      }
}

export const loginCognito = async (email, password) => {
    const poolData = {
      UserPoolId: USER_POOL,
      ClientId: APP_CLIENT_ID
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password
    });

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    try {
        const result = await new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: resolve,
            onFailure: reject
          });
        });
        
        return result.idToken.payload.sub;
    } catch (error) {
        console.error('Error al iniciar sesión', error);
        switch(error.code){
            case "UserNotConfirmedException":
                return -1;
        }
        return 0;
    }
}

export const cuentaActiva = async (email) =>{
  aws.config.update(configCognito);
  const cognito = new aws.CognitoIdentityServiceProvider();

  const params = {
    UserPoolId: USER_POOL,
    Username: email
  };

  try{
    const resultado = await cognito.adminGetUser(params).promise()
    if (resultado.UserStatus == 'UNCONFIRMED'){
      return false
    }
    return true;
  }catch(error){
    console.log(error)
    return false;
  }

}
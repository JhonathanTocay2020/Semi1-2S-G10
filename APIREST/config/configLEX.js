import AWS from "aws-sdk";
// Lex
export const CB_REGION = process.env.CB_REGION;
export const CB_NAME = process.env.CB_NAME;
export const CB_ALIAS = process.env.CB_ALIAS;
export const CB_ACCESS_KEY_ID = process.env.CB_ACCESS_KEY_ID;
export const CB_SECRET_ACCESS_KEY = process.env.CB_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId: CB_ACCESS_KEY_ID,
  secretAccessKey: CB_SECRET_ACCESS_KEY,
  region: CB_REGION,
});
export const lex = new AWS.LexRuntime();

export async function sendToLex(userID, message2) {
  const params = {
    botAlias: CB_ALIAS,
    botName: CB_NAME,
    inputText: message2,
    userId: userID,
  };
  const result = await lex.postText(params).promise();
  return result;
}

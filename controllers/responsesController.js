import { Configuration, OpenAIApi } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config();

const configurationOpenApi = new Configuration({
  apiKey: process.env.OPENAI_KEY
});

const openai = new OpenAIApi(configurationOpenApi);

export async function getDaVinciResponse(clientText){
  const options = {
    model: "text-davinci-003", // Modelo GPT, usado para responder texto
    prompt: clientText,
    temperature: .2,
    max_tokens: 4000
  };

  try {
    const response = await openai.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({text}) => {
      botResponse += text;
    });
    return `${botResponse.trim()}`;
  } catch(e){
    return `Chat do teteu deu erro: ${e.response.data.error.message}`
  };
};

export async function getDalleResponse(clientText){
  const options = {
    prompt: clientText,
    n: 1,
    size: "1024x1024"
  }

  try {
    const response = await openai.createImage(options);
    return response.data.data[0].url;
  } catch (e){
    return `Chat do teteu deu erro: ${e.response.data.error.message}`
  };
};

export async function commands(client, message){
  const iaCommands = {
    davinci13: "#teteu",
    dalle: "#img",
    options: "#options"
  };

  const firstWord = message.text.substring(0, message.text.indexOf(" "));

  switch(firstWord){
    case iaCommands.davinci13:

    
      client.sendText(message.from == process.env.PHONE_NUMBER ? message.to : message.from, "Aguarde, estou processando");
      const question = message.text.substring(message.text.indexOf(" "));

      
      getDaVinciResponse(question).then(response => {
        // faz uma validação no message.from indicando para enviar a resposta para quem enviou a pergunta.
        client.sendText(message.from == process.env.PHONE_NUMBER ? message.to : message.from, response);
      });
      break;
    
    case iaCommands.dalle:
      const imgDescription = message.text;
      client.sendText(message.from == process.env.PHONE_NUMBER ? message.to : message.from, "Aguarde, estou processando");

      getDalleResponse(imgDescription, message)
        .then(imgUrl => {
        client.sendImage(
          message.from === process.env.PHONE_NUMBER ? message.to : message.from,
          imgUrl,
          imgDescription,
          'Imagem gerada pelo teteu :#'
        );
      });
      break;
      default: 
      break;
  };
};
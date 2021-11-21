import IMessage from "../dtos/IMessage";
import IISOMessage from "../dtos/ISOMessage";

interface ICreateMessage {
  emitter: string;
  message: IMessage;
}

function isJSON(text: string): boolean {
  const regexTest = /^[\],:{}\s]*$/.test(text
    .replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));

  if (regexTest) {
    return true;
  } else {
    return false;
  }
}

function createISOMessage({
  emitter,
  message,
}: ICreateMessage): IISOMessage {
  return {
    id: Date.now(),
    emitter,
    message,
    createdAt: new Date().toLocaleString(),
  }
}

function isISOMessage(data: string) {
  const message = JSON.parse(data);

  return message?.id && message?.emitter && message?.message && message?.createdAt;
}

export {
  isJSON,
  isISOMessage,
  createISOMessage
};

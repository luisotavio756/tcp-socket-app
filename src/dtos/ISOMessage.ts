import IMessage from "./IMessage";

export default interface IISOMessage {
  id: number;
  emitter: string;
  message: IMessage;
  createdAt: string;
}

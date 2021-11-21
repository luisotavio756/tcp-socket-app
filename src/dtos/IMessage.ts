import ISensorDetails from "./ISensorDetais";

export default interface IMessage {
  action: string;
  data: object | ISensorDetails;
};

import styled from "styled-components";

export const HorizontallyCenter = styled.section`
  display: table;
  margin: 0 auto;
`;

export const Center = styled.section`
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  font-size: 16px;
`;

export const Form = styled.section`
  display: table;
  margin: 0 auto;
  width: 60%;
`;

export const Flex = styled.section`
  display: flex;
  margin: 0 auto;
`;

export const SlatesBox = styled.textarea`
  font-size: 12.5px;
  width: 100%;
  min-height: 325px;
  max-height: 325px;
  background-color: #171920;
  overflow-y: auto;
  border-radius: 3px;
  padding: 8px;
  font-family: Courier New;
  white-space: pre-line;
  color: #ffffff;
  resize: none;
`;

export const TextFileBox = styled.textarea`
  margin: 10px;
  font-size: 12.5px;
  width: 1120px;
  min-height: 600px;
  max-height: 600px;
  background-color: #171920;
  overflow-y: auto;
  border-radius: 3px;
  padding: 10px;
  font-family: Courier New;
  white-space: pre-line;
  color: #ffffff;
  resize: none;
`;

export const WalletLogsBox = styled.textarea`
  display: block;
  font-size: 13px;
  width: 100%;
  height: 100px;
  background-color: #171920;
  overflow-y: auto;
  border-radius: 3px;
  padding: 10px;
  font-family: Courier New;
  white-space: pre-line;
  color: #ffffff;
`;

export const NodeLogsBox = styled.textarea`
  display: block;
  font-size: 13px;
  width: 100%;
  height: 100px;
  background-color: #171920;
  overflow-y: auto;
  border-radius: 3px;
  padding: 10px;
  font-family: Courier New;
  white-space: pre-line;
  color: #ffffff;
`;

export const RendererLogsBox = styled.textarea`
  display: block;
  font-size: 13px;
  width: 100%;
  height: 100px;
  background-color: #171920;
  overflow-y: auto;
  border-radius: 3px;
  padding: 10px;
  font-family: Courier New;
  white-space: pre-line;
  color: #ffffff;
`;

export const Title = styled.section`
  font-size: 20px;
  color: #a3a3a3 !important;
`;

export const Content = styled.section`
  display: flex;
  margin: 0 auto;
  width: 100%;
`;

export const StatusBarContent = styled.section`
  display: flex;
  box-align: center;
  margin-left: 0px;
  padding-top: 6px;
  margin-right: 0px;
  background-image: url("./statics/images/canary.png");
  background-repeat: no-repeat;
  background-position: right bottom;
  background-size: 30px;
  height: 30px;
`;

export const SpendableBalance = styled.section`
  font-size: 30px;
  color: #ffff00;
`;

export const BalanceSuffix = styled.section`
  font-size: 28px;
  display: inline-block;
  align-self: center;
  margin-left: 5px;
`;

export const Dropper = styled.section`
  display: block;
  border-style: dashed;
  border-width: 2px;
  border-color: white;
  width: 100%;
  line-height: 35px;
  height: 45px;
  margin-top: 15px;
  vertical-align: middle;
  font-size: 15px;
  cursor: copy;
`;

export const WalletUsername = styled.section`
  font-size: 21px;
  vertical-align: middle;
  text-transform: uppercase;
  color: #ffff00;
`;

export const AccountListContent = styled.section`
  display: flex;
  margin: 0 auto;
  max-height: 400px;
  max-width: 600px;
  flex-wrap: wrap;
  overflow-y: auto;
  align-items: center;
  justify-content: center;
`;

export const SubmitButton = styled.section`
  text-align: center;
  margin: 5px;
`;

export const SendGrinsContent = styled.section`
  width: 75%;
  overflow: auto;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding: 20px;
`;

export const Left = styled.section`
  float: left;
`;

export const Right = styled.section`
  float: right;
`;

import textUtil from 'src/text.util';

const messages = {
  thinking: 'Thinking...',
  error: 'An error occured on server',
  new_user: (address: string) =>
    `Welcome to SAM, this is your wallet: ${address}`,
  wallet_data: (address: string, private_key: string) =>
    `this is your wallet: ${address}, and private key: ${private_key}`,
  alert_triggered: (
    amount: number,
    ticker: string,
    keyword: string,
    type: 'INCREASE' | 'DECREASE',
  ) =>
    `Sam is awake and your alert is now on action: ${textUtil.createAlertLine(ticker, keyword, type, amount)}`,
  alert_create: (
    amount: number,
    ticker: string,
    keyword: string,
    type: 'INCREASE' | 'DECREASE',
  ) =>
    `Sam created your alert.\n\nI will tell you when ${textUtil.createAlertLine(ticker, keyword, type, amount)}`,
};

export default messages;

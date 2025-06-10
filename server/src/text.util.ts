import * as numeral from 'numeral';

const textUtil = {
  createAlertLine: (
    ticker: string,
    keyword: string,
    type: 'INCREASE' | 'DECREASE',
    amount: number,
  ) =>
    `${ticker} ${keyword} is ${type === 'INCREASE' ? 'more' : 'less'} than ${numeral(amount).format('0.0a')}`,
};

export default textUtil;

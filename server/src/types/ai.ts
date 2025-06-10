export type AiResponseTickerType = {
  value: string;
  ca: string;
  is_included_in_list: boolean;
};

export type AiResponseAlertType = {
  amount: number;
  amount_percentage: number;
  change_type: 'INCREASE' | 'DECREASE';
  ticker: AiResponseTickerType;
  change_keyword: string;
};

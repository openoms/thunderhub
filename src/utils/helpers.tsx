import numeral from 'numeral';

const getValueString = (amount: number): string => {
  if (amount >= 100000) {
    return `${amount / 1000000}m`;
  }
  if (amount >= 1000) {
    return `${amount / 1000}k`;
  }
  return `${amount}`;
};

interface GetNumberProps {
  amount: string | number;
  price: number;
  symbol: string;
  currency: string;
  breakNumber?: boolean;
  override?: string;
}

export const getValue = ({
  amount,
  price,
  symbol,
  currency,
  breakNumber,
  override,
}: GetNumberProps): string => {
  const correctCurrency = override || currency;
  let value = 0;
  if (typeof amount === 'string') {
    value = Number(amount);
  } else {
    value = amount;
  }

  if (correctCurrency === 'ppm') {
    const amount = numeral(value).format('0,0.[000]');
    return `${amount} ppm`;
  }

  if (correctCurrency === 'btc') {
    if (!value) return '₿0.0';
    const amountInBtc = value / 100000000;
    const rounded = Math.round(amountInBtc * 10000) / 10000;

    return `₿${rounded}`;
  }
  if (correctCurrency === 'sat') {
    const breakAmount = breakNumber
      ? getValueString(value)
      : numeral(value).format('0,0.[000]');
    return `${breakAmount} sats`;
  }

  const amountInFiat = (value / 100000000) * price;
  return `${symbol}${numeral(amountInFiat).format('0,0.00')}`;
};

export const getPercent = (
  local: number,
  remote: number,
  withDecimals?: boolean
): number => {
  const total = remote + local;
  const percent = (local / total) * 100;

  if (remote === 0 && local === 0) {
    return 0;
  }

  if (withDecimals) {
    return Math.round(percent * 100) / 100;
  }

  return Math.round(percent);
};

export const saveToPc = (jsonData: string, filename: string) => {
  const fileData = jsonData;
  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.txt`;
  link.href = url;
  link.click();
};

export const encode = (data: string): string =>
  Buffer.from(data, 'binary').toString('base64');
export const decode = (data: string): string =>
  Buffer.from(data, 'base64').toString('binary');

export const isLightningInvoice = (invoice: string): boolean => {
  let isValidLightningInvoice = false;
  if (
    invoice.toLowerCase().startsWith('lightning:lnb') ||
    invoice.toLowerCase().startsWith('lnb')
  ) {
    isValidLightningInvoice = true;
  }
  return isValidLightningInvoice;
};

export const cleanLightningInvoice = invoice => {
  return invoice.replace('LIGHTNING:', '').replace('lightning:', '');
};

export const formatSeconds = (seconds: number): string | null => {
  if (!seconds || seconds === 0) {
    return null;
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? `${d}d ` : '';
  const hDisplay = h > 0 ? `${h}h ` : '';
  const mDisplay = m > 0 ? `${m}m ` : '';
  const sDisplay = s > 0 ? `${s}s` : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

import React from 'react';
import {
  format,
  formatDistanceToNowStrict,
  differenceInCalendarDays,
  isToday,
} from 'date-fns';
import { X, Copy } from 'react-feather';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import {
  SmallLink,
  DarkSubTitle,
  OverflowText,
  SingleLine,
  CopyIcon,
} from './Styled';
import { StatusDot, DetailLine } from './CardGeneric';

const shorten = (text: string): string => {
  const amount = 6;
  const beginning = text.slice(0, amount);
  const end = text.slice(text.length - amount);

  return `${beginning}...${end}`;
};

export const getTransactionLink = (transaction: string) => {
  const link = `https://www.blockchain.com/btc/tx/${transaction}`;
  return (
    <SmallLink href={link} target="_blank">
      {shorten(transaction)}
    </SmallLink>
  );
};

export const getNodeLink = (publicKey: string, alias?: string) => {
  if (alias && alias === 'Node not found') {
    return 'Node not found';
  }
  const link = `https://1ml.com/node/${publicKey}`;
  return (
    <>
      <SmallLink href={link} target="_blank">
        {alias ? alias : shorten(publicKey)}
      </SmallLink>
      <CopyToClipboard text={publicKey} onCopy={() => toast.success('Copied')}>
        <CopyIcon>
          <Copy size={12} />
        </CopyIcon>
      </CopyToClipboard>
    </>
  );
};

export const getDateDif = (date: string) => {
  return formatDistanceToNowStrict(new Date(date));
};

export const getFormatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy - HH:mm:ss');
};

export const getMessageDate = (date: string, formatType?: string): string => {
  let distance = formatDistanceToNowStrict(new Date(date));

  if (distance.indexOf('minute') >= 0 || distance.indexOf('second') >= 0) {
    distance = distance.replace('minutes', 'min');
    distance = distance.replace('minute', 'min');
    distance = distance.replace('seconds', 'sec');
    distance = distance.replace('second', 'sec');
    distance = distance.replace('0 sec', 'now');
    return distance;
  }
  return format(new Date(date), formatType || 'HH:mm');
};

export const getDayChange = (date: string): string => {
  if (isToday(new Date(date))) {
    return 'Today';
  }

  return format(new Date(date), 'dd/MM/yy');
};

export const getIsDifferentDay = (current: string, next: string): boolean => {
  const today = new Date(current);
  const tomorrow = new Date(next);

  const difference = differenceInCalendarDays(today, tomorrow);

  return difference > 0 ? true : false;
};

export const getTooltipType = (theme: string): string => {
  return theme === 'dark' ? 'light' : 'dark';
};

export const getStatusDot = (status: boolean, type: string) => {
  if (type === 'active') {
    return status ? (
      <StatusDot color="#95de64" />
    ) : (
      <StatusDot color="#ff4d4f" />
    );
  }
  if (type === 'opening') {
    return status ? <StatusDot color="#13c2c2" /> : null;
  }
  return status ? <StatusDot color="#ff4d4f" /> : null;
};

export const renderLine = (
  title: string,
  content: any,
  key?: string | number,
  deleteCallback?: () => void
) => {
  if (!content) return null;
  return (
    <DetailLine key={key}>
      <DarkSubTitle>{title}</DarkSubTitle>
      <SingleLine>
        <OverflowText>{content}</OverflowText>
        {deleteCallback && (
          <div
            role={'button'}
            tabIndex={0}
            style={{ margin: '0 0 -4px 4px' }}
            onClick={deleteCallback}
            onKeyDown={deleteCallback}
          >
            <X size={18} />
          </div>
        )}
      </SingleLine>
    </DetailLine>
  );
};

import React from 'react';
import { useSpring, animated } from 'react-spring';
import { getValue } from '../../utils/helpers';
import { useConfigState } from '../../context/ConfigContext';
import { usePriceState } from '../../context/PriceContext';

type PriceProps = {
  price: number;
  symbol: string;
  currency: string;
};

type AnimatedProps = {
  amount: number;
};

export const AnimatedNumber = ({ amount = 0 }: AnimatedProps) => {
  const { value } = useSpring({
    from: { value: 0 },
    value: amount,
  });
  const { currency, displayValues } = useConfigState();
  const { prices, dontShow } = usePriceState();

  if (!displayValues) {
    return <>-</>;
  }

  let priceProps: PriceProps = {
    price: 0,
    symbol: '',
    currency: currency !== 'btc' && currency !== 'sat' ? 'sat' : currency,
  };

  if (prices && !dontShow) {
    const current: { last: number; symbol: string } = prices[currency] ?? {
      last: 0,
      symbol: '',
    };

    priceProps = {
      price: current.last,
      symbol: current.symbol,
      currency,
    };
  }

  return (
    <animated.div>
      {value.interpolate(amount => getValue({ amount, ...priceProps }))}
    </animated.div>
  );
};

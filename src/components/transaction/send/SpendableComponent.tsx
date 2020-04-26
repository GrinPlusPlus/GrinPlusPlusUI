import React from 'react';
import { Content } from '../../styled';

type SpendableProps = {
  spendable: number;
};

export default function SpendableComponent({ spendable }: SpendableProps) {
  return (
    <Content>
      Spendable: <b>{`${spendable.toFixed(6)} ツ`}</b>
    </Content>
  );
}

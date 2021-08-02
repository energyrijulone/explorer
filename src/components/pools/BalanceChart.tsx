// Copyright (C) 2021 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { BigNumber, FixedNumber } from 'ethers';
import React, { FC } from 'react';
import {
    Bar,
    BarChart,
    LabelList,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { toCTSI } from '../../utils/token';

export type BalanceChartProps = {
    amount: BigNumber;
    poolBalance: BigNumber;
    poolRequiredLiquidity: BigNumber;
    stakingMatureBalance: BigNumber;
    stakingMaturingBalance: BigNumber;
    stakingReleasing: BigNumber;
    stakingReleased: BigNumber;
};

const BalanceChart: FC<BalanceChartProps> = (props: BalanceChartProps) => {
    const data = [
        {
            name: 'Amount',
            value: toCTSI(props.amount),
            requiredLiquidity: toCTSI(props.poolRequiredLiquidity),
        },
        {
            name: 'Pool',
            value: toCTSI(props.poolBalance),
        },
        {
            name: 'Staking',
            matureBalance: toCTSI(props.stakingMatureBalance),
            maturingBalance: toCTSI(props.stakingMaturingBalance),
            releasing: toCTSI(props.stakingReleasing),
            released: toCTSI(props.stakingReleased),
        },
    ];

    const numberFormat = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        notation: 'compact',
        style: 'decimal',
    });

    return (
        <BarChart
            data={data}
            width={400}
            height={300}
            layout="vertical"
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <Bar dataKey="value" stackId="a" fill="#B3C2F2">
                <LabelList
                    dataKey="value"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <Bar dataKey="requiredLiquidity" stackId="a" fill="#D4AA7D">
                <LabelList
                    dataKey="requiredLiquidity"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <Bar dataKey="matureBalance" stackId="a" fill="#735CDD">
                <LabelList
                    dataKey="matureBalance"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <Bar dataKey="maturingBalance" stackId="a" fill="#9000B3">
                <LabelList
                    dataKey="maturingBalance"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <Bar dataKey="releasing" stackId="a" fill="#7E007B">
                <LabelList
                    dataKey="releasing"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <Bar dataKey="released" stackId="a" fill="#37000A">
                <LabelList
                    dataKey="released"
                    position="top"
                    formatter={(value: number) => numberFormat.format(value)}
                />
            </Bar>
            <YAxis dataKey="name" type="category" />
            <XAxis
                type="number"
                tickFormatter={(v) => numberFormat.format(v)}
            />
            <Tooltip
                formatter={(value: FixedNumber, name, props) =>
                    numberFormat.format(value.toUnsafeFloat())
                }
            />
            <Legend />
        </BarChart>
    );
};

export default BalanceChart;

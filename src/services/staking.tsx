// Copyright (C) 2020 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import { useState, useEffect, useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Staking } from '../contracts/Staking';
import { StakingFactory } from '../contracts/StakingFactory';
import { networks } from '../utils/networks';
import { BigNumber, BigNumberish } from 'ethers';
import { useBlockNumber } from './eth';

import { DataContext } from '../components/DataContext';

export const useStaking = () => {
    const { library, chainId, account } = useWeb3React<Web3Provider>();
    const [staking, setStaking] = useState<Staking>();

    const blockNumber = useBlockNumber();
    const [stakedBalance, setStakedBalance] = useState<BigNumber>(BigNumber.from(0));
    const [maturingTimestamp, setMaturingTimestamp] = useState<Date>(null);
    const [releasingTimestamp, setReleasingTimestamp] = useState<Date>(null);
    const [maturingBalance, setMaturingBalance] = useState<BigNumber>(BigNumber.from(0));
    const [releasingBalance, setReleasingBalance] = useState<BigNumber>(BigNumber.from(0));

    const {
        setContext
    } = useContext(DataContext);

    // create the Staking, asynchronously
    useEffect(() => {
        if (library && chainId) {
            const network = networks[chainId];
            try {
                const deployment = require(`@cartesi/pos/deployments/${network}/StakingImpl.json`);
                const address = deployment?.address;
                if (address) {
                    console.log(`Attaching Staking to address '${address}' deployed at network '${chainId}'`);
                    setStaking(StakingFactory.connect(address, library.getSigner()));
                } else {
                    setContext({
                        error: `Staking not deployed at network '${chainId}'`
                    });
                }
            } catch (e) {
                setContext({
                    error: `Staking not deployed at network '${chainId}'`
                });
            }
        }
    }, [library, chainId]);

    useEffect(() => {
        if (staking && account) {
            staking.getStakedBalance(account).then(setStakedBalance);
            staking.getMaturingTimestamp(account).then(value => setMaturingTimestamp(new Date(value.toNumber() * 1000)));
            staking.getReleasingTimestamp(account).then(value => setReleasingTimestamp(new Date(value.toNumber() * 1000)));
            staking.getMaturingBalance(account).then(setMaturingBalance);
            staking.getReleasingBalance(account).then(setReleasingBalance);
        }
    }, [staking, chainId, account, blockNumber]);

    const stake = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                // send transaction
                const transaction = await staking.stake(amount);
                setContext({
                    error: null,
                    submitting: true,
                    currentTransaction: transaction
                });
            } catch (e) {
                setContext({
                    error: e.message,
                    submitting: false
                });
            }
        }
    };

    const unstake = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                // send transaction
                const transaction = await staking.unstake(amount);
                setContext({
                    error: null,
                    submitting: true,
                    currentTransaction: transaction
                });
            } catch (e) {
                setContext({
                    error: e.message,
                    submitting: false
                });
            }
        }
    };

    const withdraw = async (
        amount: BigNumberish
    ) => {
        if (staking) {
            try {
                // send transaction
                const transaction = await staking.withdraw(amount);
                setContext({
                    error: null,
                    submitting: true,
                    currentTransaction: transaction
                });
            } catch (e) {
                setContext({
                    error: e.message,
                    submitting: false
                });
            }
        }
    };

    return {
        staking,
        stakedBalance,
        maturingTimestamp,
        releasingTimestamp,
        maturingBalance,
        releasingBalance,
        stake,
        unstake,
        withdraw
    };
};
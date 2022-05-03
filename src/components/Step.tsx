// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React, { useReducer, useEffect, ReactElement } from 'react';
import {
    VStack,
    StackProps,
    Box,
    Text,
    Flex,
    Heading,
    Divider,
    FlexProps,
    useBreakpointValue,
    useColorModeValue,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { StepInfo } from './node/steps/interfaces';
import theme from '../styles/theme';

interface State {
    stepNumberBgColor: string;
    stepNumberColor?: string;
    stepBoxBg: string;
    stepBoxShadow: string;
    status: StepStatus;
    headerColor?: string;
    showBodyActions?: boolean;
    StepChecked?: ReactElement;
}

export enum StepStatus {
    NOT_ACTIVE = 'NOT_ACTIVE',
    ACTIVE = 'ACTIVE',
    SKIPPED = 'SKIPPED',
    COMPLETED = 'COMPLETED',
}

export interface StepProps extends StackProps {
    stepNumber?: number;
    title: string;
    subtitle: string;
    status: StepStatus;
    onActive?: (meta: StepInfo) => void;
}

export const StepBody = (props: FlexProps) => {
    const { children, ...boxProps } = props;
    return (
        <Flex direction="column" px={{ base: 3, md: 12 }} py={3} {...boxProps}>
            {children}
        </Flex>
    );
};

export const StepActions = (props: FlexProps) => {
    const { children, ...boxProps } = props;
    return (
        <Flex px={{ base: 3, md: 12 }} py={6} direction="column" {...boxProps}>
            {children}
        </Flex>
    );
};

const reducer = (state, { type, payload }): State => {
    const status = type;
    switch (type) {
        case StepStatus.ACTIVE:
            return {
                ...payload.activeProps,
                status,
            };
        case StepStatus.COMPLETED:
            return {
                ...payload.activeProps,
                StepChecked: <CheckIcon />,
                showBodyActions: false,
                status,
            };
        case StepStatus.NOT_ACTIVE:
        default:
            return { ...payload.inactiveProps };
    }
};

export const Step = ({
    stepNumber,
    children,
    title,
    subtitle,
    status,
    onActive,
    ...stackProps
}: StepProps) => {
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const stepBoxBg = useColorModeValue('white', 'gray.700');
    const stepNumberBgColor = useColorModeValue('blue.500', 'blue.200');
    const stepNumberColor = useColorModeValue('white', 'black');
    const activeProps = {
        stepBoxShadow: 'base',
        showBodyActions: true,
        stepBoxBg,
        stepNumberBgColor,
        stepNumberColor,
    };

    const inactiveProps = {
        stepNumberBgColor: 'gray',
        stepNumberColor: 'white',
        stepBoxBg: 'trasparent',
        stepBoxShadow: 'none',
        headerColor: '#939393',
        showBodyActions: false,
    };
    const stepActionProps: FlexProps = isSmallScreen
        ? {
              position: 'sticky',
              bottom: 0,
              bgColor: stepBoxBg,
              boxShadow: '0px -4px 8px rgb(47 32 27 / 4%)',
              zIndex: theme.zIndices.sm,
          }
        : {};
    const res = React.Children.toArray(children).reduce(
        (prev: any, cur: any) => {
            prev[cur.type.name] = cur;
            return prev;
        },
        {}
    );

    const [state, dispatch] = useReducer(reducer, {
        ...inactiveProps,
        status: StepStatus.NOT_ACTIVE,
    });

    useEffect(() => {
        if (status === StepStatus.ACTIVE)
            onActive && onActive({ title, subtitle });
    }, [status]);

    useEffect(() => {
        dispatch({
            type: status,
            payload: {
                activeProps,
                inactiveProps,
            },
        });
    }, [stepBoxBg, status]);

    return (
        <VStack
            boxShadow={state.stepBoxShadow}
            bg={state.stepBoxBg}
            rounded="sm"
            className="step-box"
            align="stretch"
            mt={isSmallScreen ? '0px !important' : null}
            {...stackProps}
        >
            {!isSmallScreen && (
                <Flex
                    px={{ base: 3, md: 12 }}
                    py={6}
                    pb={4}
                    className="step-header"
                    alignItems="baseline"
                >
                    {stepNumber && (
                        <Box
                            h={8}
                            minWidth={8}
                            rounded="full"
                            bgColor={state.stepNumberBgColor}
                            display="grid"
                            placeContent="center"
                            color={state.stepNumberColor}
                        >
                            {state.StepChecked || stepNumber}
                        </Box>
                    )}
                    <Box ml={3} color={state.headerColor}>
                        <Heading as="h2" fontSize={['2xl']}>
                            {title}
                        </Heading>
                        <Text size="sm">{subtitle}</Text>
                    </Box>
                </Flex>
            )}
            {state.showBodyActions && (
                <Box>
                    {!isSmallScreen && <Divider w="full" />}
                    {res.StepBody &&
                        React.cloneElement(res.StepBody, {
                            className: 'step-body',
                        })}
                    {res.StepActions &&
                        React.cloneElement(res.StepActions, {
                            className: 'step-actions',
                            ...stepActionProps,
                        })}
                </Box>
            )}
        </VStack>
    );
};

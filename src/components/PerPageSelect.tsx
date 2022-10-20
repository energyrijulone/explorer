// Copyright (C) 2022 Cartesi Pte. Ltd.

// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.

// This program is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU General Public License for more details.

import React from 'react';
import { Select, SelectProps, Text, HStack } from '@chakra-ui/react';

export interface PerPageSelect extends SelectProps {
    options: number[];
    onChange: (event: React.ChangeEvent) => void;
}

const PerPageSelect = (props) => {
    const { value, options, onChange, ...restProps } = props;

    return (
        <HStack mr={{ base: 0, md: 12 }} mb={{ base: 4, md: 0 }}>
            <Text fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}>
                Rows per page
            </Text>

            <Select
                value={value}
                width="4.625rem"
                borderLeft="none"
                borderTop="none"
                borderRight="none"
                borderRadius={0}
                fontSize={{ base: 'xs', sm: 'sm', md: 'md' }}
                onChange={onChange}
                {...restProps}
            >
                {options.map((option) => (
                    <option key={`rows-per-page-${option}`} value={option}>
                        {option}
                    </option>
                ))}
            </Select>
        </HStack>
    );
};

export default PerPageSelect;

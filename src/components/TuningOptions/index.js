import React, { useState } from 'react';
import { Input, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";

const TuningOptions = ({ title, mb }) => {
    const [pGain, setPGain] = useState('');
    const [iGain, setIGain] = useState('');
    const [dGain, setDGain] = useState('');
    const [lpf, setLPF] = useState('');

    const bgColor = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    return (
        <VStack spacing={4} align="start" bg={bgColor} p={5} borderRadius="md" border="1px" borderColor={borderColor} mb={mb} w="100%" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" color="orange.800">{title}</Text>
            <HStack spacing={4} w="100%" justify="space-between">
                {[{ label: 'P Gain', value: pGain, setter: setPGain },
                { label: 'I Gain', value: iGain, setter: setIGain },
                { label: 'D Gain', value: dGain, setter: setDGain },
                { label: 'LPF Time Constant', value: lpf, setter: setLPF }].map((item, index) => (
                    <VStack key={index}>
                        <Text>{item.label}:</Text>
                        <Input
                            variant="outline"
                            value={item.value}
                            onChange={(e) => item.setter(e.target.value)}
                            placeholder={`Enter ${item.label}`}
                            size="sm"
                            focusBorderColor="orange.800"
                        />
                    </VStack>
                ))}
            </HStack>
        </VStack>
    );
}

export default TuningOptions;

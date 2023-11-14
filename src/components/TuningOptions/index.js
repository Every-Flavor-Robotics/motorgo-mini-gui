import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Input, VStack, HStack, Text, useColorModeValue } from "@chakra-ui/react";

const TuningOptions = forwardRef(({ title, channel, mb, controller_type, url }, ref) => {
    const [pGain, setPGain] = useState('');
    const [iGain, setIGain] = useState('');
    const [dGain, setDGain] = useState('');
    const [lpf, setLPF] = useState('');

    // State to keep track of the input values before formatting
    const [pGainInput, setPGainInput] = useState('');
    const [iGainInput, setIGainInput] = useState('');
    const [dGainInput, setDGainInput] = useState('');
    const [lpfInput, setLPFInput] = useState('');

    const bgColor = useColorModeValue("gray.100", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const formatValue = (value) => {
        // Check if value is a valid number (including zero)
        if (!isNaN(value) && value !== '') {
            return parseFloat(parseFloat(value).toFixed(4)).toString(); // Convert to a float and back to a string to remove trailing zeros
        }
    };

    // Call this function when the input is blurred
    const handleBlur = (setter, inputValue, setInputChange) => {
        const formattedValue = formatValue(inputValue);
        setter(formattedValue); // Set the state with the formatted value
        setInputChange(formattedValue); // Also update the input state to display the formatted value
    };

    useEffect(() => {
        loadData();
    }, [channel, controller_type]); // Dependency array, so it only runs once when the component mounts or if channel changes

    // Expose the save and load methods to the parent component
    useImperativeHandle(ref, () => ({
        saveData,
        loadData
    }));

    const handleInputChange = (setter, value) => {
        const number = parseFloat(value); // Convert the input value to a float
        if (!isNaN(number)) { // Check if the conversion was successful
            setter(number); // If successful, update the state with the float number
        } else {
            setter(''); // If conversion failed (e.g., empty string), reset the state
        }
    };

    const saveData = async () => {
        // Set the loading state here if you have one
        try {
            // Parse the input state to a float before sending
            const pGainNumber = parseFloat(pGainInput);
            const iGainNumber = parseFloat(iGainInput);
            const dGainNumber = parseFloat(dGainInput);
            const lpfNumber = parseFloat(lpfInput);

            // Make sure to check if the parsed number is a valid number before sending
            if (!isNaN(pGainNumber)) {
                await updateGain(channel, controller_type, 'p', pGainNumber, url);
            }
            if (!isNaN(iGainNumber)) {
                await updateGain(channel, controller_type, 'i', iGainNumber, url);
            }
            if (!isNaN(dGainNumber)) {
                await updateGain(channel, controller_type, 'd', dGainNumber, url);
            }
            if (!isNaN(lpfNumber)) {
                await updateGain(channel, controller_type, 'lpf', lpfNumber, url);
            }
        } catch (error) {
            console.error('Failed to save PID parameters:', error);
        }
        // Unset the loading state here
    };

    const loadData = async () => {
        try {
            const responseP = await fetch(`${url}/ch${channel}/${controller_type}/p`);
            const dataP = await responseP.json();
            setPGain(formatValue(dataP.value));
            setPGainInput(formatValue(dataP.value)); // Update the input state as well

            const responseI = await fetch(`${url}/ch${channel}/${controller_type}/i`);
            const dataI = await responseI.json();
            setIGain(formatValue(dataI.value));
            setIGainInput(formatValue(dataI.value)); // Update the input state as well

            const responseD = await fetch(`${url}/ch${channel}/${controller_type}/d`);
            const dataD = await responseD.json();
            setDGain(formatValue(dataD.value));
            setDGainInput(formatValue(dataD.value)); // Update the input state as well

            const responseLPF = await fetch(`${url}/ch${channel}/${controller_type}/lpf`);
            const dataLPF = await responseLPF.json();
            setLPF(formatValue(dataLPF.value));
            setLPFInput(formatValue(dataLPF.value)); // Update the input state as well
        } catch (error) {
            console.error('Failed to load PID parameters:', error);
        }
    };

    return (
        <VStack spacing={4} align="start" bg={bgColor} p={5} borderRadius="md" border="1px" borderColor={borderColor} mb={mb} w="100%" boxShadow="md">
            <Text fontSize="xl" fontWeight="bold" color="orange.800">{title}</Text>
            <HStack spacing={4} w="100%" justify="space-between">
                {[{
                    label: 'P Gain', value: pGain, setter: setPGain, inputState: pGainInput, setInputState: setPGainInput
                }, {
                    label: 'I Gain', value: iGain, setter: setIGain, inputState: iGainInput, setInputState: setIGainInput
                }, {
                    label: 'D Gain', value: dGain, setter: setDGain, inputState: dGainInput, setInputState: setDGainInput
                }, {
                    label: 'LPF Time Constant', value: lpf, setter: setLPF, inputState: lpfInput, setInputState: setLPFInput
                }].map((item, index) => (
                    <VStack key={index}>
                        <Text>{item.label}:</Text>
                        <Input
                            type="number"
                            step="any"
                            variant="outline"
                            value={item.inputState}
                            onChange={(e) => item.setInputState(e.target.value)}
                            onBlur={() => handleBlur(item.setter, item.inputState, item.setInputState)}
                            placeholder={`Enter ${item.label}`}
                            size="sm"
                            focusBorderColor="orange.800"
                        />
                    </VStack>
                ))}
            </HStack>
        </VStack>
    );
});

export default TuningOptions;

// Helper function to update a gain value
const updateGain = async (channel, controller_type, gain_type, value, url) => {
    console.log(controller_type, gain_type);
    try {
        const response = await fetch(`${url}/ch${channel}/${controller_type}/${gain_type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Failed to update ${gain_type} gain:`, error);
    }
};
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Input, VStack, HStack, Text, Button, useColorModeValue, useToast, Spinner } from "@chakra-ui/react";

const TuningOptions = forwardRef(({ title, channel, mb, controller_type, url }, ref) => {
    const [pGain, setPGain] = useState('');
    const [iGain, setIGain] = useState('');
    const [dGain, setDGain] = useState('');
    const [lpf, setLPF] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // State to keep track of the input values before formatting
    const [pGainInput, setPGainInput] = useState('');
    const [iGainInput, setIGainInput] = useState('');
    const [dGainInput, setDGainInput] = useState('');
    const [lpfInput, setLPFInput] = useState('');

    const toast = useToast();
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

    const handleOperation = async (operation, operationStateSetter, operationName) => {
        operationStateSetter(true);
        try {
            await operation();
            toast({
                title: `${operationName} Successful`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error(`${operationName} failed:`, error);
            toast({
                title: `${operationName} Failed`,
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            operationStateSetter(false);
        }
    };

    const loadData = async () => {
        try {
            const response = await fetch(`${url}`);
            if (response.ok) {
                const data = await response.json();
                const values = data.value;

                console.log(data);

                setPGain(formatValue(values.p));
                setPGainInput(formatValue(values.p));
                setIGain(formatValue(values.i));
                setIGainInput(formatValue(values.i));
                setDGain(formatValue(values.d));
                setDGainInput(formatValue(values.d));
                setLPF(formatValue(values.lpf_time_constant));
                setLPFInput(formatValue(values.lpf_time_constant));
                // Handle other parameters similarly
            } else {
                throw new Error('Failed to load PID parameters');
            }
        } catch (error) {
            console.error('Failed to load PID parameters:', error);
        }
    };

    const saveData = async () => {
        try {
            const payload = {
                p: parseFloat(pGainInput),
                i: parseFloat(iGainInput),
                d: parseFloat(dGainInput),
                lpf_time_constant: parseFloat(lpfInput),
                // Include other parameters as needed
            };
            console.log(JSON.stringify({ "value": payload }));

            const response = await fetch(`${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "value": payload })
            });

            if (!response.ok) {
                throw new Error(`Failed to save PID parameters: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to save PID parameters:', error);
        }
    };

    useEffect(() => {
        handleOperation(loadData, setIsLoading, 'Load Parameters');
    }, [url]); // Dependency array

    useImperativeHandle(ref, () => ({
        saveData: () => handleOperation(saveData, setIsUpdating, 'Save Parameters'),
        loadData: () => handleOperation(loadData, setIsLoading, 'Load Parameters')
    }));

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
            <HStack spacing={4} mt={4}>
                <Button colorScheme="blue" onClick={() => handleOperation(loadData, setIsLoading, 'Load Parameters')}
                    isLoading={isLoading} loadingText="Loading...">
                    Pull Parameters
                </Button>
                <Button colorScheme="green" onClick={() => handleOperation(saveData, setIsUpdating, 'Save Parameters')}
                    isLoading={isUpdating} loadingText="Saving...">
                    Push Parameters
                </Button>
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
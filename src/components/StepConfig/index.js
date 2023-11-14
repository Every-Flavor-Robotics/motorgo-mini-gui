// StepConfig.js
import React, { useState } from 'react';
import { VStack, HStack, Button, Badge, useToast } from "@chakra-ui/react";

const StepConfig = ({ url }) => {
    const [motorsEnabled, setMotorsEnabled] = useState(false);
    const toast = useToast();

    const handleMotorControl = async (enable) => {
        try {
            const response = await fetch(`${url}/enable`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value: enable }),
            });

            if (response.ok) {
                setMotorsEnabled(enable);
                toast({
                    title: enable ? "Motors Enabled." : "Motors Disabled.",
                    description: `Motors have been successfully ${enable ? 'enabled' : 'disabled'}.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                throw new Error(`Failed to ${enable ? 'enable' : 'disable'} motors: ${response.statusText}`);
            }
        } catch (error) {
            toast({
                title: "Operation Failed.",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error(error.message);
        }
    };

    return (
        <VStack spacing={4} align="center" p={4}>
            <HStack spacing={4}>
                <Button
                    colorScheme="green"
                    onClick={() => handleMotorControl(true)}
                    isDisabled={motorsEnabled}
                >
                    Enable Motors
                </Button>
                <Button
                    colorScheme="red"
                    onClick={() => handleMotorControl(false)}
                    isDisabled={!motorsEnabled}
                >
                    Disable Motors
                </Button>
            </HStack>
            <Badge
                fontSize="1em"
                p={2}
                borderRadius="full"
                colorScheme={motorsEnabled ? "green" : "red"}
                variant="solid"
            >
                {motorsEnabled ? "ENABLED" : "DISABLED"}
            </Badge>
        </VStack>
    );
};

export default StepConfig;

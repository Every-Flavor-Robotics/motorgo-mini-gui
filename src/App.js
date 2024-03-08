// App.js
import * as React from "react";
import { useState } from 'react';
import { ChakraProvider, Flex, Input, Button, HStack, useToast } from "@chakra-ui/react";
import ChannelSelector from './components/ChannelSelector';
import ResponsePlotter from './components/ResponsePlotter';
import StepConfig from './components/StepConfig';
import { nanoid } from 'nanoid';

function App() {
    const [dataSourceUrl, setDataSourceUrl] = useState('');
    const [sessionId, setSessionId] = useState('');
    console.log('Session ID:', sessionId);
    const [isConnected, setIsConnected] = useState(false); // Add a state to track connection status
    const [isConnecting, setIsConnecting] = useState(false); // State to manage connection loading status
    const toast = useToast();

    const dummyData = {
        labels: ['0s', '1s', '2s'],
        datasets: [
            {
                label: 'Torque',
                data: [0, 10, 5],
                color: 'red'
            },
            {
                label: 'Velocity',
                data: [5, 20, 30],
                color: 'blue'
            }
        ]
    };

    const handleConnect = async () => {
        setIsConnecting(true); // Start the spinner on the button
        const uniqueSessionId = nanoid(); // Generate a unique session ID
        setSessionId(uniqueSessionId);

        try {
            const response = await fetch(`${dataSourceUrl}/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ session_id: uniqueSessionId }),
                timeout: 2000,
            });

            if (response.ok) {
                setIsConnected(true); // Set connected status to true
                toast({
                    title: "Connected.",
                    description: "Session established successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                console.log('Session established with ID:', uniqueSessionId);
            } else {
                toast({
                    title: "Failed to connect.",
                    description: `Failed to establish session: ${response.statusText}`,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                console.error('Failed to establish session:', response.statusText);
            }
        } catch (error) {
            toast({
                title: "Network Error.",
                description: "Unable to connect to the server.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            console.error('Network error:', error);
        }
        finally {
            setIsConnecting(false); // Stop the spinner regardless of the outcome
        }
    };

    return (
        <ChakraProvider>
            <Flex height="100vh" bg="gray.100" direction="column">
                <HStack p={4}>
                    <Input
                        placeholder="Enter server IP address"
                        value={dataSourceUrl}
                        onChange={(e) => setDataSourceUrl(e.target.value)}
                        isDisabled={isConnected} // Disable the input if connected
                    />
                    <Button
                        onClick={handleConnect}
                        isLoading={isConnecting} // Use the loading state to control the spinner
                        loadingText="Connecting" // Optional text to display next to the spinner
                        isDisabled={isConnected} // Disable the button if already connected
                    >
                        Connect
                    </Button>
                </HStack>
                {isConnected && ( // Only render children if connected
                    <Flex flex="1">
                        <Flex flex="1" borderRightWidth="2px" borderRightColor="gray.200" p={4} direction="column" alignItems="stretch" boxSizing="border-box">
                            <ChannelSelector url={dataSourceUrl} />
                        </Flex>
                        <Flex flex="1" direction="column" p={4} alignItems="stretch" justifyContent="center">
                            <ResponsePlotter data={dummyData} url={dataSourceUrl} />
                            <StepConfig url={dataSourceUrl} />
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </ChakraProvider>
    );
}

export default App;

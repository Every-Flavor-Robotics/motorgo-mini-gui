import React, { useState, useRef, useEffect } from 'react';
import {
    Box, VStack, Button, HStack, useColorModeValue, Spinner, useToast
} from '@chakra-ui/react';
import TuningOptions from '../TuningOptions';

const ChannelSelector = ({ url }) => {
    const [controllers, setControllers] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const tabBgColor = useColorModeValue("gray.100", "gray.700");
    const toast = useToast(); // Initialize the toast hook

    useEffect(() => {
        // Fetch the schema when the component mounts
        const fetchSchema = async () => {
            try {
                const response = await fetch(`${url}/pid/schema`);
                if (response.ok) {
                    const schema = await response.json();
                    console.log(schema);
                    setControllers(schema.value); // Assume the schema has a "value" key that holds an array
                } else {
                    throw new Error('Failed to fetch PID schema');
                }
            } catch (error) {
                toast({
                    title: "Failed to fetch.",
                    description: error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchSchema();
    }, [url, toast]);

    // Create refs for each TuningOptions instance
    const ch0PositionRef = useRef();
    const ch0VelocityRef = useRef();
    const ch0TorqueRef = useRef();

    const ch1PositionRef = useRef();
    const ch1VelocityRef = useRef();
    const ch1TorqueRef = useRef();

    const showToast = (title, description, status) => {
        toast({
            title: title,
            description: description,
            status: status,
            duration: 5000,
            isClosable: true,
            position: 'bottom-left',
        });
    };

    // Function to handle loading state and call the provided operation
    const handleOperation = async (operation, operationStateSetter, operationName) => {
        operationStateSetter(true);
        try {
            await operation();
            // Sleep for 1 second to allow the controller to update
            await new Promise(r => setTimeout(r, 500));
            showToast(`${operationName} Successful`, ``, 'success');
        } catch (error) {
            await new Promise(r => setTimeout(r, 500));
            console.error(`${operationName} failed:`, error);
            showToast(`${operationName} Failed`, ``, 'error');
        }
        operationStateSetter(false);
    };

    const saveAll = () => {
        handleOperation(() => {
            // Call save method on each TuningOptions
            ch0PositionRef.current?.saveData();
            ch0VelocityRef.current?.saveData();
            ch0TorqueRef.current?.saveData();

            ch1PositionRef.current?.saveData();
            ch1VelocityRef.current?.saveData();
            ch1TorqueRef.current?.saveData();

        }, setIsUpdating, "Push Parameters");
    };

    const loadAll = () => {
        handleOperation(() => {
            // Call load method on each TuningOptions
            ch0PositionRef.current?.loadData();
            ch0VelocityRef.current?.loadData();
            ch0TorqueRef.current?.loadData();

            ch1PositionRef.current?.loadData();
            ch1VelocityRef.current?.loadData();
            ch1TorqueRef.current?.loadData();

        }, setIsLoading, "Load Parameters");
    };

    const handleTabChange = (index) => {
        setSelectedChannel(index);
    };

    return (
        <Box my={4} p={4}>
            <VStack spacing={4}>
                {controllers.map(controller => (
                    <TuningOptions
                        key={controller.endpoint}
                        title={controller.name}
                        url={`${url}${controller.endpoint}`}
                        mb={4}
                    />
                ))}
            </VStack>
            {/* <Button
                onClick={loadAll}
                isLoading={isLoading}
                loadingText="Loading..."
                colorScheme="blue"
                my={4}
            >
                Load Parameters
            </Button> */}
            {/* <Button
                onClick={saveAll}
                isLoading={isUpdating}
                loadingText="Loading..."
                colorScheme="green"
                my={4}
            >
                Load Parameters
            </Button> */}
        </Box>
    );
};

export default ChannelSelector;

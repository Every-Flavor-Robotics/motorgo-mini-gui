import React, { useState, useRef } from 'react';
import {
    Box, Tabs, TabList, Tab, TabPanels, TabPanel,
    Button, HStack, useColorModeValue, Spinner, useToast
} from '@chakra-ui/react';
import TuningOptions from '../TuningOptions';

const ChannelSelector = ({ url }) => {
    const [selectedChannel, setSelectedChannel] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const tabBgColor = useColorModeValue("gray.100", "gray.700");
    const toast = useToast(); // Initialize the toast hook

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
        <Box my={4} borderRadius="md" overflow="hidden">
            <Tabs onChange={handleTabChange} variant="enclosed" isFitted bg={tabBgColor}>
                <TabList borderBottom="2px solid" borderColor="orange.800">
                    <Tab _selected={{ bg: 'orange.800', color: 'white' }}>Channel 0</Tab>
                    <Tab _selected={{ bg: 'orange.800', color: 'white' }}>Channel 1</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel px={4} pt={4}>
                        <TuningOptions ref={ch0PositionRef} title="Position Controller" url={url} channel={0} controller_type={"position"} mb={4} />
                        <TuningOptions ref={ch0VelocityRef} title="Velocity Controller" url={url} channel={0} controller_type={"velocity"} mb={4} />
                        <TuningOptions ref={ch0TorqueRef} title="Torque Controller" url={url} channel={0} controller_type={"current"} />
                    </TabPanel>
                    <TabPanel px={4} pt={4}>
                        <TuningOptions ref={ch1PositionRef} title="Position Controller" url={url} channel={1} controller_type={"position"} mb={4} />
                        <TuningOptions ref={ch1VelocityRef} title="Velocity Controller" url={url} channel={1} controller_type={"velocity"} mb={4} />
                        <TuningOptions ref={ch1TorqueRef} title="Torque Controller" url={url} channel={1} controller_type={"current"} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <HStack spacing={4} mt={4} justifyContent="center">
                <Button
                    leftIcon={isLoading ? <Spinner size="sm" /> : null}
                    colorScheme="blue"
                    onClick={loadAll}
                    isLoading={isLoading}
                    loadingText="Loading..."
                >
                    Load Parameters
                </Button>
                <Button
                    leftIcon={isUpdating ? <Spinner size="sm" /> : null}
                    colorScheme="green"
                    onClick={saveAll}
                    isLoading={isUpdating}
                    loadingText="Updating..."
                >
                    Update Parameters
                </Button>
            </HStack>
        </Box>
    );
};

export default ChannelSelector;

import React, { useState } from 'react';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, useColorModeValue } from '@chakra-ui/react';
import TuningOptions from '../TuningOptions';

const ChannelSelector = () => {
    const [selectedChannel, setSelectedChannel] = useState(0);
    const tabBgColor = useColorModeValue("gray.100", "gray.700");

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
                        <TuningOptions title="Position Controller" mb={4} />
                        <TuningOptions title="Velocity Controller" mb={4} />
                        <TuningOptions title="Torque Controller" />
                    </TabPanel>
                    <TabPanel px={4} pt={4}>
                        <TuningOptions title="Position Controller" mb={4} />
                        <TuningOptions title="Velocity Controller" mb={4} />
                        <TuningOptions title="Torque Controller" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default ChannelSelector;

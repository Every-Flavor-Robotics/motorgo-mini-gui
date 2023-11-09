// App.js
import * as React from "react";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import ChannelSelector from './components/ChannelSelector';
import ResponsePlotter from './components/ResponsePlotter';

function App() {
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

    return (
        <ChakraProvider>
            <Flex height="100vh" bg="gray.100">
                <Flex flex="1" borderRightWidth="2px" borderRightColor="gray.200" p={4} direction="column" alignItems="stretch" boxSizing="border-box">
                    <ChannelSelector />
                </Flex>
                <Flex flex="1" p={4} alignItems="stretch" justifyContent="center">
                    <ResponsePlotter data={dummyData} />
                </Flex>
            </Flex>
        </ChakraProvider>
    );
}

export default App;

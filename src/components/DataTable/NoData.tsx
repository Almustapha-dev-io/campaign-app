import { Box, Button, Center, Heading } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

type Props = {
  onRetry?(): any;
};

function NoData({ onRetry }: Props) {
  return (
    <Box h="300px">
      <Center h="full" flexDir="column">
        <WarningIcon fontSize="5xl" color="gray.500" />
        <Heading fontSize="xl" my="2" color="gray.500">
          No data found
        </Heading>
        {onRetry !== undefined && (
          <Button colorScheme="gray" onClick={onRetry} w="150px" mt={4}>
            Retry
          </Button>
        )}
      </Center>
    </Box>
  );
}

export default NoData;

import { HStack, Skeleton, VStack } from '@chakra-ui/react';

function Loader() {
  return (
    <>
      <HStack spacing={6}>
        {Array(4)
          .fill('_')
          .map((_, i) => (
            <Skeleton h={8} w="full" key={i} borderRadius="lg" />
          ))}
      </HStack>
      <VStack spacing={4} mt={6}>
        {Array(10)
          .fill('_')
          .map((_, i) => (
            <Skeleton h={6} w="full" key={i} borderRadius="lg" />
          ))}
      </VStack>
    </>
  );
}

export default Loader;

import {
  Box,
  BoxProps,
  Center,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import uuid from 'react-uuid';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetFeedbackAnalysisQuery } from 'store/reducers/feedback-api-slice';
import { useGetUserAnalyticsQuery } from 'store/reducers/users-api-slice';
import { useGetVotersAnalyticsQuery } from 'store/reducers/voters-api-slice';
import { Roles } from 'types/roles';

function Card({ children, ...rest }: BoxProps) {
  return (
    <Box bg="white" rounded="lg" shadow="sm" p="4" {...rest}>
      {children}
    </Box>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const COLORS_2 = ['teal', 'orange', 'cyan', '#FF8042'];

function Dashboard() {
  const { data: voterAnalyticsData, isFetching: voterAnalyticsLoading } =
    useGetVotersAnalyticsQuery();

  const { data: feedbackAnalysisData, isFetching: feedbackAnalysisLoading } =
    useGetFeedbackAnalysisQuery();

  const { data: userAnalyticsData, isFetching: userAnalyticsLoading } =
    useGetUserAnalyticsQuery();

  const { userDetails } = useAuth();

  const isRole = (role: Roles) => {
    if (!userDetails) return false;
    return userDetails.roles.map((r) => r.name).includes(role);
  };

  return (
    <VStack
      w="full"
      h="full"
      pt={{ base: 4, lg: 12 }}
      pb="300px"
      spacing="10"
      align="flex-start"
    >
      <Heading fontSize="3xl">Dashboard</Heading>

      {isRole(Roles.PartyAgent) && (
        <VStack w="full" spacing="4" align="flex-start">
          <SkeletonText
            noOfLines={1}
            h="8px"
            isLoaded={!userAnalyticsLoading}
            pb="4"
          >
            <Heading fontSize="sm" color="gray.600">
              Voting Results
            </Heading>
          </SkeletonText>
          {userAnalyticsLoading && (
            <Center bg="white" shadow="sm" rounded="xl" w="full" h="300px">
              <Spinner color="green.500" />
            </Center>
          )}

          <SimpleGrid w="full" columns={{ base: 1, md: 2, xl: 4 }} spacing="6">
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Registered Voters
                </Text>
                <Heading>999</Heading>
              </VStack>
            </Card>
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Accredited Voters
                </Text>
                <Heading>999</Heading>
              </VStack>
            </Card>
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Invalid Voters
                </Text>
                <Heading>999</Heading>
              </VStack>
            </Card>
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Recorded Voters
                </Text>
                <Heading>999</Heading>
              </VStack>
            </Card>
          </SimpleGrid>
        </VStack>
      )}

      {isRole(Roles.SuperAdmin) && (
        <VStack w="full" spacing="4" align="flex-start">
          <SkeletonText
            noOfLines={1}
            h="8px"
            isLoaded={!userAnalyticsLoading}
            pb="4"
          >
            <Heading fontSize="sm" color="gray.600">
              Users
            </Heading>
          </SkeletonText>
          {userAnalyticsLoading && (
            <Center bg="white" shadow="sm" rounded="xl" w="full" h="300px">
              <Spinner color="green.500" />
            </Center>
          )}

          {!userAnalyticsLoading && !!userAnalyticsData && (
            <SimpleGrid
              w="full"
              columns={{ base: 1, md: 2, xl: 4 }}
              spacing="6"
            >
              {userAnalyticsData.map((analytics) => (
                <Card key={uuid()}>
                  <VStack w="full" align="flex-start" spacing="1" px="2">
                    <Text color="gray.500" fontSize="sm">
                      {analytics.role.split('_').join(' ')}
                    </Text>
                    <Heading>{analytics.total}</Heading>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      )}

      {/* <VStack w="full" spacing="4" align="flex-start">
        <SkeletonText noOfLines={1} h="8px" isLoaded={!voterAnalyticsLoading}>
          <Heading fontSize="sm" color="gray.600">
            Captured Voters
          </Heading>
        </SkeletonText>

        <SimpleGrid w="full" columns={{ base: 1, md: 3 }} spacing="6">
          <Skeleton
            rounded="lg"
            h="140px"
            w="full"
            isLoaded={!voterAnalyticsLoading}
          >
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Total Voters
                </Text>
                <Heading>
                  {voterAnalyticsData
                    ? voterAnalyticsData.totalVotersUploaded
                    : 0}
                </Heading>
              </VStack>
            </Card>
          </Skeleton>

          <Skeleton
            rounded="lg"
            h="140px"
            w="full"
            isLoaded={!voterAnalyticsLoading}
          >
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Voters Called
                </Text>
                <Heading>
                  {voterAnalyticsData
                    ? voterAnalyticsData.totalVotersCalled
                    : 0}
                </Heading>
              </VStack>
            </Card>
          </Skeleton>

          <Skeleton
            rounded="lg"
            h="140px"
            w="full"
            isLoaded={!voterAnalyticsLoading}
          >
            <Card>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Voters Not Called
                </Text>
                <Heading>
                  {voterAnalyticsData
                    ? voterAnalyticsData.totalVotersUploaded -
                      voterAnalyticsData.totalVotersCalled
                    : 0}
                </Heading>
              </VStack>
            </Card>
          </Skeleton>
        </SimpleGrid>
      </VStack> */}

      <VStack w="full" spacing="4" align="flex-start">
        <SkeletonText
          noOfLines={1}
          h="8px"
          isLoaded={!feedbackAnalysisLoading}
          pb="4"
        >
          <Heading fontSize="sm" color="gray.600">
            Analysis
          </Heading>
        </SkeletonText>

        <SimpleGrid w="full" columns={{ base: 1, md: 2 }} spacing="6">
          <Skeleton
            rounded="lg"
            h="300px"
            w="full"
            isLoaded={!feedbackAnalysisLoading}
          >
            <Card>
              <VStack w="full" h="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Feedback Analysis
                </Text>
                <Box w="full" h="300px" flexShrink="0">
                  {!!feedbackAnalysisData && feedbackAnalysisData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          dataKey="total"
                          nameKey="channel"
                          data={feedbackAnalysisData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {feedbackAnalysisData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Center w="full" h="full">
                      <Text>No Data Found</Text>
                    </Center>
                  )}
                </Box>
              </VStack>
            </Card>
          </Skeleton>

          <Skeleton
            rounded="lg"
            h="300px"
            w="full"
            isLoaded={!voterAnalyticsLoading}
          >
            <Card>
              <VStack w="full" h="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Votes Analysis
                </Text>
                <Box w="full" h="300px" flexShrink="0">
                  {!!voterAnalyticsData && voterAnalyticsData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          dataKey="total"
                          nameKey="votedParty"
                          data={voterAnalyticsData.map((v) =>
                            v.votedParty ? v : { ...v, votedParty: 'PENDING' }
                          )}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {voterAnalyticsData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS_2[index % COLORS_2.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Center w="full" h="full">
                      <Text>No Data Found</Text>
                    </Center>
                  )}
                </Box>
              </VStack>
            </Card>
          </Skeleton>
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}

export default Dashboard;

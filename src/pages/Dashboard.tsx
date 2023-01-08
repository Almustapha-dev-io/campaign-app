import {
  Box,
  BoxProps,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Select,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import useAuth from 'hooks/useAuth';
import { useEffect, useState } from 'react';
import uuid from 'react-uuid';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useGetFeedbackAnalysisQuery } from 'store/reducers/feedback-api-slice';
import {
  useLazyGetIssuesAnalyticsQuery,
  useLazyGetPollingUnitsQuery,
} from 'store/reducers/polling-units-api-slice';
import {
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} from 'store/reducers/states-api-slice';
import { useGetUserAnalyticsQuery } from 'store/reducers/users-api-slice';
import { useGetVotersAnalyticsQuery } from 'store/reducers/voters-api-slice';
import {
  useGetPollingUnitVoteAnlyticsQuery,
  useLazyGetPollingUnitVoteAnlyticsQuery,
} from 'store/reducers/votes-api-slice';
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

  const [
    getPollingUnitsAnalysis,
    { data: pollingUnitAnalytics, isFetching: pollingUnitAnalyticsLoading },
  ] = useLazyGetPollingUnitVoteAnlyticsQuery();

  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [pollingUnit, setPollingUnit] = useState('');

  const [
    getLgas,
    {
      isFetching: isFetchingLgs,
      data: lgas,
      isError: isLgaError,
      error: lgaError,
    },
  ] = useLazyGetLGAsQuery();
  const [
    getWards,
    {
      isFetching: isFetchingWards,
      data: wards,
      isError: isWardError,
      error: wardError,
    },
  ] = useLazyGetWardsQuery();

  const [
    getPollingUnits,
    {
      isFetching: isFetchingPUs,
      data: pollingUnits,
      isError: isPollingUnitError,
    },
  ] = useLazyGetPollingUnitsQuery();

  const [
    getPollingUnitsIssuesAnalytics,
    {
      isFetching: isFetchingPUIssue,
      data: pollingUnitsIssueAnalytics,
      isError: isPollingUnitIssueError,
    },
  ] = useLazyGetIssuesAnalyticsQuery();

  const { userDetails } = useAuth();

  const isRole = (role: Roles) => {
    if (!userDetails) return false;
    return userDetails.roles.map((r) => r.name).includes(role);
  };

  const isAdmin = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.SuperAdmin)
    : false;

  const isObserver = userDetails
    ? userDetails.roles.map((r) => r.name).includes(Roles.ObservationRoomAgent)
    : false;

  useEffect(() => {
    if (isAdmin || isObserver) {
      if (pollingUnit) {
        getPollingUnitsAnalysis(pollingUnit);
        getPollingUnitsIssuesAnalytics(pollingUnit);
      }
    } else {
      if (userDetails && userDetails.pollingUnit) {
        getPollingUnitsAnalysis(userDetails.pollingUnit.id.toString());
        getPollingUnitsIssuesAnalytics(userDetails.pollingUnit.id.toString());
      }
    }
  }, [
    getPollingUnitsAnalysis,
    getPollingUnitsIssuesAnalytics,
    isAdmin,
    isObserver,
    pollingUnit,
    userDetails,
  ]);

  useEffect(() => {
    if (isAdmin || isObserver) {
      getLgas();
    }
  }, [getLgas, isAdmin, isObserver]);

  useEffect(() => {
    if (lga) {
      setWard('');
      getWards(lga);
    }
  }, [getWards, lga]);

  useEffect(() => {
    if (ward) {
      setPollingUnit('');
      getPollingUnits(Number(ward));
    }
  }, [getPollingUnits, ward]);

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

      {(isAdmin || isObserver) && (
        <Stack w="full" spacing="6" direction={{ base: 'column', md: 'row' }}>
          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs}
          >
            <FormLabel>Local Gov't</FormLabel>
            <Select
              defaultValue=""
              value={lga}
              onChange={(e) => setLga(e.target.value)}
            >
              <option value="" hidden>
                Select Local Gov't
              </option>
              {!!lgas
                ? lgas.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>

          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs || isFetchingWards || !lga}
          >
            <FormLabel>Ward</FormLabel>
            <Select
              defaultValue=""
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            >
              <option value="" hidden>
                Select Ward
              </option>
              {!!wards
                ? wards.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>

          <FormControl
            w={{ base: 'full', md: '200px' }}
            isDisabled={isFetchingLgs || isFetchingWards || !lga || !ward}
          >
            <FormLabel>Polling Unit</FormLabel>
            <Select
              defaultValue=""
              value={pollingUnit}
              onChange={(e) => setPollingUnit(e.target.value)}
            >
              <option>Select One</option>
              {!!pollingUnits
                ? pollingUnits.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))
                : null}
            </Select>
          </FormControl>
        </Stack>
      )}

      {(isRole(Roles.PartyAgent) || isAdmin || isObserver) && (
        <VStack w="full" spacing="4" align="flex-start">
          {pollingUnitAnalyticsLoading && (
            <Center bg="white" shadow="sm" rounded="xl" w="full" h="300px">
              <Spinner color="green.500" />
            </Center>
          )}

          {!pollingUnitAnalyticsLoading && !!pollingUnitAnalytics && (
            <>
              <SkeletonText
                noOfLines={1}
                h="8px"
                isLoaded={!pollingUnitAnalyticsLoading}
                pb="4"
              >
                {pollingUnitAnalytics.length > 0 && (
                  <Heading fontSize="sm" color="gray.600">
                    Polling Unit Votes Analysis
                  </Heading>
                )}
              </SkeletonText>
              <SimpleGrid
                w="full"
                columns={{ base: 1, md: 2, xl: 4 }}
                spacing="6"
              >
                {pollingUnitAnalytics.map((analytics) => (
                  <Card key={uuid()}>
                    <VStack w="full" align="flex-start" spacing="1" px="2">
                      <Text color="gray.500" fontSize="sm">
                        {analytics.party} - votes
                      </Text>
                      <Heading>{analytics.totalVotes}</Heading>
                    </VStack>
                  </Card>
                ))}
              </SimpleGrid>
            </>
          )}
        </VStack>
      )}

      {(isRole(Roles.PartyAgent) || isAdmin || isObserver) && pollingUnit && (
        <VStack w="full" spacing="4" align="flex-start">
          <Skeleton
            noOfLines={1}
            h="100px"
            w="full"
            isLoaded={!isFetchingPUIssue}
            pb="4"
          >
            <Card key={uuid()}>
              <VStack w="full" align="flex-start" spacing="1" px="2">
                <Text color="gray.500" fontSize="sm">
                  Total Issues Recorded
                </Text>
                <Heading>
                  {pollingUnitsIssueAnalytics
                    ? pollingUnitsIssueAnalytics.totalIssues
                    : 0}
                </Heading>
              </VStack>
            </Card>
          </Skeleton>
        </VStack>
      )}

      {isAdmin && (
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

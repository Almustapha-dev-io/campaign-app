import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  GridItem,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
} from '@chakra-ui/react';
import { VoterContext } from 'contexts/voter';
import { format } from 'date-fns';
import { useContext } from 'react';

function VoterDetails({ label, value }: Record<'label' | 'value', string>) {
  return (
    <Stat>
      <StatHelpText>{label}</StatHelpText>
      <StatLabel>{value}</StatLabel>
    </Stat>
  );
}

function ViewVoter() {
  const { viewOpen, onViewClose, selectedVoterToView, setSelectedVoter } =
    useContext(VoterContext);

  const getDateValue = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const voterDetails = (
    <SimpleGrid columns={2} my="8" rowGap={6}>
      <GridItem colSpan={2}>
        <VoterDetails
          label="Full Name"
          value={selectedVoterToView?.name ?? 'N/A'}
        />
      </GridItem>

      <GridItem colSpan={2}>
        <VoterDetails
          label="Email"
          value={selectedVoterToView?.email ?? 'N/A'}
        />
      </GridItem>

      <VoterDetails
        label="Phone Number"
        value={selectedVoterToView?.phoneNumber ?? 'N/A'}
      />

      <VoterDetails
        label="Ward"
        value={selectedVoterToView?.ward.name ?? 'N/A'}
      />

      <GridItem colSpan={2}>
        <VoterDetails
          label="Reason for Voting"
          value={selectedVoterToView?.reasonForVoting ?? 'N/A'}
        />
      </GridItem>

      <VoterDetails
        label="Voted Party"
        value={selectedVoterToView?.votedParty ?? 'N/A'}
      />
      <VoterDetails
        label="Election Type"
        value={
          selectedVoterToView?.electionType
            ? selectedVoterToView.electionType.type
            : 'N/A'
        }
      />

      <VoterDetails
        label="Status"
        value={selectedVoterToView?.status ?? 'N/A'}
      />
      <VoterDetails
        label="Called By"
        value={selectedVoterToView?.calledBy ?? 'N/A'}
      />

      <GridItem colSpan={2}>
        <VoterDetails
          label="Agent Comment"
          value={selectedVoterToView?.agentRemark ?? 'N/A'}
        />
      </GridItem>

      <VoterDetails
        label="Date Called"
        value={getDateValue(selectedVoterToView?.dateCalled)}
      />

      <VoterDetails
        label="Date Added"
        value={getDateValue(selectedVoterToView?.dateAdded)}
      />
    </SimpleGrid>
  );

  return (
    <Drawer
      isOpen={viewOpen}
      placement="right"
      onClose={onViewClose}
      onCloseComplete={() => {
        setSelectedVoter({ voter: null });
      }}
      size="sm"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Voter Details</DrawerHeader>
        <DrawerBody>{!!selectedVoterToView && voterDetails}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default ViewVoter;

import { DeleteIcon } from '@chakra-ui/icons';
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Text,
  VStack,
} from '@chakra-ui/react';
import { uploadFile } from 'api/cloudinary';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setUserImage } from 'store/reducers/auth-slice';
import { resetData } from 'store/reducers/upload-slice';
import { useUpdateUserProfileImageMutation } from 'store/reducers/users-api-slice';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

type Props = Omit<ModalProps, 'children'>;

function UploadProfileImage({ isOpen, onClose }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { error, status, uploadURL } = useAppSelector((s) => s.fileUpload);
  const dispatch = useAppDispatch();
  const [
    updateImage,
    { isLoading, isError, isSuccess, reset, error: updateError },
  ] = useUpdateUserProfileImageMutation();

  const fileUploadHandler = () => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast('Select a file', { type: 'warning' });
      return;
    }
    const files = Array.from(e.target.files);
    if (!files.length) {
      toast('Select a file', { type: 'warning' });
      return;
    }

    setSelectedFile(files[0]);
  };

  const submitHandler = () => {
    if (selectedFile) {
      dispatch(uploadFile(selectedFile));
    }
  };

  useEffect(() => {
    if (!error && status === 'idle' && uploadURL) {
      updateImage(uploadURL);
    }
  }, [error, status, updateImage, uploadURL]);

  useEffect(() => {
    if (isError && !isLoading && updateError && !isSuccess) {
      toast(getServerErrorMessage(updateError), { type: 'error' });
    }
  }, [isError, isLoading, isSuccess, updateError]);

  useEffect(() => {
    if (error && status === 'idle' && !uploadURL) {
      toast(error, { type: 'error' });
    }
  }, [error, status, uploadURL]);

  useEffect(() => {
    if (isSuccess && !isLoading && uploadURL) {
      dispatch(setUserImage(uploadURL));
    }
  }, [dispatch, isLoading, isSuccess, uploadURL]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={status !== 'pending' || isLoading}
      closeOnOverlayClick={status !== 'pending' || isLoading}
      onCloseComplete={() => {
        reset();
        dispatch(resetData());
        setSelectedFile(null);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Profile Image</ModalHeader>
        {status !== 'pending' && <ModalCloseButton />}
        <ModalBody pb="14">
          <VStack w="full" spacing="4">
            <input
              hidden
              type="file"
              accept="image/png, image/gif, image/jpeg"
              ref={inputRef}
              onChange={handleFileChange}
            />
            {!!selectedFile ? (
              <>
                <HStack w="full" justify="center">
                  <Text>{selectedFile.name}</Text>
                  <IconButton
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    aria-label="Remove file"
                    icon={<DeleteIcon />}
                    isDisabled={status === 'pending'}
                    isLoading={status === 'pending'}
                    onClick={() => setSelectedFile(() => null)}
                  />
                </HStack>
                <Button
                  size="lg"
                  isLoading={isLoading || status === 'pending'}
                  onClick={submitHandler}
                >
                  Upload Image
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={fileUploadHandler} colorScheme="blue">
                Attach File
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default UploadProfileImage;

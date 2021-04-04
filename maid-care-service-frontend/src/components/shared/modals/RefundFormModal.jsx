import { Button } from '@chakra-ui/button';
import Icon from '@chakra-ui/icon';
import { Image } from '@chakra-ui/image';
import { Box, Center, HStack, List, ListItem, Text, VStack } from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import { Form, Formik } from 'formik';
import { FaPhotoVideo, FaPlusCircle, FaRegImages, FaTimesCircle } from 'react-icons/fa';
import logo from '../../../assets/images/logo-text.png';
import UserStatus from '../../pages/jobs/components/UserStatus';
import { TextareaField, PhotosField } from '../FormikField';

const RefundModal = ({ job }) => {
  // const { maidId } = job;

  const handleSubmit = (values, actions) => {
    console.log(values);
  };

  return (
    <>
      <Modal isOpen isCentered size={'xl'} onClose={() => {}}>
        <ModalOverlay />
        <ModalContent px={12} pb={8} pt={16}>
          <ModalCloseButton />
          <ModalHeader as={Center}>
            <Text fontSize={`5xl`} fontWeight={`bold`}>
              Refund Form
            </Text>
          </ModalHeader>
          <Image position={`absolute`} src={logo} h={10} top={5} left={5} />

          <Formik onSubmit={handleSubmit}>
            <Form style={{ width: '100%' }}>
              <VStack position={`relative`} spacing={4}>
                <HStack alignSelf={`flex-start`}>
                  <UserStatus></UserStatus>
                </HStack>
                <TextareaField name="feedbackMessage" label={`Please give us your feed back`} />
                <PhotosField label={`Add Photo (maximum 8 photos)`} name="images">
                  {({ inputRef }) => {
                    return (
                      <List as={HStack}>
                        {[{ id: '1' }, { id: '2' }, { id: '3' }].map((image) => (
                          <ListItem key={image.id} position={`relative`} w={`fit-content`}>
                            {/* TODO: replace with Image */}
                            <Icon as={FaRegImages} w={24} h={24} />
                            <Icon
                              as={FaTimesCircle}
                              color={`red.400`}
                              w={6}
                              h={6}
                              position={`absolute`}
                              top={0}
                              right={-4}
                            />
                          </ListItem>
                        ))}
                        <ListItem p={6} onClick={() => inputRef.current.click()}>
                          <Icon as={FaPlusCircle} color={`green.400`} w={9} h={9} />
                          <Text color={`green.400`} fontSize={`lg`} fontWeight={`bold`} mt={2}>
                            Add
                          </Text>
                        </ListItem>
                      </List>
                    );
                  }}
                </PhotosField>
                <Button type="submit" colorScheme={`green`} alignSelf={`flex-end`}>
                  Submit
                </Button>
              </VStack>
            </Form>
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RefundModal;

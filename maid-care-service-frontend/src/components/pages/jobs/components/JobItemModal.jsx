import { ButtonGroup } from '@chakra-ui/button';

import Icon from '@chakra-ui/icon';
import {
  Box,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Modal, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/modal';
import { useToast } from '@chakra-ui/toast';

import { useEffect, useState } from 'react';
import { FaBroom, FaRing, FaTshirt } from 'react-icons/fa';
import { useStores } from '../../../../hooks/use-stores';
import Map from '../../../shared/Map';
import { ConfirmModal, DiscardJobModal } from '../../../shared/modals/modals';
import Address from './Address';
import { ConfirmContext, DiscardJobContext } from './context/ctx';
import Actions from './cta';
import Status from './Status';
import UserStatus from './UserStatus';
import { fetchWorkspaceById } from '../../../../api';
import { Spinner } from '@chakra-ui/spinner';
import { DISH_WASHING, HOUSE_CLEANING } from '../../../../constants/type-of-work';
import { GetRatingStar } from '../../../shared/RatingStar';
import { REVIEWED } from '../../../../constants/post-state';

const JobItemModal = ({ job, isOpen, onClose }) => {
  const { _id: jobId, work, workplaceId, customerId, state, rating, review } = job;
  const { jobStore } = useStores();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await fetchWorkspaceById(workplaceId);
        setWorkspace(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setWorkspace(null);
        setLoading(false);
      }
    })();
  }, [workplaceId]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDiscardJobModalOpen, setIsDiscardModalOpen] = useState(false);

  /** Maid confirm that job is done */
  const handleConfirm = () => {
    jobStore
      .done({ jobId })
      .then(() => {
        setIsConfirmModalOpen(false); // Close Confirm Modal
        toast({
          title: 'Successfully Confirmed!',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Something went wrong!',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      });
  };
  const handleDiscard = () => {
    jobStore
      .discard({ jobId })
      .then(() => {
        toast({
          title: 'Successfully Discarded!',
          status: 'success',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: 'Something went wrong!',
          status: 'error',
          isClosable: true,
          position: 'top',
          duration: 3000,
        });
      });
  };

  useEffect(
    () => () => {
      setIsDiscardModalOpen(false);
    },
    []
  );

  const isReviewed = state === REVIEWED;
  const numRow = isReviewed ? 7 : 4;

  return (
    <>
      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={`3xl`}
        scrollBehavior={`outside`}>
        <ModalOverlay />
        <ModalContent borderRadius={`xl`}>
          <ModalCloseButton zIndex={`tooltip`} />
          <Grid
            minH={`36rem`}
            overflow="auto"
            templateRows={`16rem repeat(${numRow}, minmax(3rem, 5rem))`}
            templateColumns={`repeat(8, 1fr)`}>
            <GridItem
              as={Box}
              rowSpan={1}
              colStart={1}
              colEnd={-1}
              bg={`green.300`}
              borderTopRadius={`xl`}
              overflow={`hidden`}
              zIndex={`toast`}>
              {loading ? (
                <Center>
                  <Spinner />
                </Center>
              ) : (
                workspace && <Map latitude={workspace.latitude} longitude={workspace.longitude} />
              )}
            </GridItem>
            <GridItem as={HStack} rowStart={2} rowSpan={1} colSpan={2} p={4}>
              <UserStatus uid={customerId} />
            </GridItem>
            <GridItem as={List} rowStart={3} rowSpan={2} colStart={0} colSpan={2} p={4}>
              {work &&
                work.map(({ quantity, unit, typeOfWork }, idx) => (
                  <ListItem as={HStack} key={jobId + typeOfWork + idx} mt="1vw">
                    <Icon
                      as={
                        typeOfWork === DISH_WASHING
                          ? FaRing
                          : typeOfWork === HOUSE_CLEANING
                          ? FaBroom
                          : FaTshirt
                      }
                      w={8}
                      h={8}
                      color={`gray.800`}
                    />
                    <Text>
                      {quantity} {unit}
                    </Text>
                  </ListItem>
                ))}
            </GridItem>
            <GridItem rowSpan={2} colStart={3} colEnd={7} p={4} alignItems={`baseline`}>
              <Address workplaceId={workplaceId} />
            </GridItem>
            <GridItem rowStart={4} rowSpan={2} colStart={3} colEnd={7} p={4}>
              <Heading as={`h6`} fontSize={`lg`} fontWeight={`bold`}>
                Note
              </Heading>
              {work &&
                work.map(({ typeOfWork, description }, idx) => (
                  <Text key={jobId + description + idx}>
                    {typeOfWork} - {description}
                  </Text>
                ))}
            </GridItem>
            <GridItem rowStart={2} rowSpan={3} colStart={7} colEnd={-1} p={4}>
              {/* Map State to What Component we want to Render Here! */}
              <Status job={job} />
            </GridItem>
            {isReviewed && (
              <>
                <GridItem rowStart={5} rowEnd={6} colStart={1} colEnd={-1} p={4} pb={0}>
                  <Heading fontSize={`lg`} fontWeight={`bold`}>
                    Review
                  </Heading>
                  <HStack>
                    <GetRatingStar rating={rating} />
                  </HStack>
                </GridItem>
                <GridItem
                  rowStart={6}
                  rowEnd={-2}
                  colStart={1}
                  colEnd={-1}
                  p={4}
                  pt={1}
                  overflow={`auto`}>
                  <Text h={`full`}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis aliquid
                    aspernatur aperiam necessitatibus ducimus earum tenetur accusantium labore
                    libero deleniti, ab provident quasi at voluptatum asperiores sint. Suscipit,
                    aliquid eos? Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse eveniet placeat
                    voluptate quasi sed culpa asperiores rem quia distinctio minima amet, expedita
                    itaque maxime. Ducimus hic quidem veritatis delectus suscipit nesciunt aliquam
                    necessitatibus a cupiditate, excepturi expedita natus consectetur! Ad sed. Lorem
                    ipsum dolor sit amet consectetur adipisicing elit. Recusandae hic sed est porro
                    accusamus! Ducimus nihil, excepturi laudantium porro ut sed quam sequi illum
                    unde atque dolores, veritatis tenetur modi veniam tempore quibusdam culpa
                    sapiente corrupti amet quisquam consectetur praesentium asperiores. Aperiam
                    cumque sunt assumenda! Eum laudantium amet, et magni dolorum nam non quis
                    expedita? Debitis necessitatibus neque, blanditiis, quia optio harum id dolores
                    sapiente culpa dolor facere. Incidunt laboriosam officia praesentium autem
                    officiis perferendis et cupiditate nesciunt ut accusamus? Expedita, corrupti
                    unde aliquam illum excepturi eius ipsa. Soluta, eos! Vel natus incidunt expedita
                    vero facilis nihil architecto corrupti aut perferendis fuga quasi neque deleniti
                    explicabo inventore laborum ducimus nam assumenda facere, odit consectetur
                    repellat nulla. Nobis, quo excepturi labore doloribus ab inventore numquam
                    possimus veniam commodi quam corporis nesciunt, saepe architecto iste cum autem
                    sint quis, tempora qui rerum omnis quibusdam cupiditate! Fugiat natus saepe quos
                    consectetur sint! Officia reiciendis asperiores earum, corrupti quae atque
                    voluptatem mollitia velit eligendi totam iusto esse alias voluptatibus soluta
                    repudiandae deserunt doloribus autem nostrum ipsa perferendis aperiam quos iure
                    itaque? Molestiae eveniet neque natus soluta illo, dolores magnam libero aliquam
                    quis nihil sit minima veniam error saepe laudantium reiciendis perspiciatis
                    voluptate ullam amet. Quo molestias magni exercitationem dignissimos facilis!
                    Soluta repudiandae, consectetur aut porro deserunt sit harum qui ullam est
                    aliquam unde ipsa? Consequatur aliquid doloremque architecto maiores ullam
                    tenetur omnis dolores. Quas iste rerum, commodi, eum nesciunt autem praesentium
                    eligendi illo doloribus eaque qui blanditiis corporis? Nostrum laudantium
                    eligendi quia libero culpa, consectetur aspernatur debitis accusantium itaque?
                    In vero labore reprehenderit ipsum quas, officia rerum delectus fugiat
                    temporibus dicta tenetur nisi dolorem deleniti impedit odit ipsam? Vel aperiam
                    doloremque aliquid at laborum! Autem mollitia recusandae amet architecto
                    voluptas esse nihil corporis excepturi, hic officiis dolor vero quibusdam, vel
                    quasi omnis eos distinctio.
                  </Text>
                </GridItem>
              </>
            )}
            <GridItem
              as={ButtonGroup}
              display={`flex`}
              justifyContent={`flex-end`}
              alignItems={`center`}
              rowStart={-1}
              colStart={1}
              colEnd={-1}
              p={4}>
              <ConfirmContext.Provider
                value={{
                  isConfirmModalOpen,
                  setIsConfirmModalOpen,
                }}>
                <DiscardJobContext.Provider
                  value={{
                    isDiscardJobModalOpen,
                    setIsDiscardModalOpen,
                  }}>
                  <Actions job={job} state={state} />
                </DiscardJobContext.Provider>
              </ConfirmContext.Provider>
            </GridItem>
          </Grid>
        </ModalContent>
      </Modal>

      <ConfirmModal
        job={job}
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
      />
      <DiscardJobModal
        job={job}
        isOpen={isDiscardJobModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onDiscard={handleDiscard}
      />
    </>
  );
};

export default JobItemModal;

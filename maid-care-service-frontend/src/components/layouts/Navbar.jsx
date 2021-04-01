import {
  Container,
  Flex,
  HStack,
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Link as RouterLink } from 'react-router-dom';
import React, { useRef } from 'react';
import logo from '../../assets/images/grab-white.png';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import { Button, IconButton } from '@chakra-ui/button';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/hooks';
import { useBreakpointValue } from '@chakra-ui/media-query';
import { Avatar } from '@chakra-ui/avatar';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/use-stores';
import { Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu';
import { useHistory } from 'react-router-dom';

const Navbar = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const isMobile = useBreakpointValue({ base: false, sm: true, md: true, lg: false });
  const history = useHistory();

  const { userStore } = useStores();

  const handleLogout = () => {
    userStore.logout();
    history.replace('/login');
  };

  const renderUser = () => {
    const isAuthenticated = userStore.isAuthenticated;
    const user = userStore.userData;

    return isAuthenticated && user ? (
      <>
        <Menu>
          <MenuButton>
            <HStack>
              <Avatar size="sm" name={`${user.firstname}`} />
              <Text fontSize="lg" fontWeight="bold">
                {`${user.firstname}`}
              </Text>
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem onClick={() => history.push('/profile')}>My Account</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </MenuList>
        </Menu>
      </>
    ) : (
      <>
        <Link as={RouterLink} to="/register">
          <Button colorScheme="teal">Sign up</Button>
        </Link>
        <Link as={RouterLink} to="/login">
          <Button variant="ghost">Log in</Button>
        </Link>
      </>
    );
  };

  const renderLinks = () => {
    const isAuthenticated = userStore.isAuthenticated;
    const user = userStore.userData;

    let links = [{ name: 'Home', to: '/' }];

    if (isAuthenticated && user) {
      switch (user.role) {
        case 'customer':
          links = [...links, { name: 'Post', to: '/post/create' }];
          break;
        case 'maid':
          links = [...links, { name: 'Works', to: '/jobs' }];
          break;
        case 'admin':
          links = [...links, { name: 'Promotion', to: '/promotion' }];
          break;
        default:
          links = [{ name: 'Home', to: '/' }];
      }
    }

    return links.map(route => (
      <Link key={route.name} as={RouterLink} to={route.to} mr={2}>
        <Text fontSize="lg" fontWeight="bold">
          {route.name}
        </Text>
      </Link>
    ));
  };

  const renderDrawer = () => {
    return (
      <>
        <IconButton
          size="lg"
          bgColor="brandGreen"
          color="white"
          icon={<HamburgerIcon boxSize="1.5em" />}
          aria-label="drawer"
          variant="ghost"
          ref={btnRef}
          mx={2}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <HStack>{renderUser()}</HStack>
              </DrawerHeader>
              <DrawerBody>
                <VStack alignItems="flex-start">{renderLinks()}</VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </>
    );
  };

  return (
    <Flex
      position="sticky"
      w="100%"
      bgColor="brandGreen"
      direction="row"
      alignItems="center"
      px={4}
      py={2}
      zIndex="sticky">
      {isMobile && renderDrawer()}
      <Link as={RouterLink} to="/">
        <Container w={[100, 120]} p={0}>
          <img src={logo} alt="GrabMaid Logo" />
        </Container>
      </Link>
      <Stack direction="row" ml="auto" alignItems="center" my={2}>
        {!isMobile && renderLinks()}
        <Stack direction="row" alignItems="center" pl={4}>
          {renderUser()}
        </Stack>
      </Stack>
    </Flex>
  );
});

export default Navbar;

import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    useColorMode,
    Spacer,
    Image,
  } from '@chakra-ui/react';
  import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    MoonIcon, 
    SunIcon 
  } from '@chakra-ui/icons';

  
  export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();
  
    return (
      <Box>
        <Flex
        //   bg={useColorModeValue('white', 'gray.800')}
        //   color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          align={'center'}>
            
            {/* <Button onClick={toggleColorMode} marginLeft={'1rem'}
            display={{ base: 'none', md: 'flex' }}>
                {colorMode === 'dark' ? <MoonIcon /> : <SunIcon />}
            </Button> */}

            <Image src="../images/Logo.svg" width={'10rem'}  marginLeft={'2rem'}/>
            
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
              
            />
            
          </Flex>
          
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'end' }}>
            
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
  
          
        </Flex>
              
        <Collapse in={isOpen} animateOpacity>
          <MobileNav />
        </Collapse>
      </Box>
    );
  }
  
  const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    // const popoverContentBgColor = useColorModeValue('white', 'gray.800');
    const { isOpen, onToggle } = useDisclosure();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
      <Stack direction={'row'} spacing={4}>
        
        {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                
                <Link
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize={'md'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}
                  marginRight={'1rem'}
                  >
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                //   bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  {/* <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack> */}
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))}
      </Stack>
    );
  };
  
  // const DesktopSubNav = ({ label, href }: NavItem) => {
  //   return (
  //     <Link
  //       href={href}
  //       role={'group'}
  //       display={'block'}
  //       p={2}
  //       rounded={'md'}
  //       _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
  //       <Stack direction={'row'} align={'center'}>
  //         <Box>
  //           <Text
  //             transition={'all .3s ease'}
  //             _groupHover={{ color: 'pink.400' }}
  //             fontWeight={500}>
  //             {label}
  //           </Text>
  //         </Box>
  //         <Flex
  //           transition={'all .3s ease'}
  //           transform={'translateX(-10px)'}
  //           opacity={0}
  //           _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
  //           justify={'flex-end'}
  //           align={'center'}
  //           flex={1}>
  //           <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
  //         </Flex>
  //       </Stack>
  //     </Link>
  //   );
  // };
  
  const MobileNav = () => {
    return (
      <Stack
        // bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem key={navItem.label} {...navItem} />
        ))}
      </Stack>
    );
  };
  
  const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={Link}
          href={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            // color={useColorModeValue('gray.600', 'gray.200')}
            >
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            // borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'end'}>
            {children &&
              children.map((child) => (
                <Link key={child.label} py={2} href={child.href}>
                  {child.label}
                </Link>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  
  interface NavItem {
    label: string;
    children?: Array<NavItem>;
    href?: string;
  }
  
  const NAV_ITEMS: Array<NavItem> = [
    {
      label: 'home',
      href: '/',
    },
    {
      label: 'work',
      href: '/work',
    }
  ];
  
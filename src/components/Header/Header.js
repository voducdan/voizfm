// Import react module
import { useEffect, useState, useCallback } from 'react';

// import universal cookie
import Cookies from 'universal-cookie';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// Import redux reducer, actions
import { setOpen, selectOpenSidebar } from '../../redux/openSidebar';
import { handleOpenLogin } from '../../redux/openLogin';
import { setAnchorEl, handleStartSearch, handleStopSearch, setPlaylistResult } from '../../redux/OpenSearch';
import { selectCart, selectAddToCartFlag, setAddToCartFlag } from '../../redux/payment';
import { setUser, selectUser } from '../../redux/user';
import { selectToken, removeToken } from '../../redux/token';

// import next router
import { useRouter, withRouter } from 'next/router';

// Import MUI component
import { styled } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import {
    IconButton,
    Toolbar,
    SvgIcon,
    Input,
    InputAdornment,
    FormControl,
    Avatar,
    Box,
    Badge,
    Tooltip,
    Popover,
    Button,
    Typography,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';

// Import utils
import { TEXT_STYLE, COLORS, DRAWER_WIDTH, HEADER_HEIGHT, SCREEN_BREAKPOINTS, HEADER_HEIGHT_MB } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// Import icons
import { Bookmark, Cart } from '../Icons/index';

// import lodash
import _debounce from 'lodash/debounce';

// import service
import API from '../../services/api';
import { flexStyle } from '../../utils/flexStyle';
import { getAudioListenings, removeAudioListenings } from '../../services/audioListenning';

const SearchBtn = (idx) => {
    return (
        <IconButton
            aria-label="search"
            key={idx}
            sx={{
                p: 0
            }}
        >
            <SearchIcon sx={{ color: COLORS.contentIcon }} />
        </IconButton>
    )
}
const ClearBtn = () => {
    return (
        <IconButton aria-label="clear-search">
            <ClearIcon sx={{ color: COLORS.white }} />
        </IconButton>
    )
}

const BookmarkIcon = (props) => {
    return (
        <SvgIcon key={props.idx}>
            {Bookmark()}
        </SvgIcon>
    )
}

const CartIcon = (props) => {
    const { handleClickCartIcon, numItemsInCart, idx, addToCartFlag } = props;
    return (
        <Box
            onClick={handleClickCartIcon}
            key={idx}
            sx={{
                cursor: 'pointer'
            }}
        >
            <Tooltip open={Boolean(addToCartFlag)} title="Thêm vào giỏ hàng thành công!">
                <Badge badgeContent={numItemsInCart || 0} color="error">
                    <Cart />
                </Badge>
            </Tooltip>
        </Box>
    )
}

const userAvt = (props) => {
    const { avtSrc, idx, onOpenLogin, handleCloseSidebarWhenClickAccountIcon } = props;
    if (avtSrc) {
        return (
            <Button
                onClick={handleCloseSidebarWhenClickAccountIcon}
                key={idx}
                sx={{
                    textDecoration: 'none',
                    cursor: 'pointer'
                }}
            >
                <Avatar alt="Remy Sharp" src={avtSrc} sx={{ width: 40, height: 40 }} />
            </Button>
        )
    }
    return (
        <AccountCircleIcon sx={{ width: 40, height: 40, cursor: 'pointer' }} onClick={() => { onOpenLogin() }} key={idx} />
    )
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ windowwidth, open }) => ({
    height: windowwidth > SCREEN_BREAKPOINTS.sm ? HEADER_HEIGHT : HEADER_HEIGHT_MB,
    backgroundColor: COLORS.bg1,
    justifyContent: 'center',
    ...(windowwidth > SCREEN_BREAKPOINTS.sm && {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: `${DRAWER_WIDTH}px`,
    }),
    ...(windowwidth <= SCREEN_BREAKPOINTS.sm && { width: '100%' }),
    ...(!open && { width: '100%' }),

}));


function Header({ router }) {
    const api = new API();
    const cookies = new Cookies();
    const windowSize = useWindowSize();
    const pathname = router.pathname;
    const search = router.search;
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const navigate = useRouter();
    const openSidebar = useSelector(selectOpenSidebar);
    const cart = useSelector(selectCart);
    const token = useSelector(selectToken);
    const addToCartFlag = useSelector(selectAddToCartFlag);
    const user = useSelector(selectUser);
    const [avtSrc, setAvtSrc] = useState(null);
    const [numItemsInCart, setNumItemsInCart] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchOnMb, setSearchOnMb] = useState(false);
    const [searchOnPC, setSearchOnPC] = useState(false);
    const [showHeaderItems, setShowHeaderItems] = useState(true);
    const [userPaneAnchorEl, setUserPaneAnchorEl] = useState(null);

    const openUserPane = Boolean(userPaneAnchorEl);
    const audioListenings = getAudioListenings();

    const headerItems = [BookmarkIcon, CartIcon, userAvt];

    const dispatch = useDispatch();


    useEffect(() => {
        if (token) {
            fetchNumItemsInCart();
        }
    }, []);

    useEffect(() => {
        if (user) {
            setAvtSrc(user.avatar.thumb_url)
        }
    }, [user]);

    useEffect(() => {
        if (token && !user) {
            fetchUserInfo();
            return;
        }
        setAvtSrc(null);
        dispatch(setUser(null));

    }, [token]);

    useEffect(() => {
        setSearchStatus();
    }, [isSm]);

    useEffect(() => {
        if (token) {
            fetchNumItemsInCart();
        }
    }, [cart]);

    useEffect(() => {
        if (addToCartFlag === 1) {
            setTimeout(() => {
                dispatch(setAddToCartFlag(0));
            }, 1000)
        }
    }, [addToCartFlag]);

    useEffect(() => {
        setShowHeaderItems(true);
        setSearchStatus();
    }, [pathname, search]);

    const handleCloseUserPane = () => {
        setUserPaneAnchorEl(null);
    };

    const fetchNumItemsInCart = async () => {
        try {
            const res = await api.getNumItemsInCart();
            const data = await res.data.data;
            if (!data.error) {
                setNumItemsInCart(data.badge);
            }
        }
        catch (err) {
            setNumItemsInCart(0)
        }
    };

    function setSearchStatus() {
        if (isSm) {
            setSearchOnMb(true);
            setSearchOnPC(false);
        }
        else {
            setSearchOnMb(false);
            setSearchOnPC(true)
        }
    }

    const fetchUserInfo = async () => {
        const res = await api.getUserInfo();
        const data = await res.data.data;
        if (data.error) {
            return;
        }
        setAvtSrc(data?.avatar?.thumb_url);
        dispatch(setUser(data));
    }

    const onOpenLogin = (e) => {
        dispatch(handleOpenLogin());
    }

    const onOpenSearch = (e) => {
        const anchor = e.currentTarget;
        const anchorId = anchor.id;
        dispatch(setAnchorEl(anchorId));
    }

    const onSearchInput = (e) => {
        const { value } = e.target;
        setSearchKeyword(value);
        if (!value.trim()) {
            dispatch(handleStopSearch());
        }
        else {
            debounceOnSearch('playlists', value);
            dispatch(handleStartSearch());
        }
    }

    const handleSearchKeyUp = (e) => {
        const { keyCode } = e;
        const trimedSearchKey = searchKeyword.trim();
        if (keyCode === 13) {
            if (!trimedSearchKey) {
                return;
            }
            setShowHeaderItems(true);
            setSearchStatus();
            e.target.blur();
            navigate.push({
                pathname: '/search',
                query: { searchKey: trimedSearchKey }
            });
        }
    }

    const handleClickSearchBtn = () => {
        const trimedSearchKey = searchKeyword.trim();
        if (!trimedSearchKey) {
            return;
        }
        setShowHeaderItems(true);
        setSearchStatus();

        navigate.push({
            pathname: '/search',
            query: { searchKey: trimedSearchKey }
        });
    }

    const handleClearSearchKeyword = () => {
        setSearchKeyword('');
        dispatch(handleStopSearch());
        dispatch(setAnchorEl('input-search'));
    }

    const handleSearchOnMB = () => {
        setShowHeaderItems(false);
        setSearchOnPC(true);
        setSearchOnMb(false);
        setTimeout(() => {
            const el = document.getElementById('input-search');
            el.focus();
        })
    }

    const handleDrawerToggle = () => {
        dispatch(setOpen(!openSidebar));
    };

    const showToogleIcon = (open) => {
        if (open && !isSm) {
            return false;
        }
        else if (open && isSm) {
            return true;
        }
        else if (!open) {
            return true;
        }
    }

    const debounceOnSearch = useCallback(_debounce(async (type, keyword) => {
        const res = await api.getSearchResults(type, keyword);
        const data = await res.data.data;

        dispatch(setPlaylistResult(data));
    }, 100), []);

    const handleCloseSidebarWhenClickAccountIcon = (e) => {
        dispatch(setOpen(false));
        setUserPaneAnchorEl(e.currentTarget);
    };

    const handleClickCartIcon = () => {
        if (!user) {
            dispatch(handleOpenLogin());
            return;
        }
        router.push('/cart')
    }

    const handleGoToAccountPage = () => {
        setUserPaneAnchorEl(null);
        router.push('/account');
    }

    const handleLogout = async () => {
        try {
            if (user) {
                await api.trackingAudio(audioListenings);
                cookies.remove('token');
                dispatch(removeToken());
                removeAudioListenings();
            }
            setUserPaneAnchorEl(null);
            window.location.href = '/';
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 'none',
                border: `1px solid ${COLORS.blackStroker}`
            }}
            open={openSidebar}
            windowwidth={windowSize.width}>
            <Popover
                open={openUserPane}
                anchorEl={userPaneAnchorEl}
                onClose={handleCloseUserPane}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPopover-paper': {
                        bgcolor: COLORS.bg2
                    }
                }}
            >
                <Box
                    sx={{
                        bgcolor: COLORS.bg2,
                        p: '25px 25px 16px 25px',
                        borderRadius: '6px'
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'flex-start'),
                            columnGap: '15px',
                            mb: '25px',
                            borderTop: `1px solid ${COLORS.bg3}`,
                            borderRadius: '6px',
                            width: '360px',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Box>
                            <Avatar alt="user avatar" src={avtSrc} sx={{ width: 60, height: 60 }} />
                        </Box>
                        <Box
                            sx={{
                                height: '60px',
                                ...flexStyle('center', 'flex-start'),
                                flexDirection: 'column'
                            }}
                        >
                            <Typography
                                sx={{
                                    color: COLORS.white,
                                    ...TEXT_STYLE.title1
                                }}
                            >{`${user?.first_name} ${user?.last_name}`}</Typography>
                            <Typography
                                onClick={handleGoToAccountPage}
                                sx={{
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.contentIcon,
                                    cursor: 'pointer'
                                }}
                            >Xem trang cá nhân của bạn</Typography>
                        </Box>
                    </Box>
                    <Divider
                        sx={{
                            bgcolor: COLORS.bg3,
                            margin: '0 25px'
                        }}
                    />
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '15px',
                            pt: '15px'
                        }}
                    >
                        <Box>
                            <LogoutIcon
                                sx={{
                                    width: '32px',
                                    height: '32px',
                                    bgcolor: COLORS.bg3,
                                    borderRadius: '50%',
                                    p: '8px',
                                    boxSizing: 'border-box',
                                    color: COLORS.white
                                }} />
                        </Box>
                        <Typography
                            onClick={handleLogout}
                            sx={{
                                color: COLORS.white,
                                ...TEXT_STYLE.content2,
                                cursor: 'pointer'
                            }}
                        >Đăng xuất</Typography>
                    </Box>
                </Box>
            </Popover>
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{ mr: 2, ...(!showToogleIcon(openSidebar) && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        ...(isSm && { justifyContent: 'flex-end' })
                    }}>
                    <FormControl variant="standard" sx={{
                        width: isSm ? '100%' : '60%',
                        ...(!isSm && { borderRight: `1px solid ${COLORS.blackStroker}` })
                    }}>
                        {searchOnPC && <Input
                            onFocus={onOpenSearch}
                            onChange={onSearchInput}
                            onKeyUp={handleSearchKeyUp}
                            id="input-search"
                            placeholder="Tìm kiếm"
                            autoComplete="off"
                            value={searchKeyword}
                            sx={{
                                color: COLORS.white,
                                ...TEXT_STYLE.content1
                            }}
                            disableUnderline
                            startAdornment={
                                <InputAdornment
                                    position="start"
                                    onClick={handleClickSearchBtn}
                                >
                                    {<SearchBtn />}
                                </InputAdornment>
                            }
                            endAdornment={
                                (searchKeyword !== '') && (
                                    <InputAdornment position="end" onClick={handleClearSearchKeyword} >
                                        {< ClearBtn />}
                                    </InputAdornment>
                                )}
                        />}
                        {searchOnMb && (
                            <Box
                                onClick={handleSearchOnMB}
                                sx={{ mr: '41px' }}
                            >
                                {<SearchBtn />}
                            </Box>)
                        }
                    </FormControl>
                    {
                        showHeaderItems && (
                            <Box
                                sx={{
                                    width: '30%',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    marginRight: '13px',
                                    columnGap: '35px',
                                    ...(isSm && { marginRight: '6px' })
                                }}
                            >
                                {headerItems.map((item, idx) => (
                                    item(
                                        {
                                            numItemsInCart,
                                            idx,
                                            avtSrc,
                                            addToCartFlag,
                                            onOpenLogin,
                                            handleCloseSidebarWhenClickAccountIcon,
                                            handleClickCartIcon
                                        }
                                    )
                                ))}
                            </Box>
                        )
                    }
                </Box>

            </Toolbar >
        </AppBar >
    )
}

export default withRouter(Header)
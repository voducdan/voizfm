// Import react module
import { useEffect, useState, useCallback } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// Import redux reducer, actions
import { setOpen, selectOpenSidebar } from '../../redux/openSidebar';
import { handleOpenLogin } from '../../redux/openLogin';
import { setAnchorEl, handleStartSearch, handleStopSearch, setPlaylistResult } from '../../redux/OpenSearch';
import { selectCart, setCart, selectAddToCartFlag, setAddToCartFlag } from '../../redux/payment';
import { setUser } from '../../redux/user';
import { selectToken } from '../../redux/token';

// import next router
import { useRouter, withRouter } from 'next/router';

// import next link
import Link from 'next/link';

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
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

// Import utils
import { COLORS, DRAWER_WIDTH, HEADER_HEIGHT, SCREEN_BREAKPOINTS, HEADER_HEIGHT_MB } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// Import icons
import { Bookmark, Cart } from '../Icons/index';

// import lodash
import _debounce from 'lodash/debounce';

// import service
import API from '../../services/api';

const SearchBtn = (idx) => {
    return (
        <IconButton aria-label="search" key={idx}>
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
    const { handleCloseSidebarWhenClickAccountIcon, numItemsInCart, idx, addToCartFlag } = props;
    return (
        <Link
            onClick={handleCloseSidebarWhenClickAccountIcon}
            href={`/cart`}
            key={idx}
        >
            <Tooltip open={Boolean(addToCartFlag)} title="Thêm vào giỏ hàng thành công!">
                <Badge badgeContent={numItemsInCart || 0} color="error">
                    <ShoppingCartOutlinedIcon sx={{ color: COLORS.contentIcon }} />
                </Badge>
            </Tooltip>
        </Link>
    )
}

const userAvt = (props) => {
    const { avtSrc, idx, onOpenLogin, handleCloseSidebarWhenClickAccountIcon } = props;
    if (avtSrc) {
        return (
            <Link
                onClick={handleCloseSidebarWhenClickAccountIcon}
                href="/account"
                key={idx}
                style={{ textDecoration: 'none' }}
            >
                <Avatar alt="Remy Sharp" src={avtSrc} sx={{ width: 40, height: 40 }} />
            </Link>
        )
    }
    return (
        <AccountCircleIcon sx={{ width: 40, height: 40 }} onClick={() => { onOpenLogin() }} key={idx} />
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
    const windowSize = useWindowSize();
    const pathname = router.pathname;
    const search = router.search;
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const navigate = useRouter();
    const openSidebar = useSelector(selectOpenSidebar);
    const cart = useSelector(selectCart);
    const token = useSelector(selectToken);
    const addToCartFlag = useSelector(selectAddToCartFlag);
    const [avtSrc, setAvtSrc] = useState(null);
    const [numItemsInCart, setNumItemsInCart] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchOnMb, setSearchOnMb] = useState(false);
    const [searchOnPC, setSearchOnPC] = useState(false);
    const [showHeaderItems, setShowHeaderItems] = useState(true);
    const headerItems = [BookmarkIcon, CartIcon, userAvt];

    const dispatch = useDispatch();


    useEffect(() => {
        fetchNumItemsInCart();
    }, []);

    useEffect(() => {
        fetchUserInfo();
    }, [token]);

    useEffect(() => {
        setSearchStatus();
    }, [isSm]);

    useEffect(() => {
        fetchNumItemsInCart();
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

    const fetchNumItemsInCart = async () => {
        const res = await api.getNumItemsInCart();
        const data = await res.data.data;
        setNumItemsInCart(data.badge);
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
        if (value === '') {
            dispatch(handleStopSearch());
        }
        else {
            debounceOnSearch('playlists', value);
            dispatch(handleStartSearch());
        }
    }

    const handleSearchKeyUp = (e) => {
        const { keyCode } = e;
        if (keyCode === 13) {
            setShowHeaderItems(true);
            setSearchStatus();
            navigate.push({
                pathname: '/search',
                query: { searchKey: searchKeyword }
            });
        }
    }

    const handleClickSearchBtn = () => {
        setShowHeaderItems(true);
        setSearchStatus();
        navigate.push({
            pathname: '/search',
            query: { searchKey: searchKeyword }
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
    }, 300), []);

    const handleCloseSidebarWhenClickAccountIcon = () => {
        dispatch(setOpen(false));
    }

    return (
        <AppBar position="fixed" open={openSidebar} windowwidth={windowSize.width}>
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
                            value={searchKeyword}
                            sx={{ color: COLORS.placeHolder }}
                            disableUnderline
                            startAdornment={
                                <InputAdornment position="start" onClick={handleClickSearchBtn}>
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
                                    item({ numItemsInCart, idx, avtSrc, addToCartFlag, onOpenLogin, handleCloseSidebarWhenClickAccountIcon })
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
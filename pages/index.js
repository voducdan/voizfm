import { useEffect, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { setOpen, selectOpenSidebar } from '../src/redux/openSidebar';
import { selectAnchorEl, handleCloseSearch } from '../src/redux/OpenSearch';

import { useRouter } from 'next/router';

import { Provider } from 'react-redux';

import Box from '@mui/material/Box';
import SidebarMenu from '../src/components/SidebarMenu/SidebarMenu';
import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';
import Login from '../src/components/Login/Login';
import PlayBar from '../src/components/PlayBar/PlayBar';
import SearchModal from '../src/components/Search/SearchModal';
import Home from '../src/pages/Home/Home';

import store from '../src/redux/store';

import useWindowSize from '../src/utils/useWindowSize'
import { SCREEN_BREAKPOINTS, HEADER_HEIGHT, HEADER_HEIGHT_MB, DRAWER_WIDTH, EXCLUDE_FOOTER } from '../src/utils/constants'



function App() {

  const location = useRouter();
  const [includeFooter, setIncludeFooter] = useState(null);

  let windowSize = useWindowSize();
  const isSm = windowSize.width > SCREEN_BREAKPOINTS.sm ? false : true;
  const openSidebar = useSelector(selectOpenSidebar);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorSearchElId = useSelector(selectAnchorEl);
  const openSearchModal = Boolean(anchorEl);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isSm && !openSidebar) {
      dispatch(setOpen(true))
    }
  }, [isSm, openSidebar]);

  useEffect(() => {
    function checkIncludeFooter() {
      if (EXCLUDE_FOOTER.some(e => e.test(location.pathname))) {
        setIncludeFooter(false);
      } else {
        setIncludeFooter(true);
      }
    }
    checkIncludeFooter();
    dispatch(handleCloseSearch());

  }, [location])

  useEffect(() => {
    getSearchAnchorEl();
  }, [anchorSearchElId]);

  const openPlayBar = () => {
    const playAudioPathRegex = new RegExp('^/audio-play/[0-9]+$');
    if (playAudioPathRegex.test(location.pathname)) {
      if (!isSm) {
        return true
      }
      if (!openSidebar) {
        return true
      }
    }
    return false
  };

  const getSearchAnchorEl = () => {
    const el = document.getElementById(anchorSearchElId);
    setAnchorEl(el);
  }

  return (
    <div className='App'>
      <Login />
      <Header />
      {
        openSearchModal && (
          <SearchModal />
        )
      }
      <SidebarMenu />
      <Box sx={{
        flexGrow: 1,
        height: `calc(100% - ${HEADER_HEIGHT})`,
        marginTop: !isSm ? HEADER_HEIGHT : HEADER_HEIGHT_MB,
        width: openSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ...((openSidebar && !isSm) && { marginLeft: `${DRAWER_WIDTH}px` }),
      }}>
        <Home />
      </Box>
      {
        openPlayBar() && (
          <PlayBar />
        )
      }
      {includeFooter && <Footer />}
    </div >
  )
}
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);

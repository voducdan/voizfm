// import react
import { useEffect, useState } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';
import { selectPlayAudio } from '../../redux/playAudio';
import { selectOpenSidebar } from '../../redux/openSidebar';
import { setOpenAudioDetail, setOpenExpandMoreAudio } from '../../redux/playAudio';

// import MUI components
import {
    Box,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';

// import others components
import InfoLabel from '../../components/Shared/InfoLabel';
import ShareModal from '../../components/Shared/ShareModal';

// import icons
import { Share } from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE, DRAWER_WIDTH, HEADER_HEIGHT, HEADER_HEIGHT_MB } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import convertSecondsToReadableString from '../../utils/convertSecondsToReadableString';

export default function AudioPlay({ audioFromApi }) {
    const playing = useSelector(selectPlayAudio);
    const openSidebar = useSelector(selectOpenSidebar);

    const [id, setId] = useState(null);
    const [url, setUrl] = useState(null);
    const [audio, setAudio] = useState({});
    const [openShareModal, setOpenShareModal] = useState(false);

    const dispatch = useDispatch();

    const windowSize = useWindowSize()
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    useEffect(() => {
        if (audioFromApi) {
            setAudio(audioFromApi);
        }
    }, [audioFromApi]);

    useEffect(() => {
        if (id) {
            setUrl(`${window.location.href}?audioId=${id}`);
        }
    }, [id]);

    useEffect(() => {
        if (audio) {
            const { id } = audio;
            setId(id);
        }
    }, [audio]);

    const handleOpenShareModal = () => {
        setOpenShareModal(true);
    }

    const handleExpandLessAudioPlay = () => {
        dispatch(setOpenAudioDetail(false));
        dispatch(setOpenExpandMoreAudio(true));
    }

    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                flexDirection: 'column',
                bgcolor:COLORS.bg1,
                zIndex:99,
                position: 'fixed',
                width: openSidebar ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
                height: `calc(100vh - ${isSm ? HEADER_HEIGHT_MB : HEADER_HEIGHT} - ${isSm ? '299px' : '100px'})`,
                top: 0,
                overflowY: isSm ? 'scroll' : 'hidden',
                boxSizing: 'border-box',
                p: isSm ? '24px 36px' : '24px 48px',
                margin: `${isSm ? HEADER_HEIGHT_MB : HEADER_HEIGHT} auto ${isSm ? 'auto' : '100px'} auto`,
                ...((openSidebar && !isSm) && { marginLeft: `${DRAWER_WIDTH}px` }),
                scrollbarGutter: 'stable',
                '::-webkit-scrollbar': {
                    width: '4px'
                },

                '::-webkit-scrollbar-button': {
                    height: '10px'
                },

                '::-webkit-scrollbar-track': {
                    borderRadius: '5px',
                },

                '::-webkit-scrollbar-thumb': {
                    background: COLORS.bg3,
                    borderRadius: '5px'
                },

                ':hover': {
                    overflowY: 'auto'
                },
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: "url('/images/audioplaybg.png')",
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    opacity: 0.4,
                    zIndex: 1
                }
            }}
        >
            <Box
                sx={{
                    ...flexStyle('flex-end', 'center'),
                    columnGap: '36px',
                    width: '100%',
                    boxSizing: 'border-box',
                    pb: isSm ? '60px' : '76px',
                    zIndex: 2
                }}
            >
                <Box
                    sx={{
                        cursor: 'pointer'
                    }}
                    onClick={handleOpenShareModal}
                >
                    <Share bgfill='none' fill='none' stroke={COLORS.contentIcon} />
                </Box>
                <ShareModal url={url} isSm={isSm} open={openShareModal} setOpen={setOpenShareModal}></ShareModal>
                <ExpandMoreIcon
                    onClick={handleExpandLessAudioPlay}
                    sx=
                    {{
                        color: COLORS.contentIcon,
                        cursor: 'pointer'
                    }}
                />
            </Box>
            <Box
                sx={{
                    ...(isSm ? flexStyle('center', 'center') : flexStyle('center', 'flex-start')),
                    ...(isSm && { flexDirection: 'column', rowGap: '32px' }),
                    width: '100%',
                    ...(!isSm && {
                        height: 'calc(100% - 106px)'
                    }),
                    boxSizing: 'border-box',
                    columnGap: '75px',
                }}
            >
                <Box
                    sx={{
                        width: isSm ? '70%' : '45%',
                        height: '100%',
                        ...(isSm ? flexStyle('center', 'flex-start') : flexStyle('flex-end', 'flex-start'))
                    }}
                >
                    <img
                        style={{
                            width: '100%',
                            height: '100%',
                            maxWidth: isSm ? '224px' : '320px',
                            maxHeight: isSm ? '224px' : '320px',
                            borderRadius: '15px',
                            'img': {
                                objectFit: 'fill'
                            }
                        }}
                        // variant="rounded"
                        alt="playlist avt"
                        src={audio?.avatar?.original_url || audio?.playlist?.avatar?.original_url} />
                </Box>
                <Box
                    sx={{
                        width: isSm ? '100%' : '55%'
                    }}
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white,
                            marginBottom: '25px',
                            ...(isSm && { textAlign: 'center' })
                        }}
                    >
                        {audio?.name}
                    </Typography>
                    <TableContainer
                        sx={{
                            width: '100%',
                            bgcolor: 'transparent',
                            boxShadow: 'none'
                        }}
                        component={Paper}>
                        <Table
                            aria-label="playlist info tbl">
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        sx={{
                                            width: isSm ? '50%' : '25%',
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0'
                                        }}
                                        component="th" scope="row"
                                    >
                                        <InfoLabel title='Tác giả' />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0',
                                            textAlign: 'left'
                                        }}
                                        align="right"
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content2,
                                                color: COLORS.VZ_Text_content
                                            }}
                                        >{audio?.author?.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        sx={{
                                            width: isSm ? '50%' : '25%',
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0'
                                        }}
                                        component="th" scope="row"
                                    >
                                        <InfoLabel title='Thời lượng' />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0',
                                            textAlign: 'left'
                                        }}
                                        align="right"
                                    >
                                        <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.VZ_Text_content }}>{convertSecondsToReadableString(audio?.playlist?.total_duration)}</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        sx={{
                                            width: isSm ? '50%' : '25%',
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0'
                                        }}
                                        component="th" scope="row"
                                    >
                                        <InfoLabel title='Kênh' />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0',
                                            textAlign: 'left'
                                        }}
                                        align="right"
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content2,
                                                color: COLORS.VZ_Text_content
                                            }}
                                        >{audio?.playlist?.channel?.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell
                                        sx={{
                                            width: isSm ? '50%' : '25%',
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0'
                                        }}
                                        component="th" scope="row"
                                    >
                                        <InfoLabel title='Người đọc' />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            borderBottom: 'none',
                                            padding: '0 0 21px 0',
                                            textAlign: 'left'
                                        }}
                                        align="right"
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content2,
                                                color: COLORS.VZ_Text_content
                                            }}
                                        >{audio?.playlist?.voicers[0]?.name}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            width: '280px',
                            height: '48px',
                            border: `1px solid ${COLORS.blackStroker}`,
                            borderRadius: '6px',
                            marginTop: '40px',
                            cursor: 'text',
                            ...((!playing || isSm) && {
                                display: 'none'
                            })
                        }}
                        variant="outlined"
                        endIcon={<GraphicEqIcon />}
                    >
                        Đang phát
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
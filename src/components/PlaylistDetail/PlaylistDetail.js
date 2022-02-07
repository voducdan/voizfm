// import react
import { useState, useEffect } from 'react';

// import next link
import Link from 'next/link';

// import next router
import { useRouter } from 'next/router';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import reducer, actions
import { setCart, selectCart, setAddToCartFlag } from '../../redux/payment';
import { selectUser } from '../../redux/user';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

import ShowMoreText from "react-show-more-text";

// import MUI components
import {
    Box,
    Avatar,
    Typography,
    Button,
    Rating,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow,
    TableCell,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Tooltip,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Snackbar,
    Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

// import icons
import { Share, Play } from '../../components/Icons/index';


// import other components
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import { RateModal, AfterRateModal } from './RateModal';
import ShareModal from '../../components/Shared/ShareModal';
import InfoLabel from '../../components/Shared/InfoLabel';
import InfoValue from '../../components/Shared/InfoValue';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import convertSecondsToReadableString from '../../utils/convertSecondsToReadableString';
import FormatPrice from '../../utils/formatPrice';
import formatDuration from '../../utils/formatDuration';

// import service
import API from '../../services/api';

const ShowTextBtn = (content) => (
    <Button
        endIcon={content === 'Xem thêm' ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        sx={{
            color: COLORS.second,
            ...TEXT_STYLE.VZ_Caption_2,
            textTransform: 'none',
            ...flexStyle('center', 'center'),
            width: '100%'
        }}
    >
        {content}
    </Button>
)

SwiperCore.use([Navigation]);

export default function PlatlistDetail({ playlistFromAPI }) {
    const api = new API();

    const windowSize = useWindowSize();
    const router = useRouter();
    const cart = useSelector(selectCart);
    const [url, setUrl] = useState('');
    const [id, setId] = useState(null);
    const [playlist, setPlaylist] = useState({});
    const [playlistInfo, setPlaylistInfo] = useState([]);
    const [playlistAudios, setPlaylistAudios] = useState([]);
    const [recommendedPlaylist, setRecommendedPlaylist] = useState([]);
    const [audioTrailerUrl, setAudioTrailerUrl] = useState('');
    const [audio, setAudio] = useState(typeof Audio !== "undefined" ? new Audio(audioTrailerUrl) : undefined);
    const [paused, setPaused] = useState(true);
    const [openRateModal, setOpenRateModal] = useState(false);
    const [openAfterRateModal, setOpenAfterRateModal] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [contentRating, setContentRating] = useState(0);
    const [voiceRating, setVoiceRating] = useState(0);
    const [rateContent, setRateContent] = useState('');
    const [addToCartError, setAddToCartError] = useState(false);
    const [playAudioError, setPlayAudioError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [afterRateContent, setAfterRateContent] = useState('Cảm ơn đánh giá của bạn. Bạn có thể thay đổi điểm đánh giá  bất cứ lúc nào.');
    const [addToCartErrorMessage, setAddToCartErrorMessage] = useState('');
    const isSm = windowSize.width > SCREEN_BREAKPOINTS.sm ? false : true;
    const coverImgHeight = isSm ? 182 : 380;

    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchPlaylist() {
            setPlaylist(playlistFromAPI);
            const playlistTrailer = playlistFromAPI.playlist_trailers.length > 0 ? playlistFromAPI.playlist_trailers[0]['file_url'] : '';
            setContentRating(playlistFromAPI.playlist_rating.content_stars);
            setAudioTrailerUrl(playlistTrailer);
        }

        async function fetchRecommendedPlaylist() {
            const res = await api.getPlaylistAnalyses();
            const data = res.data.data;
            setRecommendedPlaylist(data);
        }

        async function fetchPlaylistAudios() {
            const res = await api.getPlaylistAudios(id);
            const data = res.data.data;
            setPlaylistAudios(data);
        }
        if (id) {
            setUrl(window.location.href);
            fetchPlaylist();
            fetchRecommendedPlaylist();
            fetchPlaylistAudios();
            setPlaylistInfo(createPlaylistInfo());
        }
    }, [id]);

    useEffect(() => {
        const { id } = router.query;
        setId(id);
    }, [router.query]);

    useEffect(() => {
        const p = createPlaylistInfo();
        setPlaylistInfo(p);
    }, [playlist]);

    useEffect(() => {
        setAudio(new Audio(audioTrailerUrl));
    }, [audioTrailerUrl]);

    useEffect(() => {
        !paused ? audio.play() : audio.pause();
    }, [paused]);


    useEffect(() => {
        audio.addEventListener('ended', () => setPaused(true));
        return () => {
            audio.removeEventListener('ended', () => setPaused(true));
        };
    }, []);

    useEffect(() => {
        setPaused(true);
    }, []);

    const handleBookmark = () => {
        async function bookmarkPlaylist() {
            try {
                const res = await api.bookmarkPlaylist(playlist.id);
                const data = await res.data;
                if (data.error) {
                    setOpenSnackbar(true);
                    setErrorMessage('Đánh dấu playlist không thành công!');
                    return;
                }
                const playlistToBookmark = { ...playlist };
                playlistToBookmark['is_bookmark'] = !playlist.is_bookmark;
                setPlaylist({ ...playlistToBookmark })
            }
            catch (err) {
                setErrorMessage('Đánh dấu playlist không thành công!')
                setOpenSnackbar(true);
            }
        }

        bookmarkPlaylist();
    }

    const onPlayClick = () => {
        setPaused(!paused)
    }

    const createPlaylistInfo = () => {
        if (Object.keys(playlist).length > 0) {
            const playlistInfo = [
                {
                    label: <InfoLabel title='Tác giả' />,
                    value: <Link href={`/authors/${playlist?.authors[0]?.id}`} >
                        <Box
                            sx={{
                                cursor: 'pointer'
                            }}
                        >
                            <InfoValue value={playlist?.author_string} />
                        </Box>
                    </Link>
                },
                {
                    label: <InfoLabel title='Thời lượng' />,
                    value: <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.VZ_Text_content }}>{convertSecondsToReadableString(playlist?.total_duration)}</Typography>
                },
                {
                    label: <InfoLabel title='Kênh' />,
                    value: <Link href={`/channels/${playlist?.channel?.id}`}  >
                        <Box
                            sx={{
                                cursor: 'pointer'
                            }}
                        >
                            <InfoValue value={playlist?.channel?.name} />
                        </Box>
                    </Link>
                },
                {
                    label: <InfoLabel title='Người đọc' />,
                    value: <InfoValue value={playlist?.voicers.map(i => i.name).join(', ')} />
                },
                {
                    label: <InfoLabel title='Giá bán lẻ' />,
                    value:
                        <Box sx={{ ...flexStyle('flex-start', 'center'), columnGap: '6px' }}>
                            {
                                playlist?.sale_coin_price < playlist?.coin_price && (
                                    <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.VZ_Text_content, textDecoration: 'line-through' }}>{FormatPrice(playlist?.sale_coin_price)}</Typography>
                                )
                            }
                            <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.white }}>{FormatPrice(playlist?.coin_price)}</Typography>
                        </Box>

                },
                {
                    label: <InfoLabel title='Đánh giá' />,
                    value:
                        <Box sx={{ ...flexStyle('flex-start', 'center'), columnGap: '2px' }}>
                            <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.VZ_Text_content }}>{playlist?.playlist_counter?.content_avg}</Typography>
                            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 0L8.5716 4.83688H13.6574L9.5429 7.82624L11.1145 12.6631L7 9.67376L2.8855 12.6631L4.4571 7.82624L0.342604 4.83688H5.4284L7 0Z" fill="#754ADA" />
                            </svg>
                            <Typography sx={{ ...TEXT_STYLE.content2, color: COLORS.VZ_Text_content }}>({playlist?.playlist_counter?.ratings_count})</Typography>
                        </Box>
                }
            ]
            return playlistInfo;
        }
        return []
    }

    const handleOpenRateModal = () => {
        setOpenRateModal(true)
    }


    const handleOpenShareModal = () => {
        setOpenShareModal(true)
    }

    const handleRatePlaylist = async (cb) => {
        try {
            const res = await api.ratePlaylist(id, {
                content_stars: contentRating,
                voice_stars: voiceRating,
                content: rateContent
            });
            const result = await res.data;
            if (result.code === 0) {
                setAfterRateContent('Đã xảy ra lỗi khi đánh giá playlist, bạn hãy thử lại nhé!');
                return;
            }
            const data = result.data;
            const tmpPlaylist = { ...playlist };
            tmpPlaylist['playlist_counter'] = data.playlist_counter;
            tmpPlaylist['playlist_rating'] = data.playlist_rating;
            setPlaylist({ ...tmpPlaylist });
            cb();
        }
        catch (err) {
            setAfterRateContent('Đã xảy ra lỗi khi đánh giá playlist, bạn hãy thử lại nhé!');
        }
    }

    const handleAddToCart = async () => {
        // add to cart store
        const isItemExists = cart.length > 0 && cart.some(i => i.id === playlist.id);
        if (!isItemExists) {
            try {
                const res = await api.addToCart(playlist.id);
                const result = await res.data;
                if (result.code === 0) {
                    setAddToCartError(true);
                    setAddToCartErrorMessage(result.error);
                    setTimeout(() => {
                        setAddToCartError(false);
                    }, 1500)
                    return;
                }
                const tmpCart = [...cart, playlist];
                dispatch(setCart(tmpCart));
                dispatch(setAddToCartFlag(1));
            }
            catch (err) {
                const errList = err.response.data.error;
                if (errList instanceof Object) {
                    let errMessage = '';
                    for (let e in errList) {
                        const key = Object.keys(errList[e])[0];
                        const value = errList[e][key]
                        errMessage += `${value} \n`
                    }
                    setAddToCartErrorMessage(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                    setAddToCartError(true);
                    setTimeout(() => {
                        setAddToCartError(false);
                    }, 1500);
                    return;
                }
                setAddToCartErrorMessage(errList);
                setAddToCartError(true);
                setTimeout(() => {
                    setAddToCartError(false);
                }, 1500);
            }
            return;
        }
        setAddToCartErrorMessage('Sản phẩm đã được thêm vào.\n Vui lòng kiểm tra lại giỏ hàng!');
        setAddToCartError(true);
        setTimeout(() => {
            setAddToCartError(false);
        }, 1500);
    }

    const handlePlayAudio = async (audioId) => {
        try {
            var res = await api.getAudioFile(audioId);
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleClickPlayAll = async (e) => {
        e.preventDefault();
        if (playlistAudios) {
            return;
        }
        try {
            var res = await api.getAudioFile(playlistAudios[0].id);
        }
        catch (err) {
            console.log(err)
        }
    }

    const getImgWidth = () => {
        const leftPane = document.querySelector('#left-pane');
        const { clientWidth } = leftPane;
        const sidePadding = isSm ? 0 : 32
        return ((clientWidth - sidePadding * 2) / 3) - 3.5;
    }

    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column',
                position: 'relative'
            }}
        >

            <Box
                sx={{
                    position: 'absolute',
                    height: `${coverImgHeight}px`,
                    width: '100%',
                    top: 0
                }}
            >
                <img style={{
                    width: '100%',
                    height: '100%',
                    left: 0,
                }} alt="cover img alt" src={playlist?.avatar?.original_url}></img>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'relative',
                    marginTop: `${coverImgHeight}px`
                }}
            >
                <Box
                    sx={{
                        backgroundColor: COLORS.bg2,
                        ...(!isSm && { height: '180px' })
                    }}
                >
                    <Box sx={{
                        padding: '20px',
                        ...(isSm ? {
                            ...flexStyle('center', 'flex-start'),
                            flexDirection: 'column'

                        } : {
                            ...flexStyle('flex-start', 'center')
                        })
                    }}>
                        <Box
                            sx={{
                                ...flexStyle('flex-start', 'center'),
                                width: '100%',
                                flexDirection: 'column'
                            }}
                        >
                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'flex-start'),
                                    width: '100%'
                                }}
                            >
                                <Box
                                    sx={{
                                        width: isSm ? '40%' : '30%',
                                        minWidth: isSm ? '136px' : '250px',
                                        transform: 'translateY(-50%)'
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            width: isSm ? '136px' : '250px',
                                            height: isSm ? '136px' : '250px',
                                        }} alt="Remy Sharp" src={playlist?.avatar?.thumb_url}
                                        variant="rounded"
                                    />
                                </Box>
                                {
                                    !isSm && (
                                        <Box
                                            sx={{
                                                ...flexStyle('center', 'flex-start'),
                                                flexDirection: 'column',
                                                rowGap: isSm ? '16px' : '25px',
                                                margin: '0 40px',
                                                width: '50%'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                                                    color: COLORS.white,
                                                    display: '-webkit-box',
                                                    textOverflow: 'ellipsis',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                }}>{playlist?.name}
                                            </Typography>
                                            <Box onClick={handleOpenRateModal}>
                                                <Rating
                                                    sx={{
                                                        columnGap: '24px',
                                                        '& .MuiRating-iconEmpty': {
                                                            color: COLORS.contentIcon
                                                        }
                                                    }}
                                                    name="playlist-rate" value={contentRating} precision={1} readOnly />
                                            </Box>
                                        </Box>
                                    )
                                }
                                <Box
                                    sx={{
                                        width: isSm ? '60%' : '20%',
                                        ...flexStyle('center', 'center'),
                                        columnGap: isSm ? '24px' : '35px'
                                    }}
                                >
                                    <Box onClick={handleOpenShareModal}>
                                        <Share bgfill='#373944' stroke='none' fill='white'></Share>
                                    </Box>
                                    <ShareModal url={url} isSm={isSm} open={openShareModal} setOpen={setOpenShareModal}></ShareModal>
                                    <RateModal
                                        isSm={isSm}
                                        open={openRateModal}
                                        setOpen={setOpenRateModal}
                                        setOpenAfterRate={setOpenAfterRateModal}
                                        handleRatePlaylist={handleRatePlaylist}
                                        setContentRating={setContentRating}
                                        setVoiceRating={setVoiceRating}
                                        contentRating={contentRating}
                                        voiceRating={voiceRating}
                                        rateContent={rateContent}
                                        setRateContent={setRateContent}
                                    />
                                    <AfterRateModal content={afterRateContent} isSm={isSm} open={openAfterRateModal} setOpen={setOpenAfterRateModal} />
                                    <Button
                                        onClick={handleBookmark}
                                        sx={{
                                            ...TEXT_STYLE.title1,
                                            color: COLORS.white,
                                            borderRadius: '22px',
                                            height: isSm ? '28px' : '48px',
                                            width: 'max-content',
                                            minWidth: 'auto',
                                            whiteSpace: 'nowrap',
                                            textTransform: 'none',
                                            bgcolor: playlist?.is_bookmark ? COLORS.bg3 : COLORS.main,
                                            pl: '14px',
                                            pr: '14px',
                                            ':hover': {
                                                bgcolor: playlist?.is_bookmark ? COLORS.bg3 : COLORS.main
                                            }
                                        }}
                                        startIcon={playlist?.is_bookmark ? <CheckIcon /> : <AddIcon />}
                                    >{playlist?.is_bookmark ? 'Hủy đánh dấu' : 'Đánh dấu'}</Button>
                                    <Snackbar
                                        open={openSnackbar}
                                        autoHideDuration={6000}
                                        onClose={() => { setOpenSnackbar(false) }}
                                    >
                                        <Alert onClose={() => { setOpenSnackbar(false) }} severity="error" sx={{ width: '100%' }}>
                                            {errorMessage}
                                        </Alert>
                                    </Snackbar>
                                </Box>
                            </Box>
                            {
                                isSm && (
                                    <Box
                                        sx={{
                                            ...flexStyle('center', 'center'),
                                            flexDirection: 'column',
                                            rowGap: isSm ? '16px' : '25px',
                                            marginTop: '-50px',
                                            width: '70%'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                                color: COLORS.white
                                            }}>
                                            {playlist?.name}
                                        </Typography>
                                        <Box onClick={handleOpenRateModal}>
                                            <Rating
                                                sx={{
                                                    columnGap: '24px'
                                                }}
                                                name="playlist-rate" value={contentRating} precision={1} readOnly />
                                        </Box>
                                    </Box>
                                )
                            }
                        </Box>
                    </Box>
                </Box >
            </Box >
            {
                isSm && (
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '16px',
                            width: '100%',
                            padding: '16px',
                            boxSizing: 'border-box',
                            bgcolor: COLORS.bg2,
                            borderRadius: '10px',
                            margin: '16px 0'
                        }}
                    >
                        <Button
                            onClick={handlePlayAudio}
                            sx={{
                                bgcolor: COLORS.main,
                                width: '50%',
                                borderRadius: '6px',
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                height: '48px'
                            }}
                            startIcon={<Play />}
                        >Phát tất cả</Button>
                        {
                            !!audioTrailerUrl && (
                                <Button
                                    sx={{
                                        bgcolor: COLORS.second,
                                        width: '50%',
                                        borderRadius: '6px',
                                        ...TEXT_STYLE.title1,
                                        color: COLORS.white,
                                        textTransform: 'none',
                                        height: '48px',
                                        ':hover': {
                                            bgcolor: COLORS.second
                                        }
                                    }}
                                    startIcon={paused ? <VolumeMuteIcon sx={{ color: COLORS.white }} /> : <VolumeUpIcon sx={{ color: COLORS.white }} />}
                                    onClick={onPlayClick}
                                >Nghe thử</Button>
                            )
                        }
                    </Box>
                )
            }
            <Box
                sx={{
                    ...flexStyle('center', 'flex-start'),
                    width: '100%',
                    columnGap: '32px',
                    padding: isSm ? 0 : '48px',
                    boxSizing: 'border-box',
                    ...(isSm && { flexDirection: 'column' })
                }}
            >
                <Box
                    sx={{
                        width: isSm ? '100%' : '35%',
                        bgcolor: COLORS.bg2,
                        padding: isSm ? '26px 0 0 15px' : '26px 32px',
                        borderRadius: '10px'
                    }}
                    id='left-pane'
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                            color: COLORS.white,
                            marginBottom: isSm ? '30px' : '38px'
                        }}
                    >Giới thiệu</Typography>
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '20px'
                        }}
                    >
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
                                    {playlistInfo.map((row, idx) => (
                                        <TableRow
                                            key={idx}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell
                                                sx={{
                                                    borderBottom: 'none',
                                                    padding: '0 0 21px 0'
                                                }}
                                                component="th" scope="row"
                                            >
                                                {row.label}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    borderBottom: 'none',
                                                    padding: '0 0 21px 0',
                                                    textAlign: 'left'
                                                }}
                                                align="right"
                                            >{row.value}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.title2,
                                color: COLORS.white,
                                marginBottom: '8px'
                            }}
                        >Lời tựa</Typography>

                        <ShowMoreText
                            lines={3}
                            more={ShowTextBtn('Xem thêm')}
                            less={ShowTextBtn('Thu gọn')}
                            className="truncated-text"
                            anchorClass="my-anchor-css-class"
                            expanded={false}
                            width={isSm ? 390 : 1000}
                            truncatedEndingComponent={"... "}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.VZ_Text_content,
                                    marginBottom: '16px',
                                    maxWidth: '90%'
                                }}
                            >{playlist?.description}
                            </Typography>
                        </ShowMoreText>
                    </Box>
                    <Box>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.title2,
                                color: COLORS.white,
                                marginBottom: '15px',
                                marginTop: isSm ? '26px' : '16px'
                            }}
                        >Có thể bạn muốn nghe</Typography>
                        {
                            !isSm && (
                                <Box
                                    sx={{
                                        ...flexStyle('flex-start', 'center'),
                                        flexWrap: 'wrap',
                                        columnGap: '5px',
                                        rowGap: '5px'
                                    }}
                                >
                                    {
                                        recommendedPlaylist.map((item, idx) => (
                                            <Link
                                                href={'/playlists/[id]'}
                                                as={`/playlists/${item?.id}`}
                                                key={idx}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 'calc(100% / 3 - 3.5px)'
                                                    }}
                                                >
                                                    <Thumbnail
                                                        style={{
                                                            width: '100%',
                                                            height: `${getImgWidth()}px`
                                                        }}
                                                        avtSrc={item?.avatar?.thumb_url} alt={item.alt}
                                                    />
                                                </Box>
                                            </Link>
                                        ))
                                    }
                                </Box>
                            )
                        }
                        {
                            isSm && (
                                <Swiper slidesPerView='auto' spaceBetween={10} >
                                    {recommendedPlaylist.map((item, idx) => (
                                        <SwiperSlide key={idx} style={{ width: 'auto' }}>
                                            <Link
                                                href={'/playlists/[id]'}
                                                as={`/playlists/${item?.id}`}
                                                key={idx}
                                            >
                                                <Box>
                                                    <Thumbnail
                                                        key={idx}
                                                        style={{
                                                            width: '96px',
                                                            height: '96px'
                                                        }}
                                                        avtSrc={item?.avatar?.thumb_url} alt={item.alt}
                                                    />
                                                </Box>
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )
                        }
                    </Box>
                </Box>
                <Box
                    sx={{
                        width: isSm ? '100%' : '65%',
                        ...flexStyle('center', 'center'),
                        flexDirection: 'column',
                        rowGap: '32px',
                        height: '100%',
                        marginTop: isSm ? '16px' : 0
                    }}
                >
                    {
                        !isSm && (
                            <Box
                                sx={{
                                    ...flexStyle('center', 'center'),
                                    columnGap: '24px',
                                    width: '100%',
                                    padding: '31px 24px',
                                    boxSizing: 'border-box',
                                    bgcolor: COLORS.bg2,
                                    borderRadius: '10px'
                                }}
                            >
                                <Button
                                    onClick={handleClickPlayAll}
                                    sx={{
                                        bgcolor: COLORS.main,
                                        width: '100%',
                                        borderRadius: '6px',
                                        ...TEXT_STYLE.title1,
                                        color: COLORS.white,
                                        textTransform: 'none',
                                        height: '48px',
                                        ':hover': {
                                            bgcolor: COLORS.main
                                        }
                                    }}
                                    startIcon={<Play />}
                                >Phát tất cả</Button>
                                {
                                    !!audioTrailerUrl && (
                                        <Button
                                            sx={{
                                                bgcolor: COLORS.second,
                                                width: '50%',
                                                borderRadius: '6px',
                                                ...TEXT_STYLE.title1,
                                                color: COLORS.white,
                                                textTransform: 'none',
                                                height: '48px'
                                            }}
                                            startIcon={paused ? <VolumeMuteIcon sx={{ color: COLORS.white }} /> : <VolumeUpIcon sx={{ color: COLORS.white }} />}
                                            onClick={onPlayClick}
                                        >Nghe thử</Button>
                                    )
                                }
                            </Box>
                        )
                    }
                    <Box
                        sx={{
                            bgcolor: COLORS.bg2,
                            width: '100%',
                            padding: isSm ? '26px 15px 0 15px' : '26px 32px 0 26px',
                            boxSizing: 'border-box',
                            borderRadius: '10px'
                        }}
                    >
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                color: COLORS.white,
                                marginBottom: isSm ? '26px' : '32px'
                            }}
                        >Danh sách audios</Typography>
                        <Box>
                            <List sx={{ width: '100%' }}>
                                {playlistAudios.map((value, idx) => {
                                    return (
                                        <ListItem
                                            key={value.id}
                                            onClick={() => { handlePlayAudio(value?.id) }}
                                            sx={{
                                                paddingLeft: 0,
                                                paddingRight: '20px',
                                                borderTop: `.5px solid ${COLORS.placeHolder}`,
                                                height: '72px'
                                            }}
                                            secondaryAction={
                                                <Typography
                                                    sx={{
                                                        ...TEXT_STYLE.content2,
                                                        color: COLORS.bg4
                                                    }}
                                                >{formatDuration(value.duration)}</Typography>
                                            }
                                        >
                                            <ListItemButton role={undefined} onClick={() => (1)} dense>
                                                <ListItemText
                                                    sx={{
                                                        'span': {
                                                            ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                            color: COLORS.white,
                                                            display: '-webkit-box',
                                                            textOverflow: 'ellipsis',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }
                                                    }}
                                                    id={`label-${value.id}`} primary={value.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    bgcolor: COLORS.bg2,
                    width: '100%',
                    padding: isSm ? '16px' : '26px 0',
                    boxSizing: 'border-box',
                    ...flexStyle('center', 'center'),
                    columnGap: '24px'
                }}
            >
                <Tooltip open={addToCartError} title={<div style={{ whiteSpace: 'pre-line', color: COLORS.error }}>{addToCartErrorMessage}</div>}>
                    <Button
                        onClick={handleAddToCart}
                        sx={{
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            width: isSm ? '50%' : '20%',
                            borderRadius: '6px',
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            height: '48px'
                        }}
                        variant="outlined"
                    >Thêm vào giỏ hàng</Button>
                </Tooltip>
                <Link
                    href='/up-vip/'

                >
                    <Box
                        sx={{
                            width: isSm ? '50%' : '20%',
                        }}
                    >
                        <Button
                            sx={{
                                bgcolor: COLORS.main,
                                borderRadius: '6px',
                                width: '100%',
                                ...TEXT_STYLE.title1,
                                color: COLORS.white,
                                textTransform: 'none',
                                height: '48px'
                            }}
                        >Mua gói VIP</Button>
                    </Box>
                </Link>
            </Box>
            <Dialog
                open={playAudioError}
                onClose={() => { setPlayAudioError(false) }}
                sx={{
                    '& .MuiPaper-root': {
                        bgcolor: COLORS.bg1,
                        p: '40px 56px',
                        boxSizing: 'border-box',
                        borderRadius: isSm ? '10px' : '30px',
                        ...(isSm && { m: '0 16px' })
                    }
                }}
            >
                <DialogContent>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center',
                            whiteSpace: 'pre-line'
                        }}
                    >
                        Vui lòng đăng nhập tài khoản VIP hoặc nâng cấp tài khoản để được nghe!
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '16px'
                    }}
                >
                    <Link
                        href={`/up-vip`}

                    >
                        <Box
                            sx={{
                                maxWidth: '192px',
                                width: 'calc(50% - 8px)',
                            }}
                        >
                            <Button
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    textTransform: 'none',
                                    borderRadius: '8px',
                                    width: '100%',
                                    height: '48px',
                                    bgcolor: COLORS.main
                                }}
                                autoFocus
                            >
                                UP VIP
                            </Button>
                        </Box>
                    </Link>
                </DialogActions>
            </Dialog>
        </Box >
    )
}
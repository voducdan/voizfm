// import next link
import Link from 'next/link';

// import MUI components
import {
    Card,
    Box,
    CardContent,
    Typography,
    Button,
    IconButton
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import {
    User,
    Trash
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

export default function PlaylistThumnail(props) {
    const {
        id,
        src,
        name,
        authors,
        isBookmark,
        hasBookmark,
        hasDelete,
        handleConfirmDeleteModalOpen,
        handleBookmark,
        children,
        width,
        promotion,
        isAudio,
        playlistId
    } = props;
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const clientWidth = width ? width : (isSm || hasDelete) ? '100%' : '45%';

    const authorsString = (authors) => {
        if (Array.isArray(authors)) {
            if (authors.length > 0) {
                return authors.map(author => author.name).join(',')
            }
            return null
        }
        return authors
    }

    return (
        <Card
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: isSm ? '10px' : '20px',
                bgcolor: 'inherit',
                boxShadow: 'none',
                width: clientWidth,
                height: '100px'
            }}
        >
            <Box
                sx={{
                    width: '100px',
                    height: '100px',
                    position: 'relative',
                    ...(promotion && {
                        '&::before': {
                            content: promotion.includes('vip') ? "url('/images/dvip.png')" : promotion === 'coin' ? "url('/images/dcoin.png')" : "url('/images/dfree.png')",
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            zIndex: 8
                        }
                    })
                }}
            >
                <Link
                    href={isAudio ? `/play/${playlistId}?audioId=${id}` : `/play/${id}`}
                >
                    <img
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: hasDelete ? '50%' : '4px',
                            cursor: 'pointer'
                        }}
                        src={src}
                        alt={`images ${name}`}
                    />
                </Link>
                {
                    hasDelete && (
                        <PlayArrowIcon
                            fontSize="large"
                            sx={{
                                position: 'absolute',
                                color: COLORS.white,
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)'
                            }}
                        />
                    )
                }
            </Box>

            <CardContent
                sx={{
                    ...flexStyle('space-between', 'flex-start'),
                    flexDirection: 'column',
                    flex: '1 0 auto',
                    p: 0,
                    height: '100%',
                    width: isSm ? 'calc(100% - 110px)' : 'calc(100% - 120px)',
                    '&:last-child': {
                        p: 0
                    }
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('space-between', 'flex-start'),
                        width: '100%',
                        ...(isSm && { columnGap: '10px' })
                    }}
                >
                    <Link
                        href={isAudio ? `/play/${playlistId}?audioId=${id}` : `/play/${id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <Box
                            sx={{
                                ...flexStyle('flex-start', 'flex-start'),
                                flexDirection: 'column',
                                flex: '1 0 auto',
                                rowGap: '6px',
                                width: '50%',
                                cursor: 'pointer'
                            }}
                        >

                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    display: '-webkit-box',
                                    textOverflow: 'ellipsis',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden'
                                }}
                            >
                                {name}
                            </Typography>
                            {
                                authorsString(authors) && (
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: '6px'
                                        }}
                                    >
                                        <User />
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content1,
                                                color: COLORS.contentIcon,
                                                display: '-webkit-box',
                                                textOverflow: 'ellipsis',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {authorsString(authors)} {Array.isArray(authors) ? '(Tác giả)' : ''}
                                        </Typography>
                                    </Box>
                                )
                            }
                            {
                                !authorsString(authors) && (
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content1,
                                            color: COLORS.contentIcon
                                        }}
                                    >
                                        Không có tác giả
                                    </Typography>
                                )
                            }
                        </Box>
                    </Link>
                    {hasBookmark && (
                        <Button
                            onClick={() => { handleBookmark(id) }}
                            sx={{
                                ...(isSm ? TEXT_STYLE.title3 : TEXT_STYLE.title2),
                                ...(isSm && { whiteSpace: 'nowrap' }),
                                color: COLORS.white,
                                borderRadius: '22px',
                                height: '32px',
                                width: isSm ? '122px' : '144px',
                                textTransform: 'none',
                                bgcolor: isBookmark ? COLORS.bg3 : COLORS.main,
                                p: 0,
                                ':hover': {
                                    bgcolor: isBookmark ? COLORS.bg3 : COLORS.main
                                }
                            }}
                            startIcon={isBookmark ? <CheckIcon /> : <AddIcon />}
                        >{isBookmark ? 'Hủy đánh dấu' : 'Đánh dấu'}</Button>)
                    }
                    {
                        hasDelete && (
                            <IconButton onClick={handleConfirmDeleteModalOpen} id={id} aria-label="delete" size="small" sx={{ color: COLORS.VZ_Text_content, p: '0 5px 5px 5px' }}>
                                <Trash />
                            </IconButton>
                        )
                    }
                </Box>
                {children}
            </CardContent>
        </Card>
    )
}
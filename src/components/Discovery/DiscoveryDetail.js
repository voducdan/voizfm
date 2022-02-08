// import react
import { useState, useEffect, useRef } from 'react';

// import next router
import { useRouter } from 'next/router';

// import next link
import Link from 'next/link';

// import MUI components
import {
    Box,
    Typography,
    Avatar,
    Divider,
    FormControl,
    Input,
    Button,
    Snackbar
} from '@mui/material';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import HeadphonesIcon from '@mui/icons-material/Headphones';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

const CommentItem = (props) => {
    const { data, api, updateLike, commentInputRef } = props;

    const [isLikeError, setIsLikeError] = useState(false);

    const handleLikeComment = async (id) => {
        const res = await api.likeComment(id);
        try {
            const data = await res.data;
            if (data.error) {
                setIsLikeError(true);
                return;
            }
            updateLike(data.data);
        }
        catch (err) {
            setIsLikeError(true);
            console.log(err);
        }
    }

    const handleResponseComment = () => {
        commentInputRef.current.children[1].focus();
    }

    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'flex-start'),
                columnGap: '11px'
            }}
        >
            <Box>
                <Avatar sx={{ width: '35px', height: '35px' }} alt='img alt' src={data.user ? data.user.avatar.thumb_url : ''} />
            </Box>
            <Box
                sx={{
                    ...flexStyle('center', 'flex-starrt'),
                    flexDirection: 'column',
                    rowGap: '15px'
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('center', 'flex-start'),
                        flexDirection: 'column',
                        rowGap: '8px',
                        padding: '15px',
                        bgcolor: COLORS.bg2,
                        borderRadius: '10px'
                    }}
                >
                    {
                        data.user && (
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white
                                }}
                            >{data.user.first_name} {data.user.last_name}</Typography>
                        )
                    }
                    <Typography
                        style={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.VZ_Text_content,
                        }}
                    >{data.content}</Typography>
                </Box>
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: '31px'
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <CommentOutlinedIcon sx={{ color: COLORS.contentIcon, width: '14px', height: '14px' }} />
                        <Typography
                            onClick={handleResponseComment}
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: COLORS.contentIcon
                            }}
                        >
                            Trả lời
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <ThumbUpAltOutlinedIcon
                            onClick={() => { handleLikeComment(data.id) }}
                            sx={{
                                color: data.is_liked ? COLORS.main : COLORS.contentIcon,
                                width: '14px',
                                height: '14px'
                            }}
                        />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: COLORS.contentIcon
                            }}
                        >
                            {data.comment_likes_count}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                    >
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content3,
                                color: COLORS.contentIcon,
                            }}
                        >
                            {data.published_at}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isLikeError}
                onClose={() => { setIsLikeError(false) }}
                message="Thích đánh giá không thành công, vui lòng thử lại!"
                key='bottomcenter'
            />
        </Box>
    )
}

export default function DiscoveryDetail({ discovery }) {
    const api = new API();

    const windowSize = useWindowSize();
    const commentInputRef = useRef();
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [commentPage, setCommentPage] = useState(0);
    const [isCommentError, setIsCommentError] = useState(false);
    const { id } = useRouter().query;

    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const coverImgHeight = isSm ? 200 : 380;

    useEffect(() => {
        async function fetchDiscoveryComment() {
            const res = await api.getDiscoveryComment(id);
            const data = await res.data.data;
            setComments(data);
        };

        fetchDiscoveryComment();
    }, [commentPage]);

    const handleWriteComment = (e) => {
        const content = e.target.value;
        setCommentContent(content);
    }

    const handleCommentKeyUp = async (e) => {
        const { keyCode } = e;
        if (keyCode === 13) {
            await sendComment(discovery.id, { content: commentContent });
        }
    }

    const handleComment = async () => {
        await sendComment(discovery.id, { content: commentContent });
    }

    const updateLike = (data) => {
        const commentsTmp = [...comments];
        const cmtIdx = commentsTmp.findIndex(i => i.id === data.id);
        commentsTmp[cmtIdx] = data;
        setComments(commentsTmp);
    }

    const appendComment = (comment) => {
        setComments([comment, ...comments]);
    }

    async function sendComment(discoveryId, data) {
        const res = await api.commentDiscovery(discoveryId, data);
        try {
            const data = await res.data;
            if (data.error) {
                setIsCommentError(true);
                console.log(data.error);
                return;
            }
            appendComment(data.data);
        }
        catch (err) {
            setIsCommentError(true);
            console.log(err);
        }
    }

    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column'
            }}
        >
            <Box
                sx={{
                    height: `${coverImgHeight}px`,
                    width: '100%',
                    top: 0
                }}
            >
                <img style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    left: 0,
                }} alt="cover img alt" src={discovery?.image?.original_url}></img>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: COLORS.bg2

                }}
            >
                <Box
                    sx={{
                        width: isSm ? '90%' : '60%',
                        margin: '0 auto'
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            columnGap: '16px',
                            margin: isSm ? '24px 0 16px 0' : '24px 0'
                        }}
                    >
                        <Box>
                            <Avatar sx={{ width: '48px', height: '48px' }} alt="discovery avt alt" src={discovery?.channel?.avatar?.thumb_url} />
                        </Box>
                        <Box
                            sx={{
                                ...flexStyle('center', 'flex-start'),
                                flexDirection: 'column',
                                rowGap: '6px'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.h3,
                                    color: COLORS.white
                                }}
                            >{discovery?.channel?.name}</Typography>
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.contentIcon
                                }}
                            >{discovery?.published_at}</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ border: `1px solid ${COLORS.blackStroker}`, mb: isSm ? '16px' : '24px' }} />
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                            color: COLORS.white,
                            mb: isSm ? '19px' : '16px'
                        }}
                    >
                        {discovery?.summary}
                    </Typography>
                </Box>
            </Box>
            {
                discovery.discovery_contents && discovery.discovery_contents.map(i => (
                    <Box
                        key={i?.id}
                        sx={{
                            width: isSm ? '90%' : '60%',
                            margin: '0 auto'
                        }}
                    >
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h2),
                                color: COLORS.white,
                                margin: isSm ? '33px auto 24px auto' : '48px auto'
                            }}
                        >
                            {i?.title}
                        </Typography>
                        <Box
                            sx={{
                                height: '329px',
                                width: '100%',
                                top: 0,
                                position: 'relative'
                            }}
                        >
                            <img style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%',
                                left: 0,
                            }} alt="cover img alt" src={i.avatar && i?.avatar.thumb_url}></img>
                            <Link
                                style={{
                                    position: 'absolute',
                                    bottom: '10px',
                                    right: '10px',
                                    textDecoration: 'none'
                                }}
                                href={`/playlists/${i?.playlist?.id}`}
                            >
                                <Button
                                    sx={{
                                        ...TEXT_STYLE.title2,
                                        color: COLORS.white,
                                        bgcolor: COLORS.main,
                                        textTransform: 'none',
                                        height: '48px',
                                        width: '150px',
                                        borderRadius: '48px',
                                        ':hover': {
                                            bgcolor: 'rgb(56 57 68 / 93%)'
                                        }
                                    }}
                                    startIcon={<HeadphonesIcon sx={{ color: COLORS.white }} />}
                                >
                                    Nghe sách
                                </Button>
                            </Link>
                        </Box>
                        <Typography
                            sx={{
                                ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                color: COLORS.VZ_Text_content,
                                margin: isSm ? '23px auto 16px auto' : '48px auto 32px auto',
                                whiteSpace: 'pre-wrap'
                            }}
                        >
                            {i?.content}
                        </Typography>
                    </Box>
                ))
            }
            <Box
                sx={{
                    width: isSm ? '100%' : '60%',
                    margin: '0 auto'
                }}
            >
                <Box
                    sx={{
                        bgcolor: COLORS.bg2,
                        padding: isSm ? '16px' : '20px',
                        ...flexStyle('space-between', 'center'),
                        mb: isSm ? '24px' : '30px'
                    }}
                >
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                    >
                        <CommentOutlinedIcon sx={{ color: COLORS.white, width: '14px', height: '14px' }} />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content2,
                                color: COLORS.white,
                            }}
                        >
                            {discovery?.discovery_counter?.comments_count} góp ý
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                    >
                        <ThumbUpAltOutlinedIcon sx={{ color: COLORS.white, width: '14px', height: '14px' }} />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content2,
                                color: COLORS.white,
                            }}
                        >
                            {discovery?.discovery_counter?.likes_count} thích
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: isSm ? '90%' : '60%',
                    margin: '0 auto'
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('center', 'flex-start'),
                        flexDirection: 'column',
                        rowGap: '34px'
                    }}
                >
                    {
                        comments.map(item => (
                            <CommentItem commentInputRef={commentInputRef} updateLike={updateLike} api={api} key={item.id} data={item} />
                        ))
                    }
                </Box>
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: isSm ? '16px' : '31px',
                        mt: '40px'
                    }}
                >
                    <FormControl fullWidth variant="standard">
                        <Input
                            sx={{
                                height: '40px',
                                border: `1px solid ${COLORS.placeHolder}`,
                                color: COLORS.placeHolder,
                                borderRadius: '24px',
                                padding: '0 16px',
                                boxSizing: 'border-box',
                                '& .MuiInput-input': {
                                    padding: '13px 16px',
                                    ...TEXT_STYLE.caption12
                                }
                            }}
                            ref={commentInputRef}
                            disableUnderline={true}
                            id="discovery-comment"
                            value={commentContent}
                            placeholder='Gửi góp ý cho nội dung này'
                            onChange={handleWriteComment}
                            onKeyUp={handleCommentKeyUp}
                            startAdornment={<BorderColorOutlinedIcon sx={{ color: COLORS.placeHolder }} position="start">$</BorderColorOutlinedIcon>}
                        />
                    </FormControl>
                    <Button
                        onClick={handleComment}
                        sx={{
                            ...TEXT_STYLE.title3,
                            color: COLORS.VZ_Text_content,
                            textTransform: 'none'
                        }}
                    >Gửi</Button>
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isCommentError}
                onClose={() => { setIsCommentError(false) }}
                message="Đánh giá không thành công, vui lòng thử lại sau!"
                key='bottomcenter'
            />
        </Box>
    )
}
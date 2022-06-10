// import react
import { useState, useEffect, useRef } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import reducer, actions
import { selectUser } from '../../redux/user';
import { setOpenLogin } from '../../redux/openLogin';

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
    Snackbar,
    Alert
} from '@mui/material';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import HeadphonesIcon from '@mui/icons-material/Headphones';

// Import icons
import {
    Comment,
    Like
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

const CommentItem = (props) => {
    const { data, api, updateLike, commentInputRef, user } = props;

    const [isLikeError, setIsLikeError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

    const handleLikeComment = async (id) => {

        if (!user) {
            dispatch(setOpenLogin(true));
            return;
        }
        try {
            const res = await api.likeComment(id);
            const data = await res.data;
            if (data.error) {
                setIsLikeError(true);
                return;
            }
            updateLike(data.data);
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
                setErrorMessage(errMessage)
                setIsLikeError(true);
                return;
            }
            setErrorMessage(errList)
            setIsLikeError(true);
        }
    }

    const handleResponseComment = () => {
        if (!user) {
            dispatch(setOpenLogin(true));
            return;
        }
        commentInputRef.current.children[1].focus();
    }

    return (
        <Box
            id={`comment-${data.id}`}
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
                    rowGap: '15px',
                    width: '100%',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line'
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
                        <Comment bgfill={COLORS.contentIcon} fill={COLORS.contentIcon} />
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
                        onClick={() => { handleLikeComment(data.id) }}
                    >
                        <Like
                            bgfill={data.is_liked ? COLORS.main : COLORS.white}
                            fill={data.is_liked ? COLORS.main : COLORS.white}
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
                message={errorMessage}
                key='bottomcenter'
            />
        </Box>
    )
}

export default function DiscoveryDetail({ discovery }) {
    const api = new API();
    const windowSize = useWindowSize();
    const commentInputRef = useRef();
    const user = useSelector(selectUser);
    const [inlineDiscovery, setInlineDiscovery] = useState(discovery);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [commentPage, setCommentPage] = useState(1);
    const [isCommentError, setIsCommentError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [readOnlyComment, setReadOnlyComment] = useState(false);
    const [hasLoadMore, setHasLoadMore] = useState(true);

    const { id } = useRouter().query;

    const dispatch = useDispatch();

    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const coverImgHeight = isSm ? 200 : 380;

    async function fetchDiscoveryComment(page) {
        try {
            const res = await api.getDiscoveryComment(id, page);
            const data = await res.data.data;
            const appendedComments = [...comments, ...data];
            if (appendedComments.length === inlineDiscovery?.discovery_counter?.comments_count) {
                setHasLoadMore(false);
            }
            setComments(appendedComments);
        }
        catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        fetchDiscoveryComment(commentPage);
    }, [commentPage]);

    useEffect(() => {
        if (user) {
            setReadOnlyComment(false);
        }
    }, [user]);

    const handleWriteComment = (e) => {
        if (user) {
            const content = e.target.value;
            setCommentContent(content);
        }
    }

    const handleClickCommentInput = (e) => {
        if (!user && !commentContent) {
            dispatch(setOpenLogin(true));
            setCommentContent('');
            setReadOnlyComment(true);
        }
    }

    const handleCommentKeyUp = async (e) => {
        const { keyCode } = e;
        if (keyCode === 13 && commentContent) {
            await sendComment(inlineDiscovery.id, { content: commentContent });
        }
    }

    const handleComment = async () => {
        if (!user) {
            dispatch(setOpenLogin(true));
            return;
        }
        if (commentContent) {
            await sendComment(inlineDiscovery.id, { content: commentContent });
        }
    }

    const updateLike = (data) => {
        const commentsTmp = [...comments];
        const cmtIdx = commentsTmp.findIndex(i => i.id === data.id);
        commentsTmp[cmtIdx] = data;
        setComments(commentsTmp);
    }

    const appendComment = (comment) => {
        const copiedDiscovery = { ...inlineDiscovery };
        copiedDiscovery.discovery_counter.comments_count = inlineDiscovery.discovery_counter.comments_count + 1;
        setInlineDiscovery({ ...copiedDiscovery });
        setComments([comment, ...comments]);
    }

    async function sendComment(discoveryId, body) {
        if (!user) {
            dispatch(setOpenLogin(true));
            setCommentContent('');
            return;
        }
        try {
            const res = await api.commentDiscovery(discoveryId, body);
            const data = await res.data;
            if (data.error) {
                setIsCommentError(true);
                console.log(data.error);
                return;
            }
            appendComment(data.data);
            setCommentContent('');
            window.location.href = `${window.location.origin}${window.location.pathname}#comment-${data.data.id}`;
        }
        catch (err) {
            setCommentContent('');
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setErrorMessage(errMessage)
                setIsCommentError(true);
                return;
            }
            setErrorMessage(errList)
            setIsCommentError(true);
        }
    }

    const updateDiscoveryLike = (data) => {
        const discoveryTmp = { ...inlineDiscovery };
        discoveryTmp['discovery_counter']['likes_count'] = data.likes_count;
        discoveryTmp['is_liked'] = !discoveryTmp['is_liked'];
        setInlineDiscovery(discoveryTmp);
    }

    const handleLikeDiscovery = async () => {
        if (!user) {
            dispatch(setOpenLogin(true));
            return;
        }
        try {
            const res = await api.likeDiscovery(id);
            const data = await res.data;
            if (data.error) {
                setIsLikeError(true);
                return;
            }
            updateDiscoveryLike(data.data);
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
                setErrorMessage(errMessage)
                setIsCommentError(true);
                return;
            }
            setErrorMessage(errList)
            setIsCommentError(true);
        }
    };

    const handleLoadMoreComment = () => {
        if (comments.length < inlineDiscovery.discovery_counter.comments_count) {
            const nextCommentPage = commentPage + 1;
            // fetchDiscoveryComment(nextCommentPage);
            setCommentPage(nextCommentPage);
        }
    };

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
                }} alt="cover img alt" src={inlineDiscovery?.image?.original_url}></img>
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
                            <Avatar sx={{ width: '48px', height: '48px' }} alt="discovery avt alt" src={inlineDiscovery?.channel?.avatar?.thumb_url} />
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
                            >{inlineDiscovery?.channel?.name}</Typography>
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.contentIcon
                                }}
                            >{inlineDiscovery?.published_at}</Typography>
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
                        {inlineDiscovery?.summary}
                    </Typography>
                </Box>
            </Box>
            {
                inlineDiscovery.discovery_contents && inlineDiscovery.discovery_contents.map(i => (
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
                            }}
                                alt="cover img alt"
                                src={i?.avatar?.original_url}
                            />
                            <Link
                                style={{
                                    textDecoration: 'none'
                                }}
                                href={`/play/${i?.playlist?.id}`}
                            >
                                <Button
                                    sx={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '10px',
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
                        id='comment-area'
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                    >
                        <Comment bgfill={COLORS.white} fill={COLORS.white} />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content2,
                                color: COLORS.white,
                            }}
                        >
                            {inlineDiscovery?.discovery_counter?.comments_count} góp ý
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'center'),
                            columnGap: '8px'
                        }}
                        onClick={handleLikeDiscovery}
                    >
                        <Box
                            sx={{
                                cursor: 'pointer'
                            }}
                        >
                            <Like
                                bgfill={inlineDiscovery.is_liked ? COLORS.main : COLORS.white}
                                fill={inlineDiscovery.is_liked ? COLORS.main : COLORS.white}
                            />
                        </Box>
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content2,
                                color: COLORS.white,
                            }}
                        >
                            {inlineDiscovery?.discovery_counter?.likes_count} thích
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
                            <CommentItem user={user} commentInputRef={commentInputRef} updateLike={updateLike} api={api} key={item.id} data={item} />
                        ))
                    }
                    {
                        hasLoadMore && (
                            <Box
                                sx={{
                                    width: '100%',
                                    ...flexStyle('center', 'center')
                                }}
                            >
                                {
                                    comments.length >= 10 && (
                                        <Button
                                            onClick={handleLoadMoreComment}
                                            sx={{
                                                textTransform: 'none',
                                                ...TEXT_STYLE.title2,
                                                color: COLORS.white,
                                                bgcolor: COLORS.main,
                                                width: '170px',
                                                height: '40px',
                                                borderRadius: '50px',
                                                ':hover': {
                                                    bgcolor: COLORS.main
                                                }
                                            }}
                                        >
                                            Tải thêm góp ý
                                        </Button>
                                    )
                                }
                            </Box>
                        )
                    }
                </Box>
                <Box
                    sx={{
                        ...flexStyle('flex-start', 'center'),
                        columnGap: isSm ? '16px' : '31px',
                        mt: '40px',
                        maxWidth: '650px'
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
                                    ...TEXT_STYLE.content2,
                                    color: COLORS.white
                                }
                            }}
                            ref={commentInputRef}
                            disableUnderline={true}
                            id="discovery-comment"
                            value={commentContent}
                            placeholder='Gửi góp ý cho nội dung này'
                            onChange={handleWriteComment}
                            onKeyUp={handleCommentKeyUp}
                            onClick={handleClickCommentInput}
                            readOnly={readOnlyComment}
                            tabIndex="-1"
                            autoComplete="off"
                            startAdornment={<BorderColorOutlinedIcon sx={{ color: COLORS.placeHolder }} position="start">$</BorderColorOutlinedIcon>}
                        />
                    </FormControl>
                    <Button
                        onClick={handleComment}
                        sx={{
                            fontSize: '16px',
                            lineHeight: '16px',
                            fontWeight: 600,
                            fontFamily: 'SF UI Display',
                            fontStyle: 'normal',
                            color: COLORS.VZ_Text_content,
                            textTransform: 'none',
                            p: 0,
                            minWidth: 0
                        }}
                    >Gửi</Button>
                </Box>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isCommentError}
                autoHideDuration={6000}
                onClose={() => { setIsCommentError(false) }}
                key='bottomcenter'
            >
                <Alert onClose={() => { setIsCommentError(false) }} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    )
}
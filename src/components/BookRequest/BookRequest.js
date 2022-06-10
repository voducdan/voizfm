// import react
import { useState, useEffect } from 'react';

// import redux
import { useSelector } from 'react-redux';

// Import redux reducer, actions
import { selectToken } from '../../redux/token';

// import MUI components
import {
    Box,
    Typography,
    FormControl,
    Input,
    InputAdornment,
    Avatar,
    Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

import {
    Pencil1, Send
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import icons
import { OpenBook } from '../../components/Icons/index';

// import service
import API from '../../services/api';

export default function BookRequest() {
    const api = new API();
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const token = useSelector(selectToken);
    const [requestName, setRequestName] = useState('');
    const [requestSuccess, setRequestSuccess] = useState(false);
    const [requestedBooks, setRequestedBooks] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        async function fetchRequestedBook() {
            const res = await api.getRequestedBook();
            const data = res.data.data;
            setRequestedBooks(data);
        }
        if (token) {
            fetchRequestedBook();
        }
    }, [])

    useEffect(() => {
        if (requestSuccess) {
            setTimeout(() => {
                setRequestSuccess(false);
            }, 3000)
        }
    }, [requestSuccess]);

    const handleChange = (e) => {
        if (e.target.value !== '') {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
        setRequestName(e.target.value);
    }

    const handleSendRequest = async () => {
        const res = await api.requestedBook({ body: requestName })
        const data = await res.data.data;
        const tmpRequestedBooks = [...requestedBooks, data];
        setRequestedBooks(tmpRequestedBooks);
        setRequestSuccess(true);
        setRequestName('');
        setIsFormValid(false);
    }

    const commentContent = (item) => {
        if (Object.keys(item.user).length > 0) {
            return {
                name: `${item.user.first_name} ${item.user.last_name}`,
                avt: item.user.avatar.thumb_url
            }
        }
        return {
            name: item.admin.fullname,
            avt: item.admin.avatar.thumb_url
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                pt: '10vh'
            }}
        >
            <Box
                sx={{
                    width: isSm ? '90%' : '60%',
                    m: '0 auto'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        ...flexStyle('flex-start', 'center'),
                        columnGap: '16px'
                    }}
                >
                    <OpenBook bgfill='none' fill='white' border={COLORS.second} width='30' height='30' />
                    <Typography
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.contentIcon
                        }}
                    >Đề nghị sách</Typography>
                </Box>
                <Box
                    sx={{
                        mt: isSm ? '14px' : '24px',
                        mb: isSm ? '59px' : '80px'
                    }}
                >
                    <Typography
                        sx={{
                            ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                            color: COLORS.white
                        }}
                    >Vui lòng nhập tựa sách bạn muốn yêu cầu.</Typography>
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    <FormControl
                        fullWidth
                        variant="standard"
                    >
                        <Input
                            placeholder='Nhập càng nhiều càng tốt nhé!'
                            value={requestName}
                            onChange={handleChange}
                            sx={{
                                color: COLORS.white,
                                fontFamily: 'Mulish',
                                fontWeight: 500,
                                fontSize: '1rem',
                                lineHeight: '20px',
                                alignItems: 'flex-end',
                                height: isSm ? '32px' : '48px',
                                '::after': {
                                    border: 'none'
                                },
                                'input': {
                                    ml: '8px',
                                    p: 0
                                },
                                '::before': {
                                    borderBottom: `1px solid ${COLORS.bg2}`,
                                    bottom: isSm ? '-18px' : '-24px'
                                }
                            }}
                            startAdornment={
                                <InputAdornment
                                    position="start"
                                    sx={{
                                        height: '100%'
                                    }}
                                >
                                    <Pencil1 />
                                </InputAdornment>
                            }
                            endAdornment={
                                <InputAdornment
                                    onClick={handleSendRequest}
                                    position="end"
                                    sx=
                                    {{
                                        bgcolor: isFormValid ? COLORS.main : COLORS.bg3,
                                        width: isSm ? '54px' : '70px',
                                        height: isSm ? '32px' : '48px',
                                        maxHeight: isSm ? '32px' : '48px',
                                        maxWidth: isSm ? '32px' : '48px',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        ...flexStyle('center', 'center')
                                    }}
                                >
                                    <Send />
                                </InputAdornment>}
                        />
                    </FormControl>
                    {
                        requestSuccess && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '48px',
                                    bgcolor: '#15603f',
                                    ...flexStyle('flex-start', 'center'),
                                    columnGap: '8px',
                                    borderRadius: '4px',
                                    pl: '22px',
                                    mt: '20px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                <CheckIcon sx={{ color: COLORS.white }} />
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.content1,
                                        color: COLORS.white
                                    }}
                                >Nội dung bạn yêu cầu đã được gửi.</Typography>
                            </Box>
                        )
                    }
                </Box>
                <Box
                    sx={{
                        width: '100%',
                        mt: '60px'
                    }}
                >
                    {
                        requestedBooks.length > 0 && (
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    mb: '32px'
                                }}
                            >
                                Góp ý của bạn
                            </Typography>
                        )
                    }
                    <Box
                        sx={{
                            ...flexStyle('center', 'flex-start'),
                            flexDirection: 'column',
                            rowGap: '34px'
                        }}
                    >
                        {
                            requestedBooks.map((item, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        width: '100%',
                                        ...(isSm ? flexStyle('space-between', 'flex-start') : flexStyle('space-between', 'center')),
                                        ...(isSm && { flexDirection: 'column', rowGap: '8px' })
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '60%%',
                                            ...flexStyle('flex-start', 'flex-start'),
                                            columnGap: '11px'
                                        }}
                                    >
                                        <Box>
                                            <Avatar sx={{ width: '35px', height: '35px' }} alt='img alt' src={commentContent(item)['avt']} />
                                        </Box>
                                        <Box
                                            sx={{
                                                ...flexStyle('center', 'flex-start'),
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
                                                <Typography
                                                    sx={{
                                                        ...TEXT_STYLE.title1,
                                                        color: COLORS.white
                                                    }}
                                                >{commentContent(item)['name']}</Typography>
                                                <Typography
                                                    style={{
                                                        ...TEXT_STYLE.content1,
                                                        color: COLORS.VZ_Text_content,
                                                    }}
                                                >{item?.body}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: '40%'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content3,
                                                color: COLORS.contentIcon,
                                                textAlign: 'right',
                                                pl: isSm ? '46px' : 0
                                            }}
                                        >{item?.published_at}</Typography>
                                    </Box>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
            <Divider
                sx={{
                    background: COLORS.blackStroker,
                    m: '227px 50px 0 50px'
                }}
            />
        </Box >
    )
}
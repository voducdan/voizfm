// import MUI components
import {
    Box,
    Typography
} from '@mui/material';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

const h3 = {
    fontSize: '30px',
    lineHeight: '40px',
    fontWeight: 'bold',
    fontFamily: 'SF UI Display'
};
const h4 = {
    fontSize: '25px',
    lineHeight: '40px',
    fontWeight: 'bold',
    fontFamily: 'SF UI Display'
};

const content1 = {
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 500,
    fontFamily: 'SF UI Display'
}

const CustomBox = (props) => {
    const { imgSrc, content, len, colGap, isSm } = props
    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                flexDirection: 'column',
                rowGap: isSm ? '8px' : '20px',
                width: `calc(100% / ${len} - ${((len - 1) * colGap) / len}px)`,
                ...(!isSm && { bgcolor: COLORS.bg1, minHeight: '201px' })
            }}
        >
            <img src={imgSrc} alt={`${content} img`}></img>
            <Typography
                sx={{
                    width: isSm ? '100%' : '70%',
                    ...(isSm ? TEXT_STYLE.content2 : content1),
                    color: isSm ? COLORS.contentIcon : COLORS.white,
                    whiteSpace: 'break-spaces',
                    textAlign: 'center',
                }}
            >{content}</Typography>
        </Box>
    )
}

const vipItems = [
    {
        imgSrc: '/images/vipNonAds.png',
        content: 'Không quảng cáo'
    },
    {
        imgSrc: '/images/vipBadge.png',
        content: 'Huy hiệu VIP'
    },
    {
        imgSrc: '/images/vipCare.png',
        content: 'Chăm sóc riêng'
    },
    {
        imgSrc: '/images/vipHD.png',
        content: 'Chất lượng HD'
    },
    {
        imgSrc: '/images/vipGift.png',
        content: 'Quà tặng đặc biệt'
    },
    {
        imgSrc: '/images/vipNewsletter.png',
        content: 'Newsletter hằng tuần'
    }
]

export default function VipBenefit() {
    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    return (
        <Box
            sx={{
                bgcolor: COLORS.bg2,
                width: '100%',
                padding: isSm ? '31px 16px' : '80px 48px',
                boxSizing: 'border-box'
            }}
        >
            <Box>
                <Typography
                    sx={{
                        ...TEXT_STYLE.h1,
                        color: COLORS.white,
                        textAlign: 'center'
                    }}
                >Quyền lợi thành viên VIP</Typography>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    mt: isSm ? '17px' : '57px',
                    mb: isSm ? '35px' : '32px',
                    position: 'relative'
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        width: '100%',
                        flexWrap: 'wrap',
                        columnGap: isSm ? '17px' : '32px',
                        rowGap: isSm ? '17px' : '32px'
                    }}
                >
                    <Box
                        sx={{
                            width: isSm ? 'calc(50% - 8.5px)' : 'calc(50% - 16px)',
                            bgcolor: COLORS.bg1,
                            ...flexStyle('center', 'center')
                        }}
                    >
                        <Box
                            sx={{
                                margin: isSm ? '16px auto' : '48px auto',
                                textAlign: isSm ? 'center' : 'right'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >Nghe không giới hạn</Typography>
                            <span
                                style={{
                                    ...(isSm ? TEXT_STYLE.title4 : h3),
                                    color: COLORS.second,
                                    marginRight: '5px'
                                }}
                            >10.000+</span>
                            <Typography
                                sx={{
                                    display: 'inline',
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >nội dung</Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: isSm ? 'calc(50% - 8.5px)' : 'calc(50% - 16px)',
                            bgcolor: COLORS.bg1,
                            ...flexStyle('center', 'center')
                        }}
                    >
                        <Box
                            sx={{
                                margin: isSm ? '16px auto' : '48px auto',
                                textAlign: isSm ? 'center' : 'left'
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >Nhiều nội dung</Typography>
                            <span
                                style={{
                                    ...(isSm ? TEXT_STYLE.title4 : h3),
                                    color: COLORS.second
                                }}
                            >Độc quyền</span>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: isSm ? 'calc(50% - 8.5px)' : 'calc(50% - 16px)',
                            bgcolor: COLORS.bg1,
                            ...flexStyle('center', 'center')
                        }}
                    >
                        <Box
                            sx={{
                                margin: isSm ? '16px auto' : '48px auto',
                                textAlign: isSm ? 'center' : 'right'
                            }}
                        >
                            <span
                                style={{
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >Người</span>
                            <span
                                style={{
                                    ...(isSm ? TEXT_STYLE.title4 : h3),
                                    color: COLORS.second,
                                    marginLeft: '5px'
                                }}
                            >Đầu tiên</span>
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >nghe sách mới</Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            width: isSm ? 'calc(50% - 8.5px)' : 'calc(50% - 16px)',
                            bgcolor: COLORS.bg1,
                            ...flexStyle('center', 'center')
                        }}
                    >
                        <Box
                            sx={{
                                margin: isSm ? '16px auto' : '48px auto',
                                textAlign: isSm ? 'center' : 'left'
                            }}
                        >
                            <Typography
                                style={{
                                    ...(isSm ? TEXT_STYLE.title4 : h3),
                                    color: COLORS.second
                                }}
                            >-25%</Typography>
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.title1 : h4),
                                    color: COLORS.white
                                }}
                            >Khi mua sách lẻ</Typography>
                        </Box>
                    </Box>
                </Box>
                {
                    !isSm && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)'
                            }}
                        >
                            <img src="/images/vipBenefit.png" alt="img"></img>
                        </Box>
                    )
                }
                {
                    !isSm && (
                        <Box
                            sx={{
                                width: '265px',
                                height: '270px',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%,-50%)',
                                bgcolor: COLORS.main,
                                opacity: 0.4,
                                filter: 'blur(200px)'
                            }}
                        >
                        </Box>
                    )
                }

            </Box>
            <Box
                sx={{
                    width: '100%',
                    ...flexStyle('center', 'center'),
                    flexWrap: 'wrap',
                    columnGap: isSm ? '66px' : '24px',
                    rowGap: '25px'
                }}
            >
                {
                    vipItems.map((item, idx) => (
                        <CustomBox key={idx} imgSrc={item.imgSrc} content={item.content} len={isSm ? 3 : vipItems.length} colGap={isSm ? 66 : 24} isSm={isSm}></CustomBox>
                    ))
                }
            </Box>
        </Box >
    )
}
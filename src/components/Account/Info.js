// import redux
import { useSelector } from 'react-redux';

// import redux action
import { selectUser } from '../../redux/user';

// import MUI package 
import {
    Box,
    Avatar,
    Typography,
    Button
} from '@mui/material';

// import next link
import Link from 'next/link';

// Import icons
import {
    VipMedal,
    FreeMedal
} from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { SCREEN_BREAKPOINTS, COLORS, TEXT_STYLE } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

export default function Info() {

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const coverImgHeight = isSm ? 260 : 380;
    const infoPanelHeight = isSm ? 340 : 200;
    const accountData = useSelector(selectUser);

    const getRemainingDays = (accountData) => {
        if (!accountData) {
            return 0;
        }
        if (accountData?.plan_subscriptions && accountData?.plan_subscriptions.length > 0) {
            for (let i of accountData?.plan_subscriptions) {
                if (i?.remaining_day && i?.remaining_day > 0)
                    return i?.remaining_day;
            }
        }
        if (accountData.user_resource.remaining_seconds === 0 || accountData.user_resource.remaining_seconds) {
            return Math.floor(accountData.user_resource.remaining_seconds / 86400);
        }
        return Math.floor(accountData.user_resource.remaining_minutes / 1440);
    }

    return (
        <Box
            sx={{
                width: '95%',
                position: 'relative',
                marginBottom: '35px'
            }}
        >
            <Box
                sx={{
                    marginTop: isSm ? '182px' : `${coverImgHeight + 10 - (infoPanelHeight / 2)}px`,
                    backgroundColor: COLORS.bg2,
                    borderRadius: '30px'
                }}
            >
                <Box sx={{
                    padding: '20px',
                    ...(isSm ? {
                        ...flexStyle('center', 'flex-start'),
                        flexDirection: 'column'

                    } : {
                        ...flexStyle('flex-start', 'flex-start')
                    })
                }}>
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            width: isSm ? '100%' : '50%',
                            columnGap: isSm ? '26px' : '40px'
                        }}
                    >
                        <Box>
                            <Avatar
                                sx={{
                                    width: isSm ? '160px' : '120px',
                                    height: isSm ? '160px' : '120px'
                                }} alt="Remy Sharp" src={accountData?.avatar?.thumb_url}
                            />
                        </Box>
                        <Box
                            sx={{
                                ...flexStyle('center', 'flex-start'),
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                    color: COLORS.white,
                                    mb: isSm ? '16px' : '21px'
                                }}
                            >{`${accountData?.last_name} ${accountData?.first_name}`}</Typography>
                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'center'),
                                    columnGap: '18px',
                                    mb: isSm ? '16px' : '15px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                        color: COLORS.bg4
                                    }}
                                >ID: </Typography>
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                        color: COLORS.bg4
                                    }}
                                >{accountData?.introductory_code}</Typography>
                            </Box>

                            <Box
                                sx={{
                                    ...flexStyle('flex-start', 'center'),
                                    columnGap: '18px'
                                }}
                            >
                                {
                                    accountData?.promotion.toUpperCase().includes('VIP') && (
                                        <VipMedal />
                                    )
                                }
                                {
                                    accountData?.promotion.toUpperCase().includes('FREE') && (
                                        <FreeMedal />
                                    )
                                }
                                <Typography
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.content2),
                                        color: COLORS.contentIcon
                                    }}
                                >
                                    {`${accountData?.promotion?.toUpperCase()}`}{accountData?.promotion.toUpperCase().includes('VIP') ? ` (Còn ${getRemainingDays(accountData)} ngày)` : ''}
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                    <Box
                        sx={{
                            ...flexStyle('center', 'flex-end'),
                            flexDirection: 'column',
                            rowGap: '16px',
                            width: isSm ? '100%' : '50%',
                            ...(isSm && { marginTop: '40px' })
                        }}
                    >
                        {
                            accountData?.promotion.toUpperCase() !== 'VIP' && (
                                <Box
                                    sx={{
                                        width: '100%',
                                        maxWidth: '400px',
                                        paddingTop: '17px',
                                        paddingLeft: isSm ? '16px' : '37px',
                                        paddingBottom: '17px',
                                        paddingRight: '20px',
                                        ...flexStyle('space-between', 'center'),
                                        backgroundColor: COLORS.error,
                                        borderRadius: '6px',
                                        height: '60px',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.h3,
                                            color: COLORS.white
                                        }}
                                    >Nâng cấp thành viên</Typography>
                                    <Link
                                        href='/up-vip'
                                        style={{
                                            textDecoration: 'none'
                                        }}
                                    >
                                        <Button
                                            style={{
                                                color: COLORS.error,
                                                borderRadius: '20px',
                                                border: 'none',
                                                backgroundColor: COLORS.white,
                                                textTransform: 'none',
                                                ...TEXT_STYLE.title2
                                            }}
                                        >Nâng cấp
                                        </Button>
                                    </Link>
                                </Box>
                            )
                        }
                    </Box>
                </Box>
            </Box >

        </Box >
    )
}
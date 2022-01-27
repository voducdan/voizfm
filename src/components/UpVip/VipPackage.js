// import react
import { useState, useEffect } from 'react';

// import next router
import { useRouter } from 'next/router';

// import redux
import { useDispatch } from 'react-redux';

// Import redux reducer, actions
import { setItems } from '../../redux/payment';

// import MUI components
import {
    Box,
    Typography,
    Paper,
    Button,
    Divider
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatPrice from '../../utils/formatPrice';

// import services
import API from '../../services/api';

const VipPackageBenefitItem = (props) => {
    const { benefit, idx, isSm } = props;
    return (
        <Box
            sx={{
                ...flexStyle('center', 'center'),
                columnGap: isSm ? '6px' : '20px'
            }}
        >
            <CheckIcon sx={{ color: '#5EC174' }} />
            <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.caption10Regular : TEXT_STYLE.content1),
                    color: idx === 2 ? COLORS.second : COLORS.contentIcon
                }}
            >{benefit}</Typography>
        </Box >
    )
}

const VipPackageBaper = (props) => {
    const { data, idx, bgcolor, elevation, height, isSm, selectedPackage, handleSelectPackage } = props;
    return (
        <Paper
            onClick={() => { handleSelectPackage(idx) }}
            sx={{
                bgcolor: bgcolor,
                height: `${height}px`,
                borderRadius: '10px',
                ...(idx === selectedPackage && { border: '2px solid #F68C2D' })
            }}
            elevation={elevation}>
            {
                !isSm && (
                    <Typography
                        sx={{
                            ...TEXT_STYLE.h2,
                            color: COLORS.white,
                            textAlign: 'center',
                            mt: '26px'
                        }}
                    >{data.name}</Typography>
                )
            }
            {/* <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.title0),
                    color: COLORS.white,
                    textAlign: 'center',
                    mt: isSm ? '23px' : '32px'
                }}
            >{formatPrice(price)}đ</Typography> */}
            {/* <Typography
                sx={{
                    ...(isSm ? TEXT_STYLE.VZ_Text_content : TEXT_STYLE.h2),
                    color: isSm ? COLORS.white : COLORS.contentIcon,
                    textAlign: 'center',
                    mt: isSm ? '5px' : '16px'
                }}
            >{data.name}</Typography> */}
            <Divider
                sx={{
                    borderColor: COLORS.placeHolder,
                    margin: isSm ? '12px 8px' : '24px 52px'
                }}
            />
            <Box
                sx={{
                    ...flexStyle('center', 'flex-start'),
                    flexDirection: 'column',
                    rowGap: isSm ? '4px' : '9px',
                    ml: isSm ? '5%' : '10%',
                    mr: isSm ? '5%' : '10%',
                    mb: '22px'
                }}
            >
                {data.ui.text_top_description && (< VipPackageBenefitItem isSm={isSm} key={0} benefit={data.ui.text_top_description} idx={0} />)}
                {data.ui.text_middle_description && (< VipPackageBenefitItem isSm={isSm} key={1} benefit={data.ui.text_middle_description} idx={1} />)}
                {data.ui.text_bottom_description && (<VipPackageBenefitItem isSm={isSm} key={2} benefit={data.ui.text_bottom_description} idx={2} />)}
            </Box>
        </Paper>
    )
}


export default function VipPackage() {
    const api = new API();

    const windowSize = useWindowSize();
    const navigate = useRouter();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const [selectedPackage, setSelectedPackage] = useState(1);
    const [vipPackages, setVipPackages] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchVipPackages() {
            try {
                const res = await api.getVipPackage();
                const data = await res.data;
                if (data.error) {
                    // handle error, maybe redirect to error page
                    console.log(data.data);
                    return;
                }
                setVipPackages(data.data);
            }
            catch (err) {
                // handle error, maybe redirect to error page
                console.log(err);
            }
        }

        fetchVipPackages();
    }, []);

    const handleSelectPackage = (idx) => {
        setSelectedPackage(idx);
    };

    const handleRegisterVip = () => {
        const paymentData = {
            selectedItem: [{
                id: vipPackages[selectedPackage]['code'],
                name: vipPackages[selectedPackage]['name']
            }],
            discountCode: vipPackages[selectedPackage]['sale_code'] || null,
            package_type: 'plan_package'
        };
        dispatch(setItems(paymentData));
        navigate.push('/checkout');
    }

    return (
        <Box>
            <Box
                sx={{
                    pt: isSm ? '24px' : '32px',
                    mb: isSm ? '24px' : '62px'
                }}
            >
                <Typography
                    sx={{
                        ...TEXT_STYLE.h1,
                        color: COLORS.white,
                        textAlign: 'center'
                    }}
                >Các gói thành viên VIP</Typography>
            </Box>
            <Box
                sx={{
                    width: '100%',
                    padding: isSm ? '0 16px' : '0 49px',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                }}
            >
                <Box
                    sx={{
                        ...flexStyle('center', 'center'),
                        width: '100%',
                        '& > :not(style)': {
                            width: isSm ? 'calc(100% / 3)' : 'calc(100% / 4)',
                            maxHeight: 378
                        },
                    }}
                >
                    {
                        vipPackages.map((p, idx) => (
                            <VipPackageBaper
                                handleSelectPackage={handleSelectPackage}
                                isSm={isSm}
                                key={idx}
                                idx={idx}
                                bgcolor={idx === selectedPackage ? COLORS.bg3 : COLORS.bg2}
                                elevation={idx === selectedPackage ? 1 : 2}
                                height={isSm ? (idx === selectedPackage ? 202 : 194) : (idx === selectedPackage ? 378 : 348)}
                                data={p}
                                selectedPackage={selectedPackage}
                            />
                        ))
                    }
                </Box>

                <Button
                    onClick={handleRegisterVip}
                    sx={{
                        textTransform: 'none',
                        bgcolor: COLORS.error,
                        ...TEXT_STYLE.title1,
                        color: COLORS.white,
                        borderRadius: '8px',
                        height: '48px',
                        width: isSm ? '100%' : 'calc(100% / 4)',
                        margin: isSm ? '32px auto 32px auto' : '56px auto 32px auto'
                    }}
                >Đăng ký ngay
                </Button>

            </Box>
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center'
                }}
            >
                <Typography
                    sx={{
                        ...TEXT_STYLE.title1,
                        color: COLORS.white
                    }}
                >Nghe thoải mái *, trừ dần theo thực tế sử dụng</Typography>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.VZ_Text_content,
                        mt: '8px'
                    }}
                >Không tự động gia hạn, phù hợp cho người mới bắt đầu</Typography>
                <Typography
                    sx={{
                        ...TEXT_STYLE.content1,
                        color: COLORS.bg4,
                        mt: '40px',
                        mb: '80px',
                        textDecoration: 'underline'
                    }}
                >Hỗ trợ khi gặp vấn đề trong thanh toán</Typography>

            </Box>
        </Box>
    )
}
// import react
import { useState } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// Import redux reducer, actions
import { selectPaymentData, selectCart, setCart, setPaymentInfo } from '../../redux/payment';

// import next router
import { useRouter } from 'next/router';

// import MUI components
import {
    Typography,
    Box,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    ListItemButton,
    ListItemText,
    Collapse,
    Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// import icons
import { CartEmpty } from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatPrice from '../../utils/formatPrice';

// import service
import API from '../../services/api';

const paymentMethods = [
    // {
    //     code: 'credit_cart',
    //     name: 'Thẻ tín dụng/ thẻ ghi nợ',
    //     src: '/images/credit_card.png'
    // },
    // {
    //     code: 'atm',
    //     name: 'Thẻ ATM đã đăng ký Internet Banking',
    //     src: '/images/atm.png'
    // },
    {
        code: 'shopee',
        name: 'Shopee',
        src: '/images/shopee.jpg'
    },
    {
        code: 'momo',
        name: 'Ví Momo',
        src: '/images/momo.png'
    },
    {
        code: 'appota',
        name: 'Appota',
        src: '/images/appota.png'
    },
    // {
    //     code: 'zalopay',
    //     name: 'Ví Zalo Pay',
    //     src: '/images/zalopay.png'
    // },
    // {
    //     code: 'vnpay',
    //     name: 'Thanh toán qua VNPay QR Code',
    //     src: '/images/vnpay.png'
    // }
]


const RadioLable = (props) => {
    const { src, paymentMethod } = props;
    return (
        <Box
            sx={{
                ...flexStyle('flex-start', 'center'),
                columnGap: '16px'
            }}
        >
            <img
                style={{
                    maxWidth: '57px',
                    maxHeight: '41px'
                }}
                src={src} alt="payment img"
            />
            <Typography
                sx={{
                    ...TEXT_STYLE.content1,
                    color: COLORS.white
                }}
            >{paymentMethod}</Typography>
        </Box>
    )
}

export default function Checkout() {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const navigate = useRouter();
    const [expandBill, setExpandBill] = useState(false);
    const [isPaymentError, setIsPaymentError] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('shopee');
    const paymentData = useSelector(selectPaymentData);
    const cart = useSelector(selectCart);
    const dispatch = useDispatch();
    const {
        selectedItem,
        discountCode,
        package_type,
        totalPrice,
        finalPrice
    } = paymentData;

    const hanleExpandBill = () => {
        setExpandBill(!expandBill);
    }

    const onEditCart = () => {
        navigate.push('/cart');
    };

    const handleCheckout = async () => {
        try {
            const packageIds = selectedItem.map(i => i.id);
            const payload = {
                "discount_code": discountCode || null,
                "package_type": package_type,
                "package_id": packageIds,
                "platform_type": "website",
                "redirect_url": "https://voiz.vn/"
            }
            console.log(payload)
            const res = await api.payment(paymentMethod, payload);
            const data = await res.data;
            if (data.err) {
                setIsPaymentError(true);
                return;
            }
            const selectedItemId = selectedItem.map(i => i.id);
            const remainedItems = cart.filter(i => !selectedItemId.includes(i.id));
            dispatch(setCart([...remainedItems]));
            dispatch(setPaymentInfo({ ...data.data }));
            if (['momo', 'appota'].includes(paymentMethod)) {
                window.location = data.data.url;
                return;
            }
            navigate.push(`/payment/${paymentMethod}`, { replace: true });
        }
        catch (err) {
            console.log(err);
            setIsPaymentError(true);
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                padding: isSm ? 0 : '32px 48px',
                boxSizing: 'border-box'
            }}
        >
            <Typography
                sx={{
                    ...TEXT_STYLE.h2,
                    color: COLORS.white,
                    mb: '32px',
                    ...(isSm && { pt: '24px', pl: '16px' })
                }}
            >Thanh toán</Typography>
            {
                selectedItem.length > 0 && (
                    <Box
                        sx={{
                            ...flexStyle('flex-start', 'flex-start'),
                            width: '100%',
                            columnGap: '32px',
                            ...(isSm && {
                                flexDirection: 'column',
                                rowGap: '16px'
                            })
                        }}
                    >
                        <Box
                            sx={{
                                width: isSm ? '100%' : '70%',
                                bgcolor: COLORS.bg2,
                            }}
                        >
                            <Typography
                                sx={{
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    margin: '20px 0 20px 30px'
                                }}
                            >
                                Chọn hình thức thanh toán
                            </Typography>
                            <Divider
                                sx={{
                                    width: '100%',
                                    opacity: 0.5,
                                    borderBottomWidth: '0.6px',
                                    borderColor: COLORS.placeHolder
                                }} />
                            <FormControl
                                sx={{
                                    width: '100%',
                                    padding: isSm ? '0 16px 16px 16px' : '0 30px 30px 30px',
                                    boxSizing: 'border-box'
                                }}
                                component="fieldset"
                            >
                                <RadioGroup
                                    sx={{
                                        justifyContent: 'center',
                                        '& .MuiRadio-colorPrimary': {
                                            color: '#9B9B9B',
                                            ...(isSm && { pl: 0 })
                                        },
                                        '& .Mui-checked': {
                                            color: '#1976d2'
                                        }
                                    }}
                                >
                                    {
                                        paymentMethods.map(i => (
                                            <FormControlLabel
                                                key={i.code}
                                                onChange={() => { setPaymentMethod(i.code) }}
                                                sx={{
                                                    height: '80px',
                                                    borderBottom: `0.6px solid #443c3c`,
                                                    width: '100%',
                                                    margin: 0,
                                                }}
                                                checked={i.code === paymentMethod}
                                                value={i.code}
                                                control={<Radio />}
                                                label={<RadioLable src={i.src} paymentMethod={i.name}
                                                />}
                                            />
                                        ))
                                    }

                                </RadioGroup>
                            </FormControl>
                        </Box>
                        <Box
                            sx={{
                                width: isSm ? '100%' : '30%',
                                bgcolor: COLORS.bg2,
                                borderRadius: '10px',
                                padding: '32px',
                                boxSizing: 'border-box'
                            }}
                        >
                            <Box
                                sx={{
                                    borderBottom: '0.6px solid #595959'
                                }}
                            >
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'center'),
                                        pb: '16px'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            ...flexStyle('center', 'flex-start'),
                                            flexDirection: 'column',
                                            rowGap: '5px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.h3,
                                                color: COLORS.white
                                            }}
                                        >Đơn hàng</Typography>
                                        <Box
                                            sx={{
                                                ...flexStyle('flex-start', 'center'),
                                                columnGap: '8px'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content1,
                                                    color: COLORS.contentIcon
                                                }}

                                            >{selectedItem.length} sản phẩm</Typography>
                                            <ListItemButton
                                                sx={{
                                                    padding: 0
                                                }}
                                                onClick={hanleExpandBill}
                                            >
                                                <ListItemText
                                                    sx={{
                                                        ...TEXT_STYLE.content2,
                                                        color: COLORS.white
                                                    }}
                                                    primary={expandBill ? "Thu gọn" : "Xem thông tin"}
                                                />
                                                {expandBill ? <ArrowDropDownIcon sx={{ color: COLORS.white }} /> : <ArrowDropUpIcon sx={{ color: COLORS.white }} />}
                                            </ListItemButton>
                                        </Box>
                                    </Box>
                                    <Button
                                        onClick={onEditCart}
                                        sx={{
                                            textTransform: 'none',
                                            bgcolor: COLORS.bg3,
                                            ...TEXT_STYLE.title2,
                                            color: COLORS.contentIcon,
                                            borderRadius: '4px'
                                        }}
                                        startIcon={<EditIcon sx={{ color: COLORS.contentIcon }} />}
                                    >
                                        Sửa
                                    </Button>

                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    ...(expandBill && { borderBottom: '0.6px solid #595959' })
                                }}
                            >
                                <Collapse sx={{ mt: '16px' }} in={expandBill} timeout="auto" unmountOnExit>
                                    {
                                        selectedItem.map(i => (
                                            <Box
                                                key={i.id}
                                                sx={{
                                                    ...flexStyle('space-between', 'center'),
                                                    mb: '16px'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        ...TEXT_STYLE.content2,
                                                        color: COLORS.white
                                                    }}
                                                >{i.name}</Typography>
                                                {i.sale_coin_price && (<Typography
                                                    sx={{
                                                        ...TEXT_STYLE.content3,
                                                        color: COLORS.contentIcon
                                                    }}
                                                >{formatPrice(i.sale_coin_price)} xu</Typography>
                                                )}
                                            </Box>
                                        ))
                                    }
                                </Collapse>
                            </Box>
                            <Box
                                sx={{
                                    mt: '32px'
                                }}
                            >
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'center'),
                                        mb: '24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content1,
                                            color: COLORS.contentIcon
                                        }}
                                    >Số tiền</Typography>
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.title1,
                                            color: COLORS.white
                                        }}
                                    >{formatPrice(totalPrice)} xu</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'center'),
                                        mb: '24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content1,
                                            color: COLORS.contentIcon
                                        }}
                                    >Khuyến mãi</Typography>
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.title1,
                                            color: COLORS.white
                                        }}
                                    >{formatPrice(totalPrice - finalPrice)} xu</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'center'),
                                        mb: '24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content1,
                                            color: COLORS.contentIcon
                                        }}
                                    >Tổng cộng</Typography>
                                    <Box
                                        sx={{
                                            ...flexStyle('center', 'flex-end'),
                                            flexDirection: 'column',
                                            rowGap: '16px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.h2,
                                                color: COLORS.white
                                            }}
                                        >{formatPrice(finalPrice)} xu</Typography>
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.caption12,
                                                color: COLORS.white
                                            }}
                                        >Đã bao gồm VAT (nếu có)</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Button
                                sx={{
                                    width: '100%',
                                    textTransform: 'none',
                                    bgcolor: COLORS.main,
                                    ...TEXT_STYLE.title1,
                                    color: COLORS.white,
                                    height: '48px',
                                    borderRadius: '8px',
                                    mt: '24px'
                                }}
                                onClick={handleCheckout}
                            >
                                Thanh toán
                            </Button>
                        </Box>
                    </Box>
                )
            }
            {
                selectedItem.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            width: '100%',
                            mt: isSm ? '84px' : '145px'
                        }}
                    >
                        <CartEmpty bgfill='none' fill={COLORS.placeHolder} />
                        <Typography
                            sx={{
                                ...TEXT_STYLE.content1,
                                color: COLORS.contentIcon,
                                mt: '40px'
                            }}
                        >Không có sản phẩm nào để thanh toán</Typography>
                    </Box>
                )
            }
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={isPaymentError}
                onClose={() => { setIsPaymentError(false) }}
                message="Đã xảy ra lỗi trong quá trình thanh toán, vui lòng thử lại sau!"
                key='bottomcenter'
            />
        </Box>
    )
}
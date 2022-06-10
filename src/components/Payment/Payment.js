//import react
import { useState, useEffect } from 'react';

// import redux
import { useSelector, useDispatch } from 'react-redux';

// import next router
import { useRouter } from 'next/router';

// Import redux reducer, actions
import { selectPaymentInfo, setItems } from '../../redux/payment';
import { selectUser, setUser } from '../../redux/user';
import { setCart } from '../../redux/payment';

// import MUI components
import {
    Box,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography
} from '@mui/material';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE } from '../../utils/constants';
import formatPrice from '../../utils/formatPrice';

// import service
import API from '../../services/api';

const PaymentUI = (props) => {
    const { method, paymentInfo } = props;
    const api = new API();

    const navigate = useRouter();
    const [countDountStr, setCountDountStr] = useState('');
    const [isExpiry, setIsExpiry] = useState(false);
    const [isPaymentFinish, setIsPaymentFinish] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
    const [paymentInfoFromStorage, setPaymentInfoFromStorage] = useState({});
    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    useEffect(() => {
        if (paymentInfo) {
            setPaymentInfoFromStorage(paymentInfo);
        }
    }, [paymentInfo]);

    const countDownExpireTime = (expireTime) => {
        const x = setInterval(function () {
            var now = new Date().getTime();
            var distance = expireTime * 1000 - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance < 0) {
                clearInterval(x);
                setCountDountStr('');
                setIsExpiry(true);
                return;
            }

            const str = minutes + ":" + seconds;
            setCountDountStr(str);
        })
    }

    const removeCartItem = async () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem('localPaymentData'));
            if (cartItems.package_type === 'plan_package') {
                return;
            }
            let promises = [];
            for (let i of cartItems.selectedItem) {
                promises.push(api.removeCartItem(i.id));
            }

            await Promise.all(promises);
            const res = await api.getCart();
            const data = await res.data.data;
            dispatch(setCart([...data]));
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
                setPaymentStatusMessage(errMessage);
                return;
            }
            setPaymentStatusMessage(errList);
        }
    }

    const checkBillingStatus = async (payment_reference_id) => {
        const params = {
            payment_reference_id: payment_reference_id
        }
        try {
            const res = await api.checkBillingStatus(params);
            const data = await res.data.data;
            if (data.status === 1 || data.status === 3) {
                await removeCartItem();
                setIsPaymentFinish(true);
                setPaymentStatusMessage('Thanh toán thành công!');
                setPaymentStatus(data.status);
                localStorage.removeItem('paymentData');
                localStorage.removeItem('localPaymentData');
                return;
            }
            if (data.status === 6) {
                setIsPaymentFinish(true);
                setPaymentStatusMessage('Thanh toán không thành công, vui lòng thử lại!');
                setPaymentStatus(data.status);
                localStorage.removeItem('paymentData');
                localStorage.removeItem('localPaymentData');
                return;
            }
            if (data.status === 5 || data.status === 2) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                await checkBillingStatus(payment_reference_id);
            }
        }
        catch (err) {
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${key} ${value} \n`
                }
                setIsPaymentFinish(true);
                setPaymentStatusMessage(errMessage);
                return;
            }
            setIsPaymentFinish(true);
            setPaymentStatusMessage(errList);
        }
    }

    useEffect(() => {
        if (paymentInfo) {
            countDownExpireTime(paymentInfo.expiry_time);
            checkBillingStatus(paymentInfo.payment_reference_id);
            return;
        }
        const paymentData = localStorage.getItem('paymentData');
        if (paymentData) {
            const paymentDataObj = JSON.parse(paymentData);
            setPaymentInfoFromStorage(paymentDataObj);
            countDownExpireTime(paymentDataObj.expiry_time);
            checkBillingStatus(paymentDataObj.payment_reference_id);
            return;
        }
        navigate.push('/cart');
    }, []);

    const handleExpireTime = () => {
        navigate.push('/checkout');
    }

    const fetchUserInfo = async () => {
        const res = await api.getUserInfo();
        const data = await res.data.data;
        if (data.error) {
            return;
        }
        dispatch(setUser(data));
    }

    const handleFinishPayment = () => {
        if (paymentStatus === 1 || paymentStatus === 3) {
            setIsPaymentFinish(false);
            fetchUserInfo();
            dispatch(setItems({
                selectedItem: [],
                discountCode: '',
                totalPrice: 0,
                finalPrice: 0
            }));
            navigate.push('/cart');
            return;
        }
        if (paymentStatus === 6) {
            setIsPaymentFinish(false);
            navigate.push('/cart');
            return;
        }
        setIsPaymentFinish(false);
    }

    switch (method) {
        case 'shopee':
            return (
                <Box
                    sx={{
                        ...flexStyle('center', 'flex-start'),
                        flexDirection: 'column',
                        p: '32px 48px',
                        boxSizing: 'border-box'
                    }}
                >
                    <Box
                        sx={{
                            mb: '32px'
                        }}
                    >
                        <Typography
                            sx={{
                                ...TEXT_STYLE.h2,
                                color: COLORS.white
                            }}
                        >
                            Thanh Toán ShopeePay
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: '100%',
                            ...flexStyle('center', 'center'),
                            columnGap: '32px'
                        }}
                    >
                        <Box
                            sx={{
                                width: 'calc(60% - 16px)',
                                bgcolor: COLORS.bg2,
                                ...flexStyle('center', 'center'),
                                flexDirection: 'column',
                                height: '531px',
                                p: '40px 0',
                                boxSizing: 'border-box',
                                borderRadius: '10px'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    columnGap: '44px',
                                    mb: '30px'
                                }}
                            >
                                <img
                                    style={{
                                        height: '62px',
                                        width: '204px'
                                    }}
                                    src="/images/voizpaymentlogo.png"
                                    alt="voizpaymentlogo" />
                                <img
                                    style={{
                                        height: '80px',
                                        width: '181px'
                                    }}
                                    src="/images/shopeepayment.png"
                                    alt="shopeepayment" />
                            </Box>
                            <Box
                                sx={{
                                    mb: '40px',
                                    width: '80%',
                                    textAlign: 'center'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.title4,
                                        color: COLORS.white
                                    }}
                                >
                                    Sử Dụng &nbsp;
                                    <span
                                        style={{
                                            ...TEXT_STYLE.title4,
                                            color: COLORS.second
                                        }}
                                    >
                                        App Shopee Pay &nbsp;
                                    </span>
                                    Và Thực Hiện Quét Mã Để Thanh Toán
                                </Typography>
                            </Box>
                            <Box>
                                <img
                                    style={{
                                        maxWidth: '280px',
                                        maxHeight: '280px',
                                        width: '280px',
                                        height: '280px',
                                        objectFit: 'contain'
                                    }}
                                    src={paymentInfoFromStorage?.url || ''}
                                    alt="qrcode"
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: 'calc(40% - 16px)',
                                bgcolor: COLORS.bg2,
                                ...flexStyle('center', 'center'),
                                flexDirection: 'column',
                                height: '531px',
                                p: '0px 12px 40px 12px',
                                boxSizing: 'border-box',
                                borderRadius: '10px'
                            }}
                        >
                            <Box
                                sx={{
                                    height: 'calc(100% / 4)',
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    borderBottom: `1px solid ${COLORS.white}`,
                                    rowGap: '10px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h2,
                                        color: COLORS.white
                                    }}
                                >
                                    Giao dịch hết hạn sau
                                </Typography>
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h1,
                                        color: COLORS.second
                                    }}
                                >
                                    {countDountStr}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    height: 'calc(100% / 4)',
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    borderBottom: `1px solid ${COLORS.white}`,
                                    rowGap: '10px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h2,
                                        color: COLORS.white
                                    }}
                                >
                                    Giao dịch yêu cầu
                                </Typography>
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h1,
                                        color: '#C4C4C4'
                                    }}
                                >
                                    {Object.keys(paymentInfoFromStorage).length > 0 ? JSON.parse(paymentInfoFromStorage?.additional_info)['field1'] : ''}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    height: 'calc(100% / 4)',
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    borderBottom: `1px solid ${COLORS.white}`,
                                    rowGap: '10px'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h2,
                                        color: COLORS.white
                                    }}
                                >
                                    Đơn giá
                                </Typography>
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h1,
                                        color: COLORS.second
                                    }}
                                >
                                    {formatPrice(paymentInfoFromStorage?.amount)} {paymentInfoFromStorage?.currency}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    height: 'calc(100% / 4)',
                                    width: '100%',
                                    ...flexStyle('center', 'center'),
                                    flexDirection: 'column',
                                    borderBottom: `1px solid ${COLORS.white}`,
                                    rowGap: '10px',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h2,
                                        color: COLORS.white
                                    }}
                                >
                                    Mã giao dịch
                                </Typography>
                                <Typography
                                    sx={{
                                        ...TEXT_STYLE.h1,
                                        color: '#C4C4C4',
                                        textOverflow: 'ellipsis',
                                        wordBreak: 'break-all',
                                        textAlign: 'center'
                                    }}
                                >
                                    {paymentInfoFromStorage?.payment_reference_id}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Dialog
                        open={isPaymentFinish}
                        onClose={() => { setIsPaymentFinish(false) }}
                        PaperProps={{
                            style: {
                                backgroundColor: COLORS.bg1
                            }
                        }}
                    >
                        <DialogContent>
                            <DialogContentText
                                sx={{
                                    color: COLORS.white
                                }}
                            >
                                {paymentStatusMessage}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                ...flexStyle('center', 'center'),
                                'whiteSpace': 'pre-line'
                            }}
                        >
                            <Button
                                onClick={handleFinishPayment}
                                autoFocus>
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        open={isExpiry}
                        onClose={() => { setIsExpiry(false) }}
                        PaperProps={{
                            style: {
                                backgroundColor: COLORS.bg1
                            }
                        }}
                    >
                        <DialogContent>
                            <DialogContentText
                                sx={{
                                    color: COLORS.white
                                }}
                            >
                                Giao dịch đã hết hạn, vui lòng thanh toán lại
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions
                            sx={{
                                ...flexStyle('center', 'center'),
                                'whiteSpace': 'pre-line'
                            }}
                        >
                            <Button
                                onClick={handleExpireTime}
                                autoFocus>
                                Thanh toán lại
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            );
        default:
            return <img src={paymentInfo?.url || ''} alt="qrcode" />;
    }
}

export default function Payment() {

    const { method } = useRouter().query;
    const paymentInfo = useSelector(selectPaymentInfo);

    return (
        <PaymentUI method={method} paymentInfo={paymentInfo} />
    )
} 
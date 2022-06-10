// import react
import { useState, useEffect } from 'react';

// import next router
import { useRouter } from 'next/router';

// import redux
import { useDispatch, useSelector } from 'react-redux';

// Import redux reducer, actions
import { setItems, setCart, selectPaymentData, selectCart, setPaymentInfo } from '../../redux/payment';

// import MUI components
import {
    Typography,
    Box,
    MenuList,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Checkbox,
    Card,
    CardContent,
    CardMedia,
    FormControl,
    Select,
    InputBase,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

// import icons
import { CartEmpty, Trash } from '../../components/Icons/index';

// import utils
import { flexStyle } from '../../utils/flexStyle';
import { COLORS, TEXT_STYLE, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import formatPrice from '../../utils/formatPrice';
import convertSecondsToReadableString from '../../utils/convertSecondsToReadableString';
import { messages } from '../../utils/paymentCodeHandler';

// import service
import API from '../../services/api';

export default function Cart() {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;
    const navigate = useRouter();
    const paymentData = useSelector(selectPaymentData);
    const cart = useSelector(selectCart);
    const [selectedItem, setSelectedItem] = useState(paymentData.selectedItem);
    const [discountCode, setDiscountCode] = useState(paymentData.discountCode);
    const [isDiscountCodeValid, setIsDiscountCodeValid] = useState(true);
    const [checkDiscountCode, setCheckDiscountCode] = useState(false);
    const [isPaymentFinish, setIsPaymentFinish] = useState(false);
    const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [checkControl, setCheckControl] = useState({});
    const [checkAllControl, setCheckAllControl] = useState(false);
    const [confirmDeleteCartItemModal, setConfirmDeleteCartItemModal] = useState(false);
    const [fetchCartDone, setFetchCartDone] = useState(false);
    const [saleAmount, setSaleAmount] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        function initCheckControl(cart) {
            const init = {};
            cart.forEach(i => {
                const id = i.id;
                init[id] = false;
            })
            selectedItem.forEach(i => {
                const id = i.id;
                init[id] = true;
            })
            setCheckControl(init);
        }
        async function fetchCart(cb) {
            const res = await api.getCart();
            const data = await res.data.data;
            dispatch(setCart([...data]));
            setFetchCartDone(true);
            cb(data);
        }
        if (selectedItem.length === 1 && selectedItem[0].type === 'vip_package') {
            const tmpPaymentData = { ...paymentData };
            tmpPaymentData['selectedItem'] = [];
            dispatch(setItems({ ...tmpPaymentData }));
        }
        fetchCart(initCheckControl);
    }, []);

    useEffect(() => {
        const { resultCode, errorCode, partnerCode, vnp_BankTranNo, vnp_BankCode, vnp_ResponseCode } = navigate.query || {};
        let message = '';
        if (!resultCode && !vnp_ResponseCode && !errorCode) {
            return;
        }

        if (resultCode === '0' || vnp_ResponseCode === '00' || errorCode === '0') {
            removeCartItem();
            localStorage.removeItem('localPaymentData');
            localStorage.removeItem('paymentData');
        }
        if (!JSON.parse(localStorage.getItem('notified'))) {
            if ((vnp_BankTranNo && vnp_BankTranNo.startsWith('VNP')) || (vnp_BankCode && vnp_BankCode.startsWith('VNP'))) {
                message = messages['vnpay'][vnp_ResponseCode];
            }
            else if (partnerCode && partnerCode === 'APPOTAPAY') {
                message = messages['appota'][resultCode] || messages['appota'][errorCode]
            }
            else if (partnerCode && partnerCode.startsWith('MOMO')) {
                message = messages['momo'][resultCode]
            }
            setIsPaymentFinish(true);
            setPaymentStatusMessage(message);
            localStorage.setItem('notified', true);
        }
    }, [navigate.query]);

    useEffect(() => {
        setSelectedItem(paymentData.selectedItem);
        setDiscountCode(paymentData.discountCode);
    }, [paymentData]);

    useEffect(() => {
        function calculatePrice() {
            if (selectedItem.length > 0 && selectedItem[0].type !== 'vip_package') {
                const price = selectedItem.reduce((a, b) => ({ sale_price: (a.sale_price + b.sale_price) }), { sale_price: 0 })['sale_price'];
                setTotalPrice(price);
                setFinalPrice(price);
                return;
            }
            setTotalPrice(0);
            setFinalPrice(0);
        }
        calculatePrice();
    }, [selectedItem]);

    const removeCartItem = async () => {
        try {
            const cartItems = JSON.parse(localStorage.getItem('localPaymentData'));
            if (cartItems && cartItems.package_type === 'plan_package') {
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
            const errList = err?.response?.data?.error || err;
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

    const handleSelectAllItem = (event) => {
        const checked = event.target.checked;
        const checkAll = {};
        cart.forEach(i => {
            const id = i.id;
            checkAll[id] = checked;
        })
        if (checked) {
            setSelectedItem(cart);
        }
        else {
            setSelectedItem([]);
        }
        setCheckAllControl(checked);
        setCheckControl(checkAll);
    }
    const handleSelectCartItem = (event, id) => {
        const checked = event.target.checked;
        const copyCheckedControl = { ...checkControl };
        copyCheckedControl[id] = checked;
        setCheckControl(copyCheckedControl);
        if (checked) {
            const item = cart.filter(i => i.id === id);
            const currentSelect = [...selectedItem, ...item];
            const isCheckAll = currentSelect.length === cart.length;
            setCheckAllControl(isCheckAll);
            setSelectedItem(currentSelect);
        }
        else {
            const remainedItem = selectedItem.filter(i => i.id !== id);
            setSelectedItem(remainedItem);
            setCheckAllControl(false);
        }
    };

    const handlePayment = () => {
        const paymentData = {
            selectedItem: selectedItem,
            discountCode: discountCode,
            package_type: 'playlist',
            totalPrice: totalPrice,
            finalPrice: finalPrice,
            saleAmount: saleAmount,
        };
        dispatch(setItems(paymentData));
        navigate.push('/checkout');
    };

    const handleRemoveItem = async (id) => {
        // handle api call
        await api.removeCartItem(id);
        // handle remove item local
        const cartItems = [...cart];
        const remainedItems = cartItems.filter(i => i.id !== id);
        const remainedSelectedItems = selectedItem.filter(i => i.id !== id)
        dispatch(setCart([...remainedItems]));
        setSelectedItem([...remainedSelectedItems]);
    }

    const handleConfirmDeleteModalClose = () => {
        setConfirmDeleteCartItemModal(false);
    }

    const handleSubmitDeleteCartItem = async () => {
        const selectedItemId = selectedItem.map(i => i.id);
        // handle api call
        let promises = [];
        for (let i of selectedItemId) {
            let res = api.removeCartItem(i);
            promises.push(res);
        }
        await Promise.all(promises);
        // handle remove item in local
        const remainedItems = cart.filter(i => !selectedItemId.includes(i.id));
        dispatch(setCart([...remainedItems]));
        setSelectedItem([]);
        setConfirmDeleteCartItemModal(false);
    }

    const handleInputDiscountCode = (e) => {
        setDiscountCode(e.target.value.trim());
        setCheckDiscountCode(false);
    }

    const handleClickPlaylist = (id) => {
        navigate.push(`/play/${id}`)
    }

    const handleClickDeleteMultipleItem = () => {
        if (selectedItem.length === 0) {
            return;
        }
        setConfirmDeleteCartItemModal(true);
    }

    const handleValidateDiscountCode = async () => {
        try {
            if (!discountCode) {
                return;
            }
            // call api to validate
            const packageIds = selectedItem.map(i => i.id);
            const discountData = {
                package_id: packageIds,
                coupon_code: discountCode,
                package_type: 'playlist'
            }
            const res = await api.checkDiscountCode(discountData);
            const data = await res.data.data;
            const { amount, sale_amount } = data;
            setSaleAmount(sale_amount - amount);
            setTotalPrice(sale_amount);
            setFinalPrice(amount);
            setIsDiscountCodeValid(true);
        }
        catch (err) {
            setIsDiscountCodeValid(false);
        }
        setCheckDiscountCode(true);

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
                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                    color: COLORS.white,
                    mb: '32px',
                    ...(isSm && { pt: '24px', pl: '16px' })
                }}
            >Giỏ hàng</Typography>
            {
                cart.length > 0 && (
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
                                width: isSm ? '100%' : '70%'
                            }}
                        >
                            <MenuList
                                sx={{
                                    bgcolor: COLORS.bg2,
                                    boxSizing: 'border-box',
                                    borderRadius: '10px'
                                }}
                            >
                                <MenuItem
                                    sx={{
                                        ...(!isSm && { pl: '30px' })
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            'span': {
                                                p: 0
                                            }
                                        }}
                                    >
                                        <Checkbox checked={checkAllControl} onChange={handleSelectAllItem} sx={{ color: COLORS.contentIcon }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            'span': {
                                                ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                color: COLORS.contentIcon
                                            }
                                        }}
                                    >
                                        Chọn tất cả ({cart.length} sản phẩm)
                                    </ListItemText>
                                    <ListItemIcon
                                        onClick={handleClickDeleteMultipleItem}
                                        sx={{
                                            alignItems: 'center',
                                            columnGap: '14px',
                                        }}
                                    >
                                        <Trash />
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content1,
                                                color: COLORS.contentIcon
                                            }}
                                        >Xóa</Typography>
                                    </ListItemIcon>
                                </MenuItem>
                                <Divider sx={{ borderColor: COLORS.bg3 }} />
                                {
                                    cart.map((item) => (
                                        <MenuItem key={item.id}
                                            sx={{
                                                width: '100%',
                                                columnGap: '13px',
                                                ...(!isSm && { pl: '30px' })
                                            }}
                                        >
                                            {
                                                !isSm && (
                                                    <ListItemIcon
                                                        sx={{
                                                            maxWidth: '5%',
                                                            'span': {
                                                                p: 0
                                                            }
                                                        }}
                                                    >
                                                        <Checkbox
                                                            checked={checkControl[item.id] || false}
                                                            onChange={(event) => { handleSelectCartItem(event, item.id) }}
                                                            sx={{
                                                                color: COLORS.contentIcon
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                )
                                            }
                                            <Card
                                                sx={{
                                                    ...(isSm ? flexStyle('flex-start', 'flex-start') : flexStyle('flex-start', 'center')),
                                                    columnGap: isSm ? '8px' : '13px',
                                                    bgcolor: 'inherit',
                                                    boxShadow: 'none',
                                                    width: '75%'
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth: isSm ? '40%' : '100%',
                                                        height: '100%',
                                                        ...(isSm ? flexStyle('flex-start', 'center') : flexStyle('flex-start', 'flex-start')),
                                                        columnGap: '16px'
                                                    }}
                                                >
                                                    {isSm && (
                                                        <ListItemIcon
                                                            sx={{
                                                                width: '5%',
                                                                minWidth: '24px!important',
                                                                'span': {
                                                                    p: 0
                                                                }
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={checkControl[item.id] || false}
                                                                onChange={(event) => { handleSelectCartItem(event, item.id) }}
                                                                sx={{
                                                                    color: COLORS.contentIcon
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                    )}
                                                    <Box
                                                        sx={{
                                                            width: isSm ? '56px' : '83px',
                                                            height: isSm ? '56px' : '83px',
                                                            position: 'relative',
                                                            '&::before': {
                                                                content: item?.promotion.includes('vip') ? "url('/images/mvip.png')" : item?.promotion === 'coin' ? "url('/images/mcoin.png')" : "url('/images/mfree.png')",
                                                                position: 'absolute',
                                                                right: 0,
                                                                top: 0,
                                                                zIndex: 8
                                                            }
                                                        }}
                                                    >
                                                        <CardMedia
                                                            onClick={() => { handleClickPlaylist(item?.id) }}
                                                            component="img"
                                                            sx={{
                                                                width: '100%',
                                                                height: '100%',
                                                                borderRadius: '3px'
                                                            }}
                                                            image={item.avatar.thumb_url}
                                                            alt="Live from space album cover"
                                                        />
                                                    </Box>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        maxWidth: isSm ? '60%' : '70%'
                                                    }}
                                                >
                                                    <CardContent sx={{
                                                        ...flexStyle('center', 'flex-start'),
                                                        flexDirection: 'column',
                                                        flex: '1 0 auto',
                                                        rowGap: '6px',
                                                        ...(isSm && { p: 0 }),
                                                        ':last-child': {
                                                            pb: '16px'
                                                        }
                                                    }}
                                                    >
                                                        <Typography
                                                            onClick={() => { handleClickPlaylist(item?.id) }}
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.title1),
                                                                color: COLORS.white,
                                                                whiteSpace: 'break-spaces'
                                                            }}
                                                        >
                                                            {item.name}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2),
                                                                color: COLORS.contentIcon,
                                                                whiteSpace: 'break-spaces'
                                                            }}
                                                        >
                                                            Tác giả: {item?.author_string}
                                                        </Typography>
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.content3 : TEXT_STYLE.content2),
                                                                color: COLORS.contentIcon
                                                            }}
                                                        >
                                                            Thời lượng: {convertSecondsToReadableString(item.total_duration, 'short')}
                                                        </Typography>
                                                    </CardContent>
                                                </Box>
                                            </Card>
                                            <ListItemIcon
                                                // onClick={() => { console.log(1111) }}
                                                sx={{
                                                    alignItems: 'center',
                                                    width: '20%',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                {
                                                    item.sale_price === 'undefined' && (
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                                color: COLORS.white
                                                            }}
                                                        >{formatPrice(item.sale_price)}đ</Typography>
                                                    )
                                                }
                                                {
                                                    item.sale_price !== 'undefined' && (
                                                        <Typography
                                                            sx={{
                                                                ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                                color: COLORS.white
                                                            }}
                                                        >{formatPrice(item.pay_price)}đ</Typography>
                                                    )
                                                }
                                                <Box
                                                    onClick={() => { handleRemoveItem(item.id) }}
                                                >
                                                    <Trash />
                                                </Box>
                                            </ListItemIcon>
                                        </MenuItem>
                                    ))
                                }
                            </MenuList>
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
                            {
                                (selectedItem.length > 0 && selectedItem[0].type !== 'vip_package') && (
                                    <Box>
                                        <Typography
                                            sx={{
                                                ...(isSm ? TEXT_STYLE.title1 : TEXT_STYLE.h3),
                                                color: COLORS.white,
                                                mb: '32px',
                                                textAlign: 'left'
                                            }}
                                        >Thông tin đơn hàng</Typography>
                                        {/* <FormControl fullWidth>
                                            <Typography
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                    color: COLORS.contentIcon,
                                                    mb: '16px',
                                                    textAlign: 'left'
                                                }}
                                            >
                                                Bạn đang chọn gói VIP sau
                                            </Typography>
                                            <Select
                                                defaultValue={10}
                                                inputProps={{
                                                    name: 'package',
                                                    id: 'vip-package',
                                                }}
                                                onChange={() => { console.log(1) }}
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                                    color: COLORS.white,
                                                    '& .MuiOutlinedInput-input': {
                                                        padding: '14px'
                                                    },
                                                    '& .MuiSelect-icon': {
                                                        color: COLORS.VZ_Text_content
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.placeHolder,
                                                        height: '50px'
                                                    }
                                                }}
                                            >
                                                <MenuItem value={10}>Tiêu chuẩn</MenuItem>
                                                <MenuItem value={20}>Tiết kiệm</MenuItem>
                                                <MenuItem value={30}>VIP</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                        <Box
                                            sx={{
                                                mt: '24px',
                                                mb: '60px',
                                                ...flexStyle('space-between', 'center')
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
                                                    color: COLORS.contentIcon
                                                }}
                                            >Số tiền</Typography>
                                            <Typography
                                                sx={{
                                                    ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                                    color: COLORS.white
                                                }}
                                            >{formatPrice(totalPrice)}đ</Typography>
                                        </Box>
                                        <Paper
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                width: '100%',
                                                bgcolor: 'inherit',
                                                boxShadow: 'none',
                                                borderRadius: '4px',
                                                height: '50px'
                                            }}
                                        >
                                            <InputBase
                                                sx={{
                                                    ml: 1,
                                                    flex: 1,
                                                    ...TEXT_STYLE.content2,
                                                    color: COLORS.white,
                                                    margin: 0,
                                                    width: '80%',
                                                    border: `1px solid ${COLORS.placeHolder}`,
                                                    height: '50px',
                                                    borderTopLeftRadius: '4px',
                                                    borderBottomLeftRadius: '4px',
                                                    'input': {
                                                        padding: '13px 18px'
                                                    }
                                                }}
                                                value={discountCode}
                                                onChange={handleInputDiscountCode}
                                                placeholder="Nhập mã giảm giá (nếu có)"
                                                autoComplete="off"
                                                inputProps={{ 'aria-label': 'discount-code' }}
                                            />
                                            <Button
                                                onClick={handleValidateDiscountCode}
                                                sx={{
                                                    width: '20%',
                                                    textTransform: 'none',
                                                    bgcolor: COLORS.main,
                                                    ...TEXT_STYLE.title2,
                                                    color: COLORS.white,
                                                    height: '100%',
                                                    borderRadius: 0,
                                                    borderTopRightRadius: '4px',
                                                    borderBottomRightRadius: '4px',
                                                }}
                                            >Sử dụng</Button>
                                        </Paper>
                                        {
                                            checkDiscountCode && (
                                                <Box
                                                    sx={{
                                                        mt: '8px',
                                                        ...TEXT_STYLE.title2,
                                                        color: isDiscountCodeValid ? COLORS.white : COLORS.error,
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    Mã giảm giá&nbsp;
                                                    <span
                                                        style={{
                                                            fontWeight: '700!important',
                                                            ...TEXT_STYLE.title2,
                                                            color: isDiscountCodeValid ? COLORS.white : COLORS.error,
                                                            wordBreak: 'break-all'
                                                        }}
                                                    >
                                                        {discountCode}
                                                    </span>
                                                    &nbsp;{isDiscountCodeValid ? '' : 'không'} hợp lệ.
                                                </Box>
                                            )
                                        }
                                    </Box>
                                )
                            }

                            <Box>
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'center'),
                                        mt: '24px'
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
                                    >{formatPrice(saleAmount)}đ</Typography>
                                </Box>
                                <Box
                                    sx={{
                                        ...flexStyle('space-between', 'flex-start'),
                                        mt: isSm ? '35px' : '14px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...(isSm ? TEXT_STYLE.content2 : TEXT_STYLE.content1),
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
                                                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                                                color: COLORS.white
                                            }}
                                        >{formatPrice(finalPrice)}đ</Typography>
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.caption12,
                                                color: COLORS.white
                                            }}
                                        >Đã bao gồm VAT(nếu có)</Typography>
                                    </Box>
                                </Box>
                                <Button
                                    disabled={selectedItem.length === 0}
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
                                    onClick={handlePayment}
                                >
                                    {selectedItem.length > 0 ? 'Thanh toán' : 'Tiến hành thanh toán'}
                                </Button>
                                {
                                    selectedItem.length > 0 && (
                                        <a
                                            href='http://m.me/VoizFM'
                                            target='_blank'
                                        >
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.content2,
                                                    color: COLORS.white,
                                                    textAlign: isSm ? 'center' : 'right',
                                                    mt: '24px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Bạn có muốn chuyển khoản?
                                            </Typography>
                                        </a>
                                    )
                                }

                            </Box>
                        </Box>
                    </Box>
                )
            }

            {
                fetchCartDone && cart.length === 0 && (
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
                        >Không có quyển sách nào trong giỏ hàng</Typography>
                    </Box>
                )
            }
            <Dialog
                open={confirmDeleteCartItemModal}
                onClose={handleConfirmDeleteModalClose}
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
                <DialogTitle
                    sx={{
                        ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h1),
                        color: COLORS.white,
                        textAlign: 'center'
                    }}
                >
                    Voiz FM
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{
                            ...TEXT_STYLE.content1,
                            color: COLORS.contentIcon,
                            textAlign: 'center'
                        }}
                    >
                        Bạn có muốn xóa những sản phẩm này ra khỏi giỏ hàng?
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        ...flexStyle('center', 'center'),
                        columnGap: '16px'
                    }}
                >
                    <Button
                        onClick={handleConfirmDeleteModalClose}
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            borderRadius: '8px',
                            maxWidth: '192px',
                            width: 'calc(50% - 8px)',
                            height: '48px',
                            bgcolor: COLORS.bg3
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.white,
                            textTransform: 'none',
                            borderRadius: '8px',
                            maxWidth: '192px',
                            width: 'calc(50% - 8px)',
                            height: '48px',
                            bgcolor: COLORS.main
                        }}
                        onClick={handleSubmitDeleteCartItem}
                        autoFocus
                    >
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
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
                        onClick={() => { setIsPaymentFinish(false); }}
                        autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    )
}
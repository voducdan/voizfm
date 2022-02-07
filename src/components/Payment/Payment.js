
// import redux
import { useSelector } from 'react-redux';

// import next router
import { useRouter } from 'next/router';

// Import redux reducer, actions
import { selectPaymentInfo } from '../../redux/payment';

const PaymentUI = (props) => {
    const { method, paymentInfo } = props;
    switch (method) {
        case 'shopee':
            return <img src={paymentInfo?.url || ''} alt="qrcode" />;
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
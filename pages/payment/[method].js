// import reduc
import { Provider } from 'react-redux';
import store from '../../src/redux/store';

// import components
import Payment from '../../src/components/Payment/Payment';

const PaymentPage = () => {
    return (
        <Provider store={store}>
            <Payment />
        </Provider>
    )
}

export default PaymentPage
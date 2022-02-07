// import reduc
import { Provider } from 'react-redux';
import store from '../../src/redux/store';

// import components
import Checkout from '../../src/components/Payment/Checkout';

const CheckoutPage = () => {
    return (
        <Provider store={store}>
            <Checkout />
        </Provider>
    )
}

export default CheckoutPage
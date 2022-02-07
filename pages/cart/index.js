// import reduc
import { Provider } from 'react-redux';
import store from '../../src/redux/store';

// import components
import Cart from '../../src/components/Payment/Cart';

const CartPage = () => {
    return (
        <Provider store={store}>
            <Cart />
        </Provider>
    )
}

export default CartPage
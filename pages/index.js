import { Provider } from 'react-redux';

import Home from '../src/pages/Home/Home';

import store from '../src/redux/store';


function App() {
  return <Home />
}
export default () => (
  <Provider store={store}>
    <App />
  </Provider>
)

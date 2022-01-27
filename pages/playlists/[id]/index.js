
import { Provider } from 'react-redux';
import store from '../../../src/redux/store';

import PlaylistDetail from '../../../src/components/PlaylistDetail/PlaylistDetail'
export default function () {
    return (
        <Provider store={store}>
            <PlaylistDetail />
        </Provider>
    )
}
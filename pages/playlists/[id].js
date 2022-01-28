// import reduc
import { Provider } from 'react-redux';
import store from '../../src/redux/store';

// import components
import PlaylistDetail from '../../src/components/PlaylistDetail/PlaylistDetail'

// import service
import API from '../../src/services/api';

const PlaylistDetailPage = ({ playlist }) => {
    return (
        <Provider store={store}>
            <PlaylistDetail playlistFromAPI={playlist} />
        </Provider>
    )
}

export async function getServerSideProps(context) {
    const api = new API();
    const { params } = context;
    const res = await api.getPlaylistDetail(params.id);
    const playlist = res.data.data;
    return {
        props: { playlist }, // will be passed to the page component as props
    }
}

export default PlaylistDetailPage
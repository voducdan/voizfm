// import next
import Head from 'next/head';

// import reduc
import { Provider } from 'react-redux';
import store from '../../src/redux/store';

// import components
import PlaylistDetail from '../../src/components/PlaylistDetail/PlaylistDetail'

// import service
import API from '../../src/services/api';

const PlaylistDetailPage = ({ playlist }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <Provider store={store}>
            <Head>
                <title>{playlist?.name}</title>
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={playlist?.name} />
                <meta
                    property="og:description"
                    content={playlist?.description}
                />
                <meta property="og:image" content={playlist?.avatar?.thumb_url} />
                <meta property="og:image:width" content={playlist?.avatar?.width || 1200} />
                <meta property="og:image:height" content={playlist?.avatar?.height || 630} />
            </Head>
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
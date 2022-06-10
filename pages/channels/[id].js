// import next
import Head from 'next/head';

// import components
import ChannelDetail from '../../src/components/ChannelDetail/ChannelDetail'

// import service
import API from '../../src/services/api';

const ChannelDetailPage = ({ channel }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <div>
            <Head>
                <title>{channel?.name}</title>
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={channel?.name} />
                <meta
                    property="og:description"
                    content={channel?.description}
                />
                <meta property="og:image" content={channel?.avatar?.original_url} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
            </Head>
            <ChannelDetail channelFromAPI={channel} />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { token } = context.req.cookies;
    const api = new API(token);
    const { params } = context;
    const res = await api.getChannel(params.id);
    const channel = res.data.data;
    return {
        props: { channel }
    }
}


export default ChannelDetailPage
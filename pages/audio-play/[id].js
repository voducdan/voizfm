// import next
import Head from 'next/head';

// import components
import AudioPlay from '../../src/components/AudioPlay/AudioPlay';

// import service
import API from '../../src/services/api';

const AudioPlayPage = ({ audio }) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return (
        <div>
            <Head>
                <title>{audio?.name}</title>
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={audio?.name} />
                <meta
                    property="og:description"
                    content={audio?.description}
                />
                <meta property="og:image" content={audio?.avatar?.original_url} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
            </Head>
            <AudioPlay audio={audio} />
        </div>
    )
}

export async function getServerSideProps(context) {
    const api = new API();
    const { params } = context;
    const res = await api.getAudio(params.id);
    const audio = await res.data.data;
    return {
        props: { audio }
    }
}


export default AudioPlayPage
// import components
import DiscoveryDetail from '../../src/components/Discovery/DiscoveryDetail'

// import service
import API from '../../src/services/api';

const DiscoveryDetailPage = ({ discovery }) => {
    return (
        <DiscoveryDetail discovery={discovery} />
    )
}

export async function getServerSideProps(context) {
    const api = new API();

    const pageLimit = 10;
    const { params } = context;
    const res = await api.getDiscovery(params.id, 0, pageLimit);
    const discovery = await res.data.data;
    return {
        props: { discovery }
    }
}


export default DiscoveryDetailPage
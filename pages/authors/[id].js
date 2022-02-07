import Author from '../../src/components/Author/Author';

// import service
import API from '../../src/services/api';

function AuthorPage({ author }) {
    return (
        <Author author={author} />
    )
}

export async function getServerSideProps(context) {
    const api = new API();
    const { params } = context;
    const res = await api.getAuthor(params.id);
    const author = res.data.data;
    return {
        props: { author }
    }
}

export default AuthorPage
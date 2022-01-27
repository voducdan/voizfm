import '../styles/App.css'
import '../styles/index.css'
import '../styles/PlaylistDetail.css'
import '../styles/style.css'
import '../styles/swiperPaginationStyle.css'
import '../node_modules/swiper/swiper.scss'; // core Swiper
import '../node_modules/swiper/modules/navigation/navigation.scss'; // Navigation module
import '../node_modules/swiper/modules/pagination/pagination.scss';

import Layout from '../src/components/Layout/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp;

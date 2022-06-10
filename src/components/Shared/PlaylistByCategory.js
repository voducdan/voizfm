// import next link
import Link from 'next/link';

// import MUI components
import {
    Typography,
    Box
} from '@mui/material';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import others components
import Thumbnail from '../../components/Thumbnail/Thumbnail';

// import icons
import { RightArrow } from '../../components/Icons/index';

// import utils
import { TEXT_STYLE, COLORS } from '../../utils/constants';
import { flexStyle } from '../../utils/flexStyle'


const Title = (props) => {
    const { isSm, content, haveArrow } = props
    return (
        < Box sx={{
            ...flexStyle('flex-start', 'center'),
            marginBottom: '24px'
        }}>
            <Typography sx={{
                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                color: COLORS.white
            }}>
                {content}
            </Typography>
            {
                haveArrow && (
                    <Box sx={{ marginLeft: '11.3px', marginTop: '6px' }}>
                        <RightArrow fill={COLORS.white} />
                    </Box>
                )
            }

        </ Box >
    )
}

SwiperCore.use([Navigation]);

export default function PlaylistByCategory(props) {
    const { i, playlistImgWidth, isSm } = props;
    const numItemsPerLine = isSm ? 2.5 : 5;
    return (
        <Box>
            {<Title content={i.name} isSm={isSm} haveArrow={true} />}
            <Swiper slidesPerView={numItemsPerLine} spaceBetween={24}
                style={{ marginBottom: isSm ? 35 : 56 }}
            >
                {i.data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Link
                            href={`/play/${item.id}`}
                        >
                            <a>
                                <Thumbnail style={{ width: `100%`, height: `${playlistImgWidth}px`, borderRadius: 3 }} avtSrc={item.avatar.thumb_url} alt={`images ${item.name}`} promotion={item?.promotion || ''} />
                            </a>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}
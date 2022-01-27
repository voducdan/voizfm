// import react
import { useRef, useState, useEffect } from 'react';

// import next link
import Link from 'next/link';

// import MUI components
import { styled } from '@mui/material/styles';
import {
    Typography,
    Box
} from '@mui/material';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';

// import others components
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import CategoryBar from '../../components/Shared/CategoryBar';
import PublisherComponent from '../../components/Shared/PublisherComponent';

// import icons
import { RightArrow, CarouselPrev, CarouselNext } from '../../components/Icons/index';

// import utils
import { SCREEN_BREAKPOINTS, TEXT_STYLE, FONT_FAMILY, COLORS, DRAWER_WIDTH } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';
import { flexStyle } from '../../utils/flexStyle'

// import services
import API from '../../services/api'

SwiperCore.use([Navigation]);

const SwiperBtnNext = (props) => {
    const { isSm } = props;
    return {
        position: 'absolute',
        right: 0,
        width: '24px',
        height: '24px',
        top: '50%',
        transform: 'translate(-40px, 70%)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

const SwiperBtnPrev = (props) => {
    const { isSm } = props
    return {
        position: 'absolute',
        left: 0,
        width: '24px',
        height: '24px',
        top: '50%',
        transform: 'translate(28px, 70%)',
        zIndex: 2,
        ...(isSm && { display: 'none' })
    }
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    () => ({})
);

const Title = (props) => {
    const { isSm, content } = props
    return (
        < Box sx={{
            ...flexStyle('flex-start', 'center'),
            marginBottom: '24px'
        }}>
            <Typography sx={{
                ...(isSm ? TEXT_STYLE.h3 : TEXT_STYLE.h2),
                fontFamily: FONT_FAMILY,
                color: COLORS.white
            }}>
                {content}
            </Typography>
            <Box sx={{ marginLeft: '11.3px', marginTop: '6px' }}>
                <RightArrow fill={COLORS.white} />
            </Box>
        </ Box >
    )
}

const CATEGORIES_LEVEL1 = [
    {
        code: 'audio_book',
        name: 'Sách nói chất lượng'
    },
    {
        code: 'story_book',
        name: 'Truyện nói hấp dẫn'
    },
    {
        code: 'podcast',
        name: 'Podcast đặc sắc'
    },
    {
        code: 'summary_book',
        name: 'Sách tóm tắt tinh gọn'
    },
    {
        code: 'children_book',
        name: 'Thiếu nhi'
    }
]
const CATEGORIES_LEVEL2 = [
    {
        code: 'audio_book',
        name: 'Tin tức'
    },
    {
        code: 'tin_tuc',
        name: 'Giải trí'
    },
    {
        code: 'tam_linh',
        name: 'Bình an tâm hồn'
    },
    {
        code: 'thanh_cong',
        name: 'Phát triển bản thân'
    },
    {
        code: 'kinh_dien_viet_nam',
        name: 'Việt nam danh tác'
    },
    {
        code: 'lich_su',
        name: 'Dân ta phải biết sử ta'
    },
    {
        code: 'coming_soon',
        name: 'Sắp phát hành'
    }
]

export default function HomeContent() {
    const api = new API();

    const windowSize = useWindowSize();
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    const [randomPlaylists, setRandomPlaylists] = useState([]);
    const [playlistsBycategory, setPlaylistsBycategory] = useState([]);
    const [playlistsBycategoryLevel2, setPlaylistsBycategoryLevel2] = useState([]);
    const [newContents, setNewContents] = useState([]);
    const [featuredsAuthors, setFeaturedAuthors] = useState([]);

    const navigationNewContentPrevRef = useRef(null);
    const navigationNewContentNextRef = useRef(null);

    const NUMBER_ITEMS_PER_LINE = !isSm ? 5 : 2.5;
    const SPACE_BETWEEN = isSm ? 8 : 20;
    const SIDE_PADDING = isSm ? 20 : 48;

    useEffect(() => {
        async function fetchRandomPlaylists() {
            const res = await api.getPlaylistsRandom();
            const data = await res.data.data;
            setRandomPlaylists(data);
        }

        async function fetchNewContent() {
            const res = await api.getHomeNewContent();
            const data = await res.data.data;
            setNewContents(data);
        }

        async function fetchFeaturedAuthors(page = 1, limit = 10) {
            const res = await api.getFeaturedAuthors(page, limit);
            const data = await res.data.data;
            setFeaturedAuthors(data);
        }

        async function fetchCategoryLevel1Playlists() {
            let playlists = [];
            for (let category of CATEGORIES_LEVEL1) {
                let playlistsByOneCategory = {
                    code: category.code,
                    name: category.name
                }
                const resPlaylist = api.getCategoryPlaylists(category.code);
                const resCategoryLevel2 = api.getCategories(category.code);
                const res = await Promise.all([resPlaylist, resCategoryLevel2]);
                playlistsByOneCategory['data'] = await res[0].data.data;
                playlistsByOneCategory['categories'] = await res[1].data.data;
                playlists.push(playlistsByOneCategory)
            }
            setPlaylistsBycategory(playlists);
        }

        async function fetchCategoryLevel2Playlists() {
            let playlists = [];
            for (let category of CATEGORIES_LEVEL2) {
                let playlistsByOneCategory = {
                    code: category.code,
                    name: category.name
                }
                const res = await api.getCategoryPlaylists(category.code);
                const data = await res.data.data;
                playlistsByOneCategory['data'] = data;
                playlists.push(playlistsByOneCategory)
            }
            setPlaylistsBycategoryLevel2(playlists);
        }

        fetchFeaturedAuthors();
        fetchNewContent();
        fetchCategoryLevel1Playlists();
        fetchCategoryLevel2Playlists();
        fetchRandomPlaylists();
    }, []);

    const onSelectCategory = async (parent, code) => {
        const tmpPlaylists = playlistsBycategory;
        const parentIdx = playlistsBycategory.findIndex(i => i.code === parent);
        const res = await api.getCategoryPlaylists(code);
        const data = await res.data.data;
        tmpPlaylists[parentIdx]['data'] = data;
        setPlaylistsBycategory([...tmpPlaylists]);
    }

    const getPlaylistImgWidth = () => {
        const width = windowSize.width;
        let innerWidth = width - SIDE_PADDING * 2;
        const spaceToBeSubstrcted = ((NUMBER_ITEMS_PER_LINE - 1) * SPACE_BETWEEN) / NUMBER_ITEMS_PER_LINE;
        if (!isSm) {
            innerWidth -= DRAWER_WIDTH;
        }
        return (innerWidth / NUMBER_ITEMS_PER_LINE) - spaceToBeSubstrcted;
    }


    return (
        <Main>
            <HomeCarousel isSm={isSm}></HomeCarousel>
            <Box sx={{
                m: isSm ? '40px 20px' : '56px 48px'
            }}>
                {<Title content="Gợi ý cho người chưa bắt đầu" isSm={isSm} />}
                <Swiper slidesPerView={NUMBER_ITEMS_PER_LINE} spaceBetween={SPACE_BETWEEN} style={{ marginTop: 35, height: `${getPlaylistImgWidth()}px` }}>
                    {randomPlaylists.map(item => (
                        <SwiperSlide key={item?.id}>
                            <Link href={`/playlists/${item?.id}`}>
                                <a>
                                    <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item?.id}`} promotion={item?.promotion || ''} />
                                </a>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            {
                playlistsBycategory.map(data => (
                    <Box
                        sx={{
                            margin: isSm ? `0 ${SIDE_PADDING}px 56px ${SIDE_PADDING}px` : `0 ${SIDE_PADDING}px 56px ${SIDE_PADDING}px`
                        }}
                        key={data.code}
                    >
                        {<Title content={data.name} isSm={isSm} />}
                        {data?.categories && <CategoryBar categoryList={data.categories} isSm={isSm} active={0} onSelectCategory={onSelectCategory} parent={data.code} />}
                        <Swiper slidesPerView={NUMBER_ITEMS_PER_LINE} spaceBetween={SPACE_BETWEEN}
                            style={{ marginTop: !isSm ? 35 : 20, height: `${getPlaylistImgWidth()}px` }}
                        >
                            {data.data.map((item) => (
                                <SwiperSlide key={item?.id}>
                                    <Link href={`/playlists/${item?.id}`}>
                                        <a>
                                            <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item?.id}`} promotion={item?.promotion || ''} />
                                        </a>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                ))
            }
            <Box
                sx={{
                    p: isSm ? '32px 20px 23px 20px' : '32px 48px 23px 48px',
                    backgroundColor: COLORS.bg2,
                    position: 'relative'
                }}>
                {<Title content="Nội dung mới cho bạn" isSm={isSm} />}
                <Swiper

                    navigation={{
                        prevEl: navigationNewContentPrevRef.current,
                        nextEl: navigationNewContentNextRef.current
                    }}
                    onBeforeInit={(swiper) => {
                        swiper.params.navigation.prevEl = navigationNewContentPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNewContentNextRef.current;
                    }}
                    slidesPerView={NUMBER_ITEMS_PER_LINE} spaceBetween={SPACE_BETWEEN}
                    style={{
                        height: `${getPlaylistImgWidth()}px`
                    }}
                >
                    {newContents.map((item) => (
                        <SwiperSlide key={item.id} >
                            <Link href={`/playlists/${item?.id}`}>
                                <a>
                                    <Thumbnail style={{ borderRadius: '6px', width: '100%', height: '100%' }} avtSrc={item.avatar?.thumb_url} alt={`images ${item?.id}`} promotion={item?.promotion || ''} />
                                </a>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div style={{
                    ...SwiperBtnPrev({ isSm })
                }} ref={navigationNewContentPrevRef} ><CarouselPrev></CarouselPrev></div>
                <div style={{
                    ...SwiperBtnNext({ isSm })
                }} ref={navigationNewContentNextRef} > <CarouselNext></CarouselNext></div>
            </Box>

            <Box sx={{
                m: isSm ? '40px 20px' : '60px 48px'
            }}>
                {<Title content="Tác giả nổi bật" isSm={isSm} />}
                <Swiper
                    slidesPerView={NUMBER_ITEMS_PER_LINE}
                    spaceBetween={SPACE_BETWEEN}
                >
                    {featuredsAuthors.map((item) => (
                        <SwiperSlide
                            style={{
                                ...flexStyle('center', 'center'),
                                flexDirection: 'column'
                            }}
                            key={item.id}
                        >
                            <Link href={`/authors/${item?.id}`} style={{ textDecoration: 'none' }}>
                                <Box
                                    sx={{
                                        textAlign: 'center'
                                    }}
                                >
                                    <Thumbnail style={{ borderRadius: '50%', width: '80%', height: '80%' }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item?.id}`} promotion={item?.promotion || ''} />
                                    <Typography sx={{
                                        ...(!isSm ? TEXT_STYLE.title1 : TEXT_STYLE.title3),
                                        color: COLORS.white,
                                        letterSpacing: 0,
                                        marginTop: '22px'
                                    }}>{item?.name}</Typography>
                                    <Typography sx={{
                                        ...(!isSm ? TEXT_STYLE.VZ_Caption_2 : TEXT_STYLE.caption10Regular),
                                        color: COLORS.VZ_Text_content,
                                        display: '-webkit-box',
                                        marginTop: '8px',
                                        textOverflow: 'ellipsis',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>{item?.description}
                                    </Typography>
                                </Box>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Box>
            {
                playlistsBycategoryLevel2.map(data => (
                    <Box
                        sx={{
                            margin: isSm ? `0 ${SIDE_PADDING}px 56px ${SIDE_PADDING}px` : `0 ${SIDE_PADDING}px 56px ${SIDE_PADDING}px`
                        }}
                        key={data.code}
                    >
                        {<Title content={data.name} isSm={isSm} />}
                        <Swiper slidesPerView={NUMBER_ITEMS_PER_LINE} spaceBetween={SPACE_BETWEEN}
                            style={{ marginTop: !isSm ? 35 : 20, height: `${getPlaylistImgWidth()}px` }}
                        >
                            {data.data.map((item) => (
                                <SwiperSlide key={item?.id}>
                                    <Link href={`/playlists/${item?.id}`}>
                                        <a>
                                            <Thumbnail style={{ width: '100%', height: '100%', borderRadius: 3 }} avtSrc={item?.avatar?.thumb_url} alt={`images ${item?.id}`} promotion={item?.promotion || ''} />
                                        </a>
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </Box>
                ))
            }
            <PublisherComponent isSm={isSm} />
        </Main >
    )
}
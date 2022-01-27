// import react
import { useState, useEffect } from 'react';

// import next link
import Link from 'next/link';

// import MUI components
import {
    Box,
    Stack,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    Divider,
    Avatar,
} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';

// import others components
import CategoryBar from '../../components/Shared/CategoryBar';

// import utils
import { flexStyle } from '../../utils/flexStyle'
import { TEXT_STYLE, COLORS, SCREEN_BREAKPOINTS } from '../../utils/constants';
import useWindowSize from '../../utils/useWindowSize';

// import service
import API from '../../services/api';

const DiscoveryItem = (props) => {
    const { isSm, discoveryList, idx } = props;
    return (
        <Box>
            <Masonry
                columns={isSm ? 1 : 3}
                spacing={isSm ? 0 : 4}
                sx={{
                    alignContent: 'flex-start',
                    overflow: 'hidden',
                    margin: 0
                }}
            >
                {discoveryList.map((item, index) => (
                    <Stack key={index} key={item.id}>
                        <Link
                            href={`/discoveries/${item.id}`}
                            key={idx}
                            style={{
                                textDecoration: 'none'
                            }}
                        >
                            <Card
                                sx={{
                                    bgcolor: COLORS.bg2,
                                    margin: '8px 0'
                                }}>
                                <Box
                                    sx={{
                                        ...flexStyle('flex-start', 'center'),
                                        columnGap: '16px',
                                        margin: '24px'
                                    }}
                                >
                                    <Box>
                                        <Avatar
                                            alt={`${item.channel.name} alt`}
                                            src={item.channel.avatar.thumb_url}
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            ...flexStyle('center', 'flex-start'),
                                            flexDirection: 'column',
                                            rowGap: '6px'
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.title1,
                                                color: COLORS.white
                                            }}
                                        >{item.channel.name}</Typography>
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content3,
                                                color: COLORS.contentIcon
                                            }}
                                        >{item.published_at}</Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ border: `1px solid ${COLORS.blackStroker}`, margin: 'auto 24px' }} />
                                <CardContent
                                    sx={{
                                        padding: '16px 0',
                                        margin: '0 24px'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...TEXT_STYLE.content2,
                                            color: COLORS.contentIcon,
                                            mb: '16px'
                                        }}
                                    >
                                        {item.summary}
                                    </Typography>
                                    {
                                        item.channel.tags && item.channel.tags.map((i, idx) => (
                                            <span
                                                key={idx}
                                                style={{
                                                    ...TEXT_STYLE.h3,
                                                    color: COLORS.white,
                                                    marginRight: '5px'
                                                }}
                                            >
                                                #{i}
                                            </span>
                                        ))
                                    }
                                    {
                                        item.title && (
                                            <Typography
                                                sx={{
                                                    ...TEXT_STYLE.h3,
                                                    color: COLORS.white
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                        )
                                    }
                                </CardContent>
                                <CardMedia
                                    component="img"
                                    image={`${item.image.thumb_url}`}
                                    alt="img"
                                />
                                <CardActions
                                    sx={{
                                        justifyContent: 'space-between',
                                        margin: '15px 24px',
                                        padding: 0
                                    }}
                                >
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: '9px'
                                        }}
                                    >
                                        <CommentIcon sx={{ color: COLORS.white }} />
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content2,
                                                color: COLORS.white
                                            }}
                                        >
                                            {item.discovery_counter.comments_count} góp ý
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            ...flexStyle('flex-start', 'center'),
                                            columnGap: '9px'
                                        }}
                                    >
                                        <ThumbUpAltIcon sx={{ color: COLORS.white }} />
                                        <Typography
                                            sx={{
                                                ...TEXT_STYLE.content2,
                                                color: COLORS.white
                                            }}
                                        >
                                            {item.discovery_counter.likes_count} thích
                                        </Typography>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Link>

                    </Stack>
                ))}
            </Masonry>
        </Box>
    )
}

export default function DiscoveryContent() {
    const windowSize = useWindowSize();
    const [categoryList, setCategoryList] = useState([]);
    const [discoveryList, setDiscoveryList] = useState([]);
    const [showedDiscoveryList, setShowedDiscoveryList] = useState([]);
    const isSm = windowSize.width <= SCREEN_BREAKPOINTS.sm ? true : false;

    useEffect(() => {
        function getChannelFromDiscovery(data) {
            const arrayUniqueByKey = [...new Map(data.map(item =>
                [item['channel']['id'], { code: item['channel']['id'], name: item['channel']['name'] }])).values()];
            return arrayUniqueByKey
        };

        async function fetchDiscoveries() {
            const api = new API();
            const res = await api.getDiscoveries();
            const data = await res.data.data;
            const categories = getChannelFromDiscovery(data);
            setDiscoveryList(data);
            setShowedDiscoveryList(data);
            setCategoryList([...categories]);
        }

        fetchDiscoveries()
    }, []);

    const onSelectCategory = async (parent, code) => {
        if (code === '') {
            setShowedDiscoveryList([...discoveryList]);
        }
        else {
            const tmpPlaylists = discoveryList.filter(i => i.channel.id === Number(code));
            setShowedDiscoveryList([...tmpPlaylists]);
        }
    }

    return (
        <Box
            sx={{
                margin: isSm ? '0 16px' : '0 48px 0 48px'
            }}
        >
            <Box
                sx={{
                    pt: '5px'
                }}
            >
                {categoryList.length > 0 && (<CategoryBar categoryList={categoryList} isSm={isSm} parent='' onSelectCategory={onSelectCategory} />)}
            </Box>
            <Divider sx={{ borderColor: COLORS.bg2, margin: '28px 0' }} />
            {showedDiscoveryList.length > 0 && (<DiscoveryItem isSm={isSm} discoveryList={showedDiscoveryList} />)}
        </Box>
    )
}
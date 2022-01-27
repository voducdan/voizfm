//import react 
import { useState } from 'react';

// import MUI components
import {
    Typography,
    Box
} from '@mui/material';

// import swiper
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from '../../../node_modules/swiper/react/swiper-react.js';


// import utils
import { TEXT_STYLE, COLORS } from '../../utils/constants'

SwiperCore.use([Navigation]);

export default function CategoryBar(props) {
    const { parent, categoryList, isSm, onSelectCategory } = props
    const [activeCategory, setActiveCategory] = useState(parent);
    const newCategoryList = [
        {
            code: parent,
            name: "Tất cả",
            sub_name: null
        },
        ...categoryList
    ]

    const handleSelectCategory = (e) => {
        const channeId = e.currentTarget.id;
        setActiveCategory(channeId);
        onSelectCategory(parent, channeId);
    }

    return (
        <Box>
            <Swiper
                slidesPerView='auto'
                spaceBetween={isSm ? 20 : 40}
                style={{
                    marginTop: isSm ? 20 : 35
                }}
            >
                {newCategoryList.map(item => (
                    <SwiperSlide
                        key={item?.code}
                        style={{
                            width: 'auto'
                        }}
                    >
                        {
                            (String(item?.code) !== activeCategory) && (
                                <Typography
                                    id={item?.code}
                                    onClick={handleSelectCategory}
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                        color: COLORS.VZ_Text_content,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer'
                                    }}
                                    key={item?.code}>
                                    {item.name}
                                </Typography>
                            )
                        }
                        {
                            (String(item?.code) === activeCategory) && (
                                <Typography
                                    id={item.code}
                                    onClick={handleSelectCategory}
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                        color: COLORS.white,
                                        bgcolor: COLORS.bg3,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        padding: '5px 15px',
                                        borderRadius: '25px',
                                        boxSizing: 'border-box',
                                        '&:hover': {
                                            bgcolor: COLORS.bg3
                                        }
                                    }}
                                >{item.name}</Typography>
                            )
                        }
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    )
}
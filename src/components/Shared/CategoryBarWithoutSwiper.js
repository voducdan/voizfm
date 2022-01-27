//import react 
import { useEffect, useState } from 'react';

// import MUI components
import {
    Typography,
    Box,
    Button
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// import utils
import { TEXT_STYLE, COLORS } from '../../utils/constants'
import { flexStyle } from '../../utils/flexStyle'

export default function CategoryBarWithoutSwiper(props) {
    const { categoryList, isSm, windowWidth, onSelectCategory } = props;
    const [activeCategory, setActiveCategory] = useState('');
    const [isAllCategory, setisAllCategory] = useState(false);
    const [showedItems, setShowedItems] = useState([]);
    const newCategoryList = [{ "name": "Tất cả", "sub_name": null, "code": '' }, ...categoryList];
    const width = 100;
    const height = 36;

    useEffect(() => {
        getNumItem();
        setisAllCategory(false);
    }, [categoryList, windowWidth, isSm]);

    const getNumItem = () => {
        let numItems = Math.floor(windowWidth / width);
        if (isSm) {
            numItems *= 2;
        }
        const itemsList = newCategoryList.slice(0, numItems - 2);
        setShowedItems(itemsList);
    }

    const handleSelectCategory = (e) => {
        const categoryCode = e.currentTarget.id;
        setActiveCategory(categoryCode);
        onSelectCategory(categoryCode);
    }

    const handleShowAllCategory = () => {
        setisAllCategory(true);
        setShowedItems(newCategoryList);
    }

    const handleShowLessCategory = () => {
        setisAllCategory(false);
        getNumItem();
    }

    return (
        <Box
            style={{
                marginTop: isSm ? 20 : 48,
                ...flexStyle('flex-start', 'center'),
            }}
        >
            <Box
                sx={{
                    ...flexStyle('flex-start', 'center'),
                    rowGap: '20px',
                    overflow: 'hidden',
                    flexWrap: 'wrap',
                }}
            >

                {showedItems.map(item => (
                    <Box
                        key={item.code}
                        sx={{
                            ...flexStyle('flex-start', 'center'),
                            minWidth: `${width}px`,
                            minHeight: `${height}px`,
                        }}
                    >
                        {
                            (item.code !== activeCategory) && (

                                <Typography
                                    id={item.code}
                                    onClick={handleSelectCategory}
                                    sx={{
                                        ...(isSm ? TEXT_STYLE.title2 : TEXT_STYLE.title1),
                                        color: COLORS.VZ_Text_content,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        padding: '5px 15px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            )
                        }
                        {
                            (item.code === activeCategory) && (
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
                                            bgcolor: 'rgb(219 173 173 / 26%)'
                                        }
                                    }}
                                >{item.name}</Typography>
                            )
                        }
                    </Box>
                ))
                }
                <Box
                    sx={{
                        minWidth: `${width}px`,
                        minHeight: `${height}px`,
                        ...flexStyle('center', 'center'),
                    }}
                >
                    <Button
                        onClick={isAllCategory ? handleShowLessCategory : handleShowAllCategory}
                        sx={{
                            ...TEXT_STYLE.title1,
                            color: COLORS.VZ_Text_content,
                            textTransform: 'none',
                            p: '5px 15px'
                        }}
                        endIcon={isAllCategory ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    >
                        {isAllCategory ? 'Thu gọn' : 'Xem thêm'}
                    </Button>
                </Box>
            </Box>
        </Box >
    )
}
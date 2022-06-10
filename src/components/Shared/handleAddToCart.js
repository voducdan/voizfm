// import reducer, actions
import { setCart, setAddToCartFlag } from '../../redux/payment';
import { setOpenLogin } from '../../redux/openLogin';

// import service
import API from '../../services/api';

const handleAddToCart = async (
    dispatch,
    router,
    cart,
    playlistId,
    moveToCart,
    setAddToCartErrorMessage,
    setAddToCartError
) => {
    const api = new API();
    // add to cart store
    const isItemExists = cart.length > 0 && cart.some(i => i.id === playlistId);
    if (isItemExists && moveToCart) {
        router.push('/cart');
    }
    if (!isItemExists) {
        async function fetchPlaylist(id) {
            const res = await api.getPlaylistDetail(id);
            const playlist = res.data.data;
            return playlist;
        }
        try {
            let playlist = null;
            let id = null;
            if (typeof playlistId === 'object') {
                playlist = playlistId;
                id = playlistId.id;
            }
            else {
                id = playlistId;
                playlist = await fetchPlaylist(id);
            }
            const res = await api.addToCart(id);
            const result = await res.data;
            if (result.code === 0) {
                setAddToCartErrorMessage(result.error);
                setAddToCartError(true);
                setTimeout(() => {
                    setAddToCartError(false);
                }, 1500)
                return;
            }
            const tmpCart = [...cart, playlist];
            dispatch(setCart(tmpCart));
            dispatch(setAddToCartFlag(1));
            if (moveToCart) {
                router.push('/cart');
            }
        }
        catch (err) {
            console.log(err)
            const { status } = err.response;
            if (status === 401) {
                dispatch(setOpenLogin(true));
                return;
            }
            const errList = err.response.data.error;
            if (errList instanceof Object) {
                let errMessage = '';
                for (let e in errList) {
                    const key = Object.keys(errList[e])[0];
                    const value = errList[e][key]
                    errMessage += `${value} \n`
                }
                setAddToCartErrorMessage(errMessage || 'Đã xảy ra lỗi, vui lòng thử lại!');
                setAddToCartError(true);
                setTimeout(() => {
                    setAddToCartError(false);
                }, 1500);
                return;
            }
            setAddToCartErrorMessage(errList);
            setAddToCartError(true);
            setTimeout(() => {
                setAddToCartError(false);
            }, 1500);
        }
        return;
    }
    setAddToCartErrorMessage('Sản phẩm đã được thêm vào.\n Vui lòng kiểm tra lại giỏ hàng!');
    setAddToCartError(true);
    setTimeout(() => {
        setAddToCartError(false);
    }, 1500);
};

export default handleAddToCart;
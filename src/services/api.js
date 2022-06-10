import * as axios from 'axios';

import { getToken } from './authentication';
import Sha256Encrypt from '../utils/sha256';

export default class API {
    constructor(token) {
        this.api_token = token || getToken();
        this.client = null;
        this.base_url = `${process.env.NEXT_PUBLIC_API_PROTOCAL}://${process.env.NEXT_PUBLIC_BASE_URL}`;
    }


    init = (accessToken, xSignature) => {
        this.oauth2 = 'oauth2';
        this.oauth2_id = null;
        this.xSignature = xSignature;
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Credentials': true
        };
        if (accessToken) {
            this.headers['X-Authorization'] = accessToken;
        }

        if (!!this.api_token) {
            this.headers['X-Authorization'] = this.api_token;
        };
        if (!!this.xSignature) {
            this.headers['X-Signature'] = this.xSignature;
        };

        this.client = axios.create({
            baseURL: this.base_url,
            timeout: 120000,
            headers: this.headers
        });


        return this.client
    }

    buildQueryString = (params) => {
        const queryString = new URLSearchParams(params).toString();
        return queryString
    }

    getAudio = (id) => {
        return this.init().get(`/audios/${id}`)
    }

    getAudioFile = (id) => {
        let content = `audio_id=${id}`
        if (this.api_token) {
            content += `&access_token=${this.api_token}`
        }
        const xSignature = Sha256Encrypt(content);
        return this.init(null, xSignature).get(`/web/audios/${id}/streaming`)
    }

    getAudioHls = (url) => {
        return this.init().get(url)
    }

    getCart = () => {
        return this.init().get('/web/carts');
    }

    getNumItemsInCart = () => {
        return this.init().get('/web/carts/badge');
    }

    addToCart = (playlistId) => {
        const data = {
            playlist_id: playlistId
        }
        return this.init().post('/web/carts', data);
    }

    removeCartItem = (playlistId) => {
        return this.init().delete(`web/carts/${playlistId}`);
    }       

    payment = (method, data) => {
        return this.init().post(`/web/payment/${method}`, data);
    }

    getComboPackage = () => {
        return this.init().get(`/combo_packages`)
    }

    getVipPackage = () => {
        return this.init().get(`/web/plan_packages`)
    }

    getDiscoveries = (limit = 15, page = 1) => {
        const params = { limit, page };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/discoveries?${queryString}`)
    }

    getDiscovery = (id, page, limit = 10) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/discoveries/${id}?${queryString}`)
    }

    getDiscoveryComment = (discoveryId, page, limit = 10) => {
        return this.init().get(`/discoveries/${discoveryId}/comments?limit=${limit}&page=${page}`)
    }

    commentDiscovery = (discoveryId, data) => {
        return this.init().post(`/discoveries/${discoveryId}/comments`, data)
    }

    likeComment = (commentId) => {
        return this.init().post(`/comments/${commentId}/likes`)
    }

    likeDiscovery = (discoveryId) => {
        return this.init().post(`/discoveries/${discoveryId}/likes`)
    }

    getPlaylistHistory = (page = 1, limit = 99999) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/profiles/playlist_histories?${queryString}`)
    }

    getAudioHistory = (page = 1, limit = 99999) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/profiles/audio_histories?${queryString}`)
    }

    getPlaylistOrders = () => {
        return this.init().get('/profiles/playlist_orders')
    }

    getPlaylistBookmarks = (page, limit) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params)

        return this.init().get(`/profiles/playlist_histories/bookmarks?${queryString}`)
    }

    getChannelBookmarks = (page, limit) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);

        return this.init().get(`/profiles/channel_histories/bookmarks?${queryString}`);
    }

    getAudioLikes = (page, limit) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/profiles/audio_histories/likes?${queryString}`);
    }

    getOrderedCombo = () => {
        return this.init().get('/profiles/combo_packages');
    }

    getListeningPlaylists = (page = 1, limit = 9999999) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/playlists/listenings?$${queryString}`);
    }

    addListeningPlaylists = (audioId, lastDuration, playlistId) => {
        const data = {
            last_audio_id: audioId,
            last_duration: lastDuration,
            playlist_id: playlistId
        }
        return this.init().post(`/playlists/listenings`, data);
    }

    deleteListeningPlaylist = (id) => {
        return this.init().delete(`/playlists/listenings/${id}`);
    }

    getCategories = (code) => {
        const params = { code };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/categories?${queryString}`);
    }

    getCategoryPlaylists = (code, limit = 10, ignore_ids = '', sort = 'latest', have_author = 0) => {
        const params = { limit, ignore_ids, sort, have_author };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/categories/${code}/playlists?${queryString}`);
    }

    getPlaylistsRandom = (limit = 10) => {
        const params = { limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/playlists/random?${queryString}`);
    }

    getPlaylistDetail = (id) => {
        return this.init().get(`/playlists/${id}`)
    }

    getPlaylistAnalyses = (type = 'MostListenWeek') => {
        const params = { type };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/playlists/analyses?${queryString}`);
    }

    getPlaylistAudios = (id, page = 1) => {
        const params = { page };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/playlists/${id}/audios?${queryString}`);
    }

    getRequestedBook = () => {
        return this.init().get(`/book_request`);
    }

    requestedBook = (body) => {
        return this.init().post(`/book_request`, body);
    }

    getCommonKeyword = () => {
        return this.init().get(`/keyword/recommendation`);
    }

    getPlaylistRecommendation = () => {
        return this.init().get(`/playlists/recommendation`);
    }

    getSearchResults = (type, keyword, next_offset = null, language = null, next_query_type = null) => {
        const params = { keyword, next_offset, language, next_query_type };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/search/${type}?${queryString}`);
    }

    getAuthor = (id) => {
        return this.init().get(`/authors/${id}`);
    }

    getFeaturedAuthors = (page = 1, limit = 6) => {
        return this.init().get(`/authors/featured`);
    }

    getAuthorPlaylists = (id, page = 1, limit = 10) => {
        const params = { limit, page };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/authors/${id}/playlists?${queryString}`);
    }

    getPlaylistRanking = (type, code, limit = 999999) => {
        const params = { ranking_type: type, code, limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/playlists/rankings?${queryString}`);
    }

    getHomeNewContent = (limit = 10) => {
        const params = { limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/playlists/new_contents?${queryString}`);
    }

    getRecommendedChannels = (page = 1, limit = 6) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/channels/recommend?${queryString}`);
    }

    bookmarkChannel = (id) => {
        return this.init().post(`/channels/${id}/bookmarks`);
    }

    bookmarkPlaylist = (id) => {
        return this.init().post(`/playlists/${id}/bookmarks`);
    }

    likeAudio = (id) => {
        return this.init().post(`/audios/${id}/likes`);
    }

    unLikeMultiAudio = (ids) => {
        return this.init().delete(`/audios/likes`, { audio_ids: ids });
    }

    getChannel = (id) => {
        return this.init().get(`/channels/${id}`);
    }

    getChannelPlaylists = (id, page = 1, limit = 5) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/channels/${id}/playlists?${queryString}`);
    }

    getChannelAudio = (id, page = 1, limit = 10) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params)
        return this.init().get(`/channels/${id}/audios?${queryString}`);
    }

    getUserInfo = () => {
        return this.init().get('/profiles/me');
    }

    getUserTransactionHistory = () => {
        return this.init().get('/profiles/orders');
    }

    updateUserInfo = (data) => {
        data.append('oauth2', this.oauth2);
        data.append('oauth2_id', this.oauth2_id);
        return this.init().put('/profiles/me', data);
    }

    ratePlaylist = (id, data) => {
        return this.init().post(`/playlists/${id}/ratings`, data);
    }

    getOTP = (phoneNumber, countryCode) => {
        const data = {
            phone_number: phoneNumber,
            country_code: countryCode
        }
        return this.init().post(`/auth/otps`, data);
    }

    getOTPOnUpdateProfile = (phoneNumber, countryCode) => {
        const data = {
            phone_number: phoneNumber,
            country_code: countryCode
        }
        return this.init().post(`/profiles/otps`, data);
    }

    updatePhoneNumber = (phoneNumber, countryCode, otp) => {
        const data = {
            phone_number: phoneNumber,
            country_code: countryCode,
            otp: otp
        }
        return this.init().put(`/profiles/phone_number`, data);
    }

    loginByPhone = (phoneNumber, countryCode, otp) => {
        const data = {
            phone_number: phoneNumber,
            country_code: countryCode,
            otp
        }
        return this.init().post(`/web/auth/phone_number`, data);
    }

    createProfile = (data, accessToken) => {
        return this.init(accessToken).post(`/auth/profiles`, data);
    }

    beCreator = (data) => {
        return this.init().post(`/web/creators`, data);
    }

    getBannerImages = (category_code = '', display_on = '', page = 1, limit = 10) => {
        const params = { category_code, display_on, page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/banners?${queryString}`);
    }

    checkBillingStatus = (data) => {
        return this.init().post(`/web/payment/shopee/checking`, data);
    }

    loginGoogle = (data) => {
        return this.init().post('web/auth/google', data);
    }

    loginFacebook = (data) => {
        return this.init().post('web/auth/facebook', data);
    }

    getVoicerPlaylists = (id, page, limit = 10) => {
        const params = { page, limit };
        const queryString = this.buildQueryString(params);
        return this.init().get(`/voicers/${id}/playlists?${queryString}`);
    }

    getVersion = () => {
        return this.init().get('/versions?platform=website');
    }

    trackingAudio = (data) => {
        return this.init().post('/audios/listening', {
            audio_listenings: data
        });
    }

    checkDiscountCode = (data) => {
        return this.init().post('/web/use_coupon', data);
    }

    verifyAccount = (data) => {
        return this.init().post('/auth/verification', data);
    }
}

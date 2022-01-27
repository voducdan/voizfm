const ISSERVER = typeof window === "undefined";

export const getToken = () => {
    if (!ISSERVER) {
        return localStorage.getItem('token');
    }
}

export const removeToken = () => {
    if (!ISSERVER) {
        localStorage.removeItem('token');
    }
}

export const saveToken = (token) => {
    if (!ISSERVER) {
        localStorage.setItem('token', token);
    }
}
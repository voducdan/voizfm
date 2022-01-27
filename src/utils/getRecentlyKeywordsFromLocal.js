export default function getRecentlyKeywork() {
    const keyFromLocalStorage = localStorage.getItem('keywords');
    if (keyFromLocalStorage) {
        const parsedKeywords = JSON.parse(keyFromLocalStorage || '[]');
        return parsedKeywords;
    }
}
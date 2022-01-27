export default function setRecentlyKeywork(keywords) {
    const stringifyKeywords = JSON.stringify(keywords);
    localStorage.setItem('keywords', stringifyKeywords);
}
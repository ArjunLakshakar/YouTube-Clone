import axios from 'axios';

const API_KEY = "AIzaSyDu7wBgMbd9iv9bpi4N-NhgXau1ui_gU0c"; 
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchPopularVideos = async (pageToken = "") => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
            params: {
                part: 'snippet,contentDetails,statistics',
                chart: 'mostPopular',
                regionCode: 'IN',
                maxResults: 20,
                pageToken, 
                key: API_KEY,
            },
        });

        return {
            videos: response.data.items || [],  
            nextPageToken: response.data.nextPageToken || null
        };
    } catch (err) {
        console.error('YouTube API error (popular):', err.response?.data || err.message);
        return {
            videos: [],
            nextPageToken: null
        };
    }
};


export const searchVideos = async (query) => {
    try {
        const response = await axios.get(`${BASE_URL}/search`, {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 20,
                key: API_KEY,
            },
        });
        return response.data.items;
    } catch (err) {
        console.error('Search error:', err.response?.data || err.message);
        return [];
    }
};

export const fetchVideoDetails = async (videoId) => {
    try {
        const response = await axios.get(`${BASE_URL}/videos`, {
            params: {
                part: 'snippet,statistics',
                id: videoId,
                key: API_KEY,
            },
        });
        return response.data.items[0];
    } catch (err) {
        console.error('Video details error:', err.response?.data || err.message);
        return null;
    }
};

export const fetchRelatedVideos = async (videoId) => {
    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                part: 'snippet',
                relatedToVideoId: videoId,
                type: 'video',
                maxResults: 20,
                key: API_KEY, 
            }
        });
        return response.data.items;
    } catch (error) {
        console.error("Related videos fetch error:", error);
        return [];
    }
};



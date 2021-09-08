const KalturaConfig = {
    'apiPath' : 'http://curriki-studio-api.local/api/v1/kaltura/get-media-entry-list',
}

const YoutubeConfig = {
    'channelId' : 'YOUTUBE_CHANNEL_ID',
    'maxResults' : '', // Set The video search limit (optional)
    'key' : 'YOUTUBE_API_KEY',
    'order' : 'date', // can be searchSortUnspecified, date, rating, viewCount, relevance, title, videoCount
    'part' : 'snippet',
}

const VimeoConfig = {
    'bearerToken' : 'VIMEO_TOKKEN',
    'channelId' : 'CHANNEL_ID', // NUMBERS ONLY
    'perPage' : 5
}
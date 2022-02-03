const KalturaConfig = {
    'apiPath' : '/api/api/v1/kaltura/get-media-entry-list',
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

/*const LTIToolSettings = {
    apiPath:{
        getLTIToolList : '/api/api/v1/lti-tool-settings/get-list',
        getLTIToolSearch : '/api/api/v1/lti-tool-settings/get-lti-tool-search'
    }
}*/
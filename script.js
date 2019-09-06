const youtubeKey = "AIzaSyCi93LzmteONP1uWViY4_PB_l91EeRORBs";
const lyricsKey = "pBgD5SvsRP6KE6vxuUKkUU7CxIDfn1OsvZmONF90YWV6R72HYj0j0OOscetK0unG"

function appStarter() {
    $(".searchArea").show(300);
    $(".resultsArea").hide(100);
    $('form').submit(event => {
        event.preventDefault();
        let artistName = $(".artistQuery").val();
        let songTitle = $(".songQuery").val();
        getLyrics(artistName, songTitle);
        findVideo(artistName, songTitle);
        getTab(artistName, songTitle);
        $(".searchArea").hide(300);
        $(".resultsArea").show(400);
        backLoader();
    });
}

function getLyrics (artistQuery, songQuery) {
$('.lyricError').text("");
$('.lyrics').empty();
artist = artistQuery.replace(/\//g, "-");
song = songQuery.replace(/\//g, "-");
 let lyricURL =  "https://orion.apiseeds.com/api/music/lyric/" + artist + "/" + song + "?apikey=" + lyricsKey;
 console.log(lyricURL);
 fetch(lyricURL)
 .then(response => {
     if (response.ok) {
         return response.json();
     }
     throw new Error(response.statusText);
 })
 .then(responseJson => renderLyrics(responseJson))
 .catch(err => {
     $(".lyricError").text(`Search was unsuccessful: ${err.message}Lyrics are either unavailable or the search terms are misspelled.`);
 });
}

function renderLyrics(jsonObject) {
    let lyricString = jsonObject.result.track.text;
    let formattedLyricsString = lyricString.replace(/\n/g,"<br />");
    $(".lyrics").html(formattedLyricsString);
}

function findVideo(artist, song) {
    const vidParams = {
        key: youtubeKey,
        q: `${artist} ${song}`,
        part: 'snippet',
        type: 'video'
    };
    const queryString = formatYoutubeQuery(vidParams);
    fetchVids(queryString);
}
function formatYoutubeQuery(params) {
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function fetchVids(query) {
    let youtubeURL = `https://www.googleapis.com/youtube/v3/search?` + query + `&videoEmbeddable=true&rel=0`
    fetch(youtubeURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then (responseJson => embedVids(responseJson))
    .catch(err => {
        $(".vidError").text(`Video search was unsuccessful: ${err.message}`);
    });
}

function embedVids(object) {
    console.log(object);
    $(".responsiveVid iframe").remove();
    let vidID = object.items[0].id.videoId;
    console.log(vidID);
    $('<iframe frameborder="0" allowfullscreen></iframe>').attr("src", `https://www.youtube.com/embed/` + vidID).appendTo(".responsiveVid");
}
function getTab (artistSearch, songSearch) {
    artist = artistSearch.replace(/&/g, "and");
    song = songSearch.replace(/&/g, "and");
    $(".tabLink").attr("href", `http://www.songsterr.com/a/wa/bestMatchForQueryString?s=${song}&a=${artist}`);
}
function backLoader() {
    $("#backButton").click(function() {
        appStarter();
    });
}
$(appStarter);
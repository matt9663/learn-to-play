const youtubeKey = "AIzaSyCi93LzmteONP1uWViY4_PB_l91EeRORBs";
const lyricsKey = "pBgD5SvsRP6KE6vxuUKkUU7CxIDfn1OsvZmONF90YWV6R72HYj0j0OOscetK0unG"

function appStarter() {
    $('form').submit(event => {
        event.preventDefault();
        let artistName = $(".artistQuery").val();
        let songTitle = $(".songQuery").val();
        
        getLyrics(artistName, songTitle);
        //getVideo(artistName, songTitle);
       getTab(artistName, songTitle);
    });
}

function getLyrics (artist, song) {
$('.lyricError').text("");
$('.lyrics').empty();
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

function getVideo(artist, song) {

}

function getTab (artist, song) {
    $(".tabLink").attr("href", `http://www.songsterr.com/a/wa/bestMatchForQueryString?s=${song}&a=${artist}`);
}
$(appStarter);
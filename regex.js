const url = "https://stackoverflow.com/questions/6603015/check-whether-a-string-matches-a-regex-in-js"
var playlistRegExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/;
var videoRegEx = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
var match = playlistRegExp.test(url);
var matchVideo = videoRegEx.test(url)
if (match === true){
    console.log(match)
} else if(matchVideo === true) {
    console.log(matchVideo)
} else {
    console.log("Invalid")
}
return null;
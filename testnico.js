const { niconico, Nicovideo } = require('niconico')
 
const baseDir = './videos'
 
async function downloadVideo(videoID) {
  try {
    const session = await niconico.login(
      "minh15052008@gmail.com",
      "MiNh15052008."
    )
    const client = new Nicovideo(session)
    const filePath = await client.download(videoID, baseDir)
 
    console.log('Downloaded:', filePath)
  } catch (err) {
    console.log('Error:', err)
  }
}
 
downloadVideo('sm28222588')
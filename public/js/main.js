const videosList = document.querySelector('.videos-list')
window.addEventListener('load', () => displayVideos())

function displayVideos() {
  videosList.innerHTML = ''
  fetch('https://www.timestamper.rokskrbec.si/videos')
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        let id = element._id
        let title = element.title
        let date = element.date
        //let youtubeId = element.youtubeId
        let thumbnailUrl = element.thumbnailUrl
        let year = date.substring(0, 4)
        let month = date.substring(5, 7)
        let day = date.substring(8, 10)
        let time = date.substring(11, 19)
        videosList.innerHTML += `<li onclick="location.href='https://www.timestamper.rokskrbec.si/video.html?id=${id}';"><div class="details-container"><img src="${thumbnailUrl}"></img><div class="details"><div class="video-title">${title}</div><div class="add-date">added on: ${day}.${month}.${year} at: ${time}</div></div></div><div onclick='deleteVideo(event, "${id}")' class="delete-video-button"><i class="fas fa-times"></i></div></li>`
      })
    })
}

//------------------------- delete video -----------------------------
function deleteVideo(event, id) {
  event.stopPropagation()
  fetch(`https://www.timestamper.rokskrbec.si/videos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      displayVideos()
    })
    .catch((err) => console.log(err))

  fetch(`https://www.timestamper.rokskrbec.si/timestamps/all/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      res.json()
    })
    .catch((err) => console.log(err))
}

//-------------------------- add video -------------------------

const addVideo = document.getElementById('add-video')
const errorMessage = document.querySelector('.error-message')

addVideo.addEventListener('submit', (e) => {
  e.preventDefault()
  const videoUrl = document.getElementById('video-url')
  const videoId = YouTubeGetID(videoUrl.value)
  fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyDLZWBugA0PnEtYNVqvHdMU9gUi9SfqjIo&part=snippet,contentDetails,statistics,status`)
    .then((res) => res.json())
    .then((data) => {
      const videoTitle = data.items[0].snippet.title
      const userId = 'roks'
      const thumbnailUrl = data.items[0].snippet.thumbnails.default.url
      videoUrl.classList.remove('input-error')
      errorMessage.classList.remove('show-error-message')
      fetch('https://www.timestamper.rokskrbec.si/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: videoTitle,
          youtubeId: videoId,
          userId: userId,
          thumbnailUrl: thumbnailUrl,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          displayVideos()
          document.getElementById('video-url').value = ''
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => {
      console.log(err)
      videoUrl.classList.add('input-error')
      errorMessage.classList.add('show-error-message')
    })
})

function YouTubeGetID(url) {
  var ID = ''
  url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i)
    ID = ID[0]
  } else {
    ID = url
  }
  return ID
}

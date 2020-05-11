let videoId = new URLSearchParams(window.location.search).get('id')
let youtubeId
let videoTitle = document.querySelector('.title')

fetch(`https://www.timestamper.rokskrbec.si/videos/${videoId}`)
  .then((res) => res.json())
  .then((data) => {
    youtubeId = data[0].youtubeId
    videoTitle.innerHTML = data[0].title
    onPlayerReady()
  })

//embed youtube player
var tag = document.createElement('script')
tag.src = 'https://www.youtube.com/player_api'
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
var player
function onYouTubePlayerAPIReady() {
  player = new YT.Player('ytplayer', {
    height: '720',
    width: '1080',
    videoId: '',
    events: {
      onReady: onPlayerReady,
    },
  })
}

function onPlayerReady(event) {
  event.target.loadVideoById(youtubeId, 0)
}
//------------------------get timestaps on load -----------------------------
window.addEventListener('load', () => getTimestamps())

let timestampsList = document.querySelector('.timestamps-list')
document.getElementById('timestamp-form').addEventListener('submit', submitForm)

//-----------------get timestamps function--------------------------
function getTimestamps() {
  const timestampsArray = []
  timestampsList.innerHTML = ''
  fetch(`https://www.timestamper.rokskrbec.si/timestamps/${videoId}`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        timestampsArray[i] = {
          id: data[i]._id,
          videoId: data[i].videoId,
          text: data[i].text,
          time: parseInt(data[i].time),
        }
      }

      timestampsArray.sort(compareValues('time', 'asc'))

      for (let i = 0; i < timestampsArray.length; i++) {
        let time = timeFormat(timestampsArray[i].time)
        timestampsList.innerHTML += `
        <li onclick='goToTimestamp(${timestampsArray[i].time})'>
          <div class="timestamp-list-item-left">${timestampsArray[i].text}</div>
          <div class="timestamp-list-item-right">
            <div class="timestamp-list-item-time">${time}</div>
            <div onclick='deleteTimestamp("${timestampsArray[i].id}")' class="timestamp-list-item-delete"><i class="fas fa-times"></i></div>
          </div>
          </div>
        </li>`
      }
    })
}

//--------------------- add timestamp function----------------------------
function submitForm(e) {
  e.preventDefault()
  let timestampText = document.getElementById('timestamp-text')
  let timestampTime = player.playerInfo.currentTime

  fetch('https://www.timestamper.rokskrbec.si/timestamps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      videoId: videoId,
      text: timestampText.value,
      time: timestampTime,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      timestampText.value = ''
      getTimestamps()
    })
    .catch((err) => console.log(err))
}

//-----------------delete timestamp function-------------------------------
function deleteTimestamp(timestampId) {
  const dbConnection = `https://www.timestamper.rokskrbec.si/timestamps/${timestampId}`
  fetch(dbConnection, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      timestampsList.innerHTML = ''
      getTimestamps()
    })
    .catch((err) => console.log(err))
}

//------------------ go to timestamp function---------------------------------

function goToTimestamp(timestamp) {
  player.seekTo(timestamp)
}

//-------------------------- sorting function -------------------------------
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return order === 'desc' ? comparison * -1 : comparison
  }
}

//------------------------ time format function -------------------------------
function timeFormat(time) {
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600)
  var mins = ~~((time % 3600) / 60)
  var secs = ~~time % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = ''

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '')
  ret += '' + secs
  return ret
}

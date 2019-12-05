// jshint esversion: 9
const socket = io();
// UI Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $shareLocationButton = document.querySelector('#send-location');

const $messages = document.querySelector('#messages');
const messageTemplate = document.querySelector('#message-template').innerHTML;
const $location = document.querySelector('#location');
const locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebar = document.querySelector('#sidebar')
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const {
  username,
  room
} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const autoScroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Get the height of new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Vissible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have i scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
}

socket.on('message', ({
  username,
  text,
  createdAt
}) => {
  console.log(text)
  const html = Mustache.render(messageTemplate, {
    username,
    message: text,
    createdAt: moment(createdAt).format('h:mm a')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll()
});

socket.on('RoomData', ({
  room,
  users
}) => {
  const html = Mustache.render(sidebarTemplate, {
    users,
    room
  })
  $sidebar.innerHTML = html;
})


socket.on('locationMessage', ({
  username,
  url,
  createdAt
}) => {
  const html = Mustache.render(locationTemplate, {
    username,
    url,
    createdAt: moment(createdAt).format('h:mm a')
  });

  $messages.insertAdjacentHTML('beforeend', html)
  autoScroll()
});


$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if ($messageFormInput.value === '') {
    return
  }
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    if (error) {
      return console.log(error)
    }
    console.log('Messaged delivered')
  })
})


$shareLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser')
  }
  $shareLocationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('shareLocation', {
      lat: position.coords.latitude,
      long: position.coords.longitude
    }, () => {
      console.log('Location shared')
      $shareLocationButton.removeAttribute('disabled')
    })
  })
})


socket.emit('join', {
  username,
  room
}, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
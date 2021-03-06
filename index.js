var blessed = require('blessed')
var Twitter = require('twitter')
var twitterconfig = require('./twitterconfig.json')

var screen = blessed.screen()
screen.title = 'TTUI'

var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  content: '',
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    bg: 'blue'
  },
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  }
})

screen.append(box)

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
  return process.exit(0)
})

screen.key(['u'], (ch, key) => {
  updateTweets()
})

screen.key(['g'], (ch, key) => {
  box.scrollTo(0)
  screen.render()
})


screen.key(['j', 'k'], (ch, key) => {
  box.scroll(key.name == 'j' ? 1 : -1)
  screen.render()
})

box.focus()
screen.render()

var client = new Twitter(twitterconfig)
var params = {screen_name: 'hermo'}

function updateTweets() {
  box.setContent('{center}Loading tweets...{/center}')
  screen.render()

  client.get('statuses/home_timeline', params, (error, tweets, response) => {
    if (error) {
      box.setContent(`{bold}{red-fg}Twitter error: ${JSON.stringify(error)}{/}`)
      screen.render()
      setTimeout(() => process.exit(1), 5000)
      return;
    }

    var frame = tweets.map(tweet => {
      return {
        created_at: tweet.created_at,
        author: tweet.user.screen_name,
        text: tweet.text
      }
    })
    .map(tweet =>
      `{bold}@{blue-fg}${tweet.author} - ${tweet.created_at}{/}\n${tweet.text}\n`)
    .join("\n")
    box.setContent(frame)
    screen.render()
  })
}

updateTweets()

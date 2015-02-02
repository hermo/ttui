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
  content: '{center}Loading tweets...{/center}',
  tags: true,
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

box.focus()
screen.render()

var client = new Twitter(twitterconfig)
var params = {screen_name: 'hermo'}

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


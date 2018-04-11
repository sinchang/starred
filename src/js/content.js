;(() => {
  const cheerio = require('cheerio')

  main()
  
  function request(url) {
    return fetch(url)
      .then(res => res.text())
      .then(res => {
        return res
      })
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
  }

  function appendStyle() {
    const css = `
    .random-star .float-right{ display: none !important; padding-right: 0 !important; width: 100% !important;}
    .random-star .text-gray { margin-bottom: 10px;margin-top: 0 !important; }
    .random-star .repo-language-color { display: none !important; }
    .random-star span.mr-3 { display: none !important; }
  `,
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style')

    style.type = 'text/css'
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }

    head.appendChild(style)
  }

  function main() {
    if (location.href !== 'https://github.com/') return

    const username = document.querySelector('.css-truncate-target').innerHTML
    const starPageUrl = `https://github.com/${username}?tab=stars`

    request(starPageUrl)
      .then(html => {
        const $ = cheerio.load(html)
        const pageCount = $('.next_page')
          .prev()
          .text()
        const randmonPage = getRandomIntInclusive(1, pageCount)
        const randomPageUrl = `https://github.com/${username}?page=${randmonPage}&tab=stars`
        return request(randomPageUrl)
      })
      .then(html => {
        const $ = cheerio.load(html)
        const elements = $('.col-12.d-block.width-full.py-4.border-bottom')
        const count = elements.length
        const randomNumber = getRandomIntInclusive(1, count)
        html = $(elements[randomNumber]).html()
        const appendDiv = document.createElement('div')
        appendDiv.className = 'random-star'
        appendDiv.innerHTML = html
        appendStyle()
        document.querySelector('.dashboard-sidebar').prepend(appendDiv)
      })
  }
})()

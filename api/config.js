const dev = {
  miniprogram: 'http://192.168.111.211:5000/api/v1/miniprogram',
  image: 'http://192.168.111.211:5000/api/v1/miniprogram/images',
}

const qa = {
  miniprogram: 'http://192.168.111.244:5000/api/v1/miniprogram',
  image: 'http://192.168.111.244:5000/api/v1/miniprogram/images',
}

const staging = {
  miniprogram: 'https://mp-staging.alct56.com/api/v1/miniprogram',
  image: 'https://mp-staging.alct56.com/api/v1/miniprogram/images',
}

const product = {
  miniprogram: 'https://mp.alct56.com/api/v1/miniprogram',
  image: 'https://mp.alct56.com/api/v1/miniprogram/images',
}

const appConfig = {
  duration: 2500, // showToast duration: 2.5s
  agreement: "https://x-staging.alct56.com/mobile/Agreement.html"
}

module.exports = {
  environment: staging,
  appConfig: appConfig
}
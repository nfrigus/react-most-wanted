import getMenuItems from './menuItems'
import locales from './locales'
import routes from './routes'
import themes from './themes'
import grants from './grants'

const firebase_config = {
  apiKey: "AIzaSyBv4elhhZrNFzoq9Mm9INtdwkeF65o0Qkc",
  authDomain: "consultare-llc.firebaseapp.com",
  databaseURL: "https://consultare-llc.firebaseio.com",
  messagingSenderId: "1098877235925",
  projectId: "consultare-llc",
  storageBucket: "consultare-llc.appspot.com",
};

const config = {
  firebase_config: firebase_config,
  firebase_config_dev: firebase_config,
  firebase_providers: ['google.com', 'facebook.com', 'twitter.com', 'github.com', 'password', 'phone'],
  initial_state: {
    themeSource: {
      isNightModeOn: true,
      source: 'green'
    },
    locale: 'en'
  },
  drawer_width: 256,
  locales,
  themes,
  grants,
  routes,
  getMenuItems,
  firebaseLoad: () => import('./firebase'),
};

export default config

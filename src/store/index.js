import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import admin from './modules/admin';
import feed from './modules/feed';


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    admin,
    feed
  },
});

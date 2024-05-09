import Vue from 'vue';
import router from '@/router';
import { VueAuthenticate } from 'vue-authenticate';

const vueAuth = new VueAuthenticate(Vue.prototype.$http, {
  baseUrl: process.env.APP_API_BASE_URL,
  tokenName: 'access_token',
  loginUrl: '/login/telegram',
  registerUrl: '/register',
  checkLoginUrl: '/login/telegram/checklogin',
});

export default {
  namespaced: true,

  state: {
    token: localStorage.getItem('token') || false,
    tg_id: null,
    api_key: null,
    user: null,
    role: null
  },

  getters: {
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return Boolean(state.user);
    },
    tg_id(state) {
      return state.tg_id;
    },
    api_key(state) {
      return state.api_key;
    },
    role(state) {
      return state.role;
    }
  },

  mutations: {
    SET_IS_AUTHENTICATED(state, auth) {
      state.isAuthenticated = auth;
    },
    SET_TG_ID(state, id) {
      state.tg_id = id
    },
    SET_API_KEY(state, key) {
      state.api_key = key
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ROLE(state, role) {
      state.role = role;
    }
  },

  actions: {
    async adminRole({ commit }) {
      try {
        const response = await Vue.axios.get(
          `/v1/admin/users/me`
        );
        commit('SET_ROLE', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to get user role:', error);
      }
    },
    async adminLogin({ commit }, { email, password }) {
      try {
        const res = await Vue.axios.post('/v1/admin/signin', {
          email,
          password,
        });

        if (res.status == 200) {
          localStorage.setItem('token', res.data.token);
          commit('SET_IS_AUTHENTICATED', true);
          console.log('SUCCESS! Redirect to Dashboard');
          return res.data;
        } else {
          console.log('FAIL! Display error');
          throw Error();
        }
      } catch (e) {
        console.error('Failed to authenticate login:', e);
      }
    },
    logout(context, payload) {
      const redirect = payload ? 'AdminLogin' : 'Login';
      localStorage.clear();
      router.push({ name: redirect });
    },
  },
};

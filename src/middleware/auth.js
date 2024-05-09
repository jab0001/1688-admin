import store from '../store';
import Vue from 'vue';

export default async function ({ to, next, router }) {
  if (router.history._startLocation.includes('ext_id=')) {
    let extId = router.history._startLocation.slice(
      router.history._startLocation.indexOf('=') + 1
    );
    localStorage.setItem('ext_id', extId);
  }

  if (!store.getters['auth/isAuthenticated']) {
    let token = localStorage.getItem('token');

    if (!token) {
      return router.push({ name: 'AdminLogin' });
    }

    /* const user = await Vue.prototype.$http.get(`/client/info`);
    store.commit('auth/SET_USER', user.data.data.client); */
  }

  /* if (
    !(store.getters['auth/userPhone'] && store.getters['auth/userEmail']) &&
    to.path !== '/first_auth'
  ) {
    return router.push({ path: 'first_auth' });
  } */

  return next();
}

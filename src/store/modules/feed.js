import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    feedsList: null,
    imagesList: [],
    notice: '',
  },
  getters: {
    getFeedsList: (state) => {
      return state.feedsList;
    },
    getNotice: (state) => {
      return state.notice;
    },
    getImagesList: (state) => {
      return state.imagesList;
    },
  },
  actions: {
    async updateNotice({ commit }, { text, is_active }) {
      let data = {};

      text
        ? (data = {
            text,
          })
        : (data = {
            is_active,
          });

      try {
        const response = await Vue.axios.post(`/v1/admin/notice`, { ...data });
        return response.data;
      } catch (error) {
        console.error('Failed to update notice:', error);
      }
    },
    async fetchFeedsList({ commit }) {
      try {
        const response = await Vue.axios.get('/v1/admin/feeds');
        commit('SET_FEEDS_LIST', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch feeds list:', error);
      }
    },
    async updateFeed({ commit }, { id, name, value }) {
      let data = {
        [name]: value,
      };

      if (name === 'default') {
        data = {
          image_id: null,
          external_link: '',
          is_active: false,
        };
      }
      try {
        const response = await Vue.axios.put(`/v1/admin/feeds/${id}`, data);
        return response.data;
      } catch (error) {
        console.error('Failed to update feed:', error);
      }
    },

    async uploadImage({ commit }, image) {
      try {
        const response = await Vue.axios.post('/v1/admin/images', image);
        return response.data;
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    },
    async fetchNotice({ commit }) {
      try {
        const response = await Vue.axios.get(`/v1/admin/notice`);
        if (response.data.text) {
          commit('SET_NOTICE', response.data);
        } else {
          commit('SET_NOTICE', '');
        }
        return response.data;
      } catch (error) {
        console.error('Failed to fetch notice:', error);
      }
    },
    async fetchImagesList({ commit }) {
      try {
        const response = await Vue.axios.get(`/v1/admin/images`);
        commit('SET_IMAGES_LIST', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch images list:', error);
      }
    },
  },
  mutations: {
    SET_FEEDS_LIST(state, feeds) {
      state.feedsList = feeds;
    },
    SET_IMAGES_LIST(state, images) {
      state.imagesList = images;
    },
    SET_NOTICE(state, notice) {
      state.notice = notice;
    },
  },
};

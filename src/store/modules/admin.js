import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    usersList: [],
    selectedUser: {},
    clientsList: [],
    selectedClient: {},
    selectedClientOrders: [],
    selectedOrder: {},
  },
  getters: {
    getUsersList: (state) => {
      return state.usersList;
    },
    getUser: (state) => {
      return state.selectedUser;
    },
    getClientsList: (state) => {
      return state.clientsList;
    },
    getClient: (state) => {
      return state.selectedClient;
    },
    getClientOrders: (state) => {
      return state.selectedClientOrders;
    },
    getOrder: (state) => {
      return state.selectedOrder;
    },
  },
  actions: {
    async sendSms({ commit }, clientId) {
      try {
        const response = await Vue.axios.post(
          `/v1/admin/clients/${clientId}/temp-password-sms`
        );
        return response.data;
      } catch (error) {
        console.error('Failed to send password via sms:', error);
      }
    },
    async sendEmail({ commit }, clientId) {
      try {
        const response = await Vue.axios.post(
          `/v1/admin/clients/${clientId}/temp-password-email`
        );
        return response.data;
      } catch (error) {
        console.error('Failed to send password to email:', error);
      }
    },
    async fetchUsersList({ commit }) {
      try {
        const response = await Vue.axios.get('/v1/admin/users');
        commit('SET_USERS_LIST', response.data.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch users list:', error);
      }
    },
    async fetchUser({ commit }, userId) {
      try {
        const response = await Vue.axios.get(`/v1/admin/users/${userId}`);
        commit('SET_SELECTED_USER', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    },
    async updateUser({ commit }, user) {
      try {
        const response = await Vue.axios.put(
          `/v1/admin/users/${user.id}`,
          user
        );
        commit('UPDATE_USER', user);
        return response;
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    },
    async assignUserRole({ commit }, { userId, role }) {
      try {
        const res = await Vue.axios.post(`/v1/admin/users/${userId}/role`, {
          name: role,
        });
      } catch (error) {
        console.error('Failed to assign role to user:', error);
      }
    },
    async fetchClientsList({ commit }, page) {
      try {
        const response = await Vue.axios.get(`/v1/admin/clients?page=${page}`);
        commit('SET_CLIENTS_LIST', response.data.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch clients list:', error);
      }
    },
    async addClient({ commit }, data) {
      const { username, email, phone, promo } = data;
      try {
        const response = await Vue.axios.post('/v1/admin/clients/', {
          username,
          email,
          phone,
          promo,
        });

        return response;
      } catch (error) {
        console.error('Failed to add client:', error);
      }
    },
    async deleteClient({ commit }, clientId) {
      try {
        const response = await Vue.axios.delete(
          `/v1/admin/clients/${clientId}`
        );

        return response;
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    },
    async deleteOrder({ commit }, orderId) {
      try {
        const response = await Vue.axios.delete(`/v1/admin/orders/${orderId}`);

        return response;
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    },
    async deleteUser({ commit }, userId) {
      try {
        const response = await Vue.axios.delete(`/v1/admin/users/${userId}`);

        return response;
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    },
    async addUser({ commit }, data) {
      const { username, email, password } = data;
      try {
        const response = await Vue.axios.post('/v1/admin/users/', {
          name: username,
          email,
          password,
        });

        return response;
      } catch (error) {
        console.error('Failed to add user:', error);
      }
    },
    async fetchClient({ commit }, clientId) {
      try {
        const response = await Vue.axios.get(`/v1/admin/clients/${clientId}`);
        commit('SET_SELECTED_CLIENT', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch client:', error);
      }
    },
    async updateClient({ commit }, client) {
      try {
        const response = await Vue.axios.put(
          `/v1/admin/clients/${client.id}`,
          client
        );
        commit('UPDATE_CLIENT', client);
        return response;
      } catch (error) {
        console.error('Failed to update client:', error);
      }
    },
    async fetchClientOrders({ commit }, clientId) {
      try {
        const response = await Vue.axios.get(
          `/v1/admin/clients/${clientId}/orders`
        );
        commit('SET_SELECTED_CLIENT_ORDERS', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch client orders:', error);
      }
    },
    async fetchOrder({ commit }, orderId) {
      try {
        const response = await Vue.axios.get(`/v1/admin/orders/${orderId}`);
        commit('SET_SELECTED_ORDER', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    },
    async updateOrder({ commit }, order) {
      try {
        const response = await Vue.axios.put(
          `/v1/admin/orders/${order.id}`,
          order
        );
        commit('UPDATE_ORDER', order);
        return response;
      } catch (error) {
        console.error('Failed to update order:', error);
      }
    },
  },
  mutations: {
    SET_USERS_LIST(state, users) {
      state.usersList = users;
    },
    SET_SELECTED_USER(state, user) {
      state.selectedUser = user;
    },
    SET_CLIENTS_LIST(state, clients) {
      state.clientsList = clients;
    },
    SET_SELECTED_CLIENT(state, client) {
      state.selectedClient = client;
    },
    SET_SELECTED_CLIENT_ORDERS(state, orders) {
      state.selectedClientOrders = orders;
    },
    SET_SELECTED_ORDER(state, order) {
      state.selectedOrder = order;
    },
    UPDATE_USER(state, user) {
      const index = state.usersList.findIndex((u) => u.id === user.id);
      if (index !== -1) {
        state.usersList.splice(index, 1, user);
      }
      if (state.selectedUser.id === user.id) {
        state.selectedUser = user;
      }
    },
    UPDATE_CLIENT(state, client) {
      const index = state.clientsList.findIndex((c) => c.id === client.id);
      if (index !== -1) {
        state.clientsList.splice(index, 1, client);
      }
      if (state.selectedClient.id === client.id) {
        state.selectedClient = client;
      }
    },
    UPDATE_ORDER(state, order) {
      if (state.selectedOrder.id === order.id) {
        state.selectedOrder = order;
      }
      const clientOrders = state.selectedClientOrders.find(
        (o) => o.id === order.id
      );
      if (clientOrders) {
        const index = clientOrders.findIndex((o) => o.id === order.id);
        clientOrders.splice(index, 1, order);
      }
    },
  },
};

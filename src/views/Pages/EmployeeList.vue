<template>
  <div class="user-list">
    <div class="user-list__wrapper">
      <h2 class="user-list__title">Список пользователей</h2>
      <button class="add-user-btn" @click.stop="switchOpenNewUser">
        Добавить пользователя
      </button>
    </div>
    <div class="table-config-bar">
      <div class="table-config-bar__wrapper">
        <input
          type="text"
          v-model="searchValue"
          placeholder="Поиск пользователя"
          class="search-input"
          @change="searchHandler"
        />
        <button class="search-btn" type="search" @click="searchHandler">
          Поиск
        </button>
      </div>
      <div style="width: 100%">
        <button class="icon-btn" @click.stop="switchOpenSettings">
          <img src="@/assets/img/icons/changeSettings.svg" />Поменять поля
        </button>
      </div>
    </div>
    <p v-if="!role">Загрузка...</p>
    <table v-else-if="role === 'super-admin'" class="user-table">
      <thead>
        <tr>
          <th
            v-for="(element, index) in tableVisible"
            :key="index"
            v-show="element.visible"
          >
            {{ element.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="client in userList"
          :key="client.id"
          @click="goToUserDetails(client.id)"
        >
          <td
            v-for="(element, index) in tableVisible"
            :key="index"
            v-show="element.visible"
          >
            <span v-if="index === 'name' || index === 'role'">{{
              index === 'role' ? client[index]?.name : client[index]
            }}</span>

            <span v-else>{{ formatDate(client[index]) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>Нет прав на просмотр</p>

    <ul class="user-list__list">
      <li v-for="page in totalPages" :key="page" class="user-list__item">
        <button
          @click="getData(page)"
          :class="`user-list__btn ${
            page === currentPage ? 'user-list__btn-active' : ''
          }`"
        >
          {{ page }}
        </button>
      </li>
    </ul>
    <ModalSettings
      v-if="isSettingsOpen"
      @closeModal="switchOpenSettings"
      @updateSettings="updateTableSettings"
      :tableData="tableVisible"
    />
    <ModalAddUser
      v-if="isNewUserOpen"
      @closeModal="switchOpenNewUser"
      @updateUsers="getData"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ModalSettings from '@/components/Modal/ModalSettings.vue';
import ModalAddUser from '@/components/Modal/ModalAddUser.vue';

export default {
  components: {
    ModalSettings,
    ModalAddUser,
  },
  computed: {
    ...mapGetters({
      getUsersList: 'admin/getUsersList',
    }),
    role() {
      return this.$store.getters['auth/role']?.role.name;
    },
  },
  data() {
    return {
      searchValue: '',
      userList: [],
      isSettingsOpen: false,
      isNewUserOpen: false,
      tableVisible: {
        name: { visible: true, name: 'ФИО Сотрудника' },
        role: { visible: true, name: 'Роль' },
        updated_at: { visible: true, name: 'Последний визит' },
        created_at: { visible: true, name: 'Дата добавления' },
      },
      startPagination: 1,
      totalPages: null,
      currentPage: null,
    };
  },
  methods: {
    ...mapActions({
      fetchUsersList: 'admin/fetchUsersList',
    }),
    updateTableSettings(data) {
      this.tableVisible = data;
    },
    formatDate(order) {
      const date = new Date(order);
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1;
      let dd = date.getDate();

      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;

      const formattedToday = dd + '.' + mm + '.' + yyyy;

      return formattedToday;
    },
    goToUserDetails(userId) {
      this.$router.push(`/employees/${userId}`);
    },
    searchHandler() {
      if (this.searchValue === '') {
        this.userList = this.getUsersList;
      }

      const searchTerm = this.searchValue.toLowerCase();
      this.userList = this.getUsersList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      );
    },

    switchOpenSettings() {
      this.isSettingsOpen = !this.isSettingsOpen;
    },
    switchOpenNewUser() {
      if (this.role === 'super-admin') {
        this.isNewUserOpen = !this.isNewUserOpen;
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async getData(page) {
      this.currentPage = page;
      await this.fetchUsersList(page).then((res) => {
        this.userList = this.getUsersList;
        this.totalPages = Math.ceil(res.total / res.per_page);
      });
    },
  },
  mounted() {
    this.getData(this.startPagination);
  },
};
</script>

<style scoped lang="scss">
h2 {
  display: flex;
  align-items: center;
}

.user-list {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-right: 6.9%;
  padding-bottom: 20px;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    padding: 5px 0;
  }

  &__item {
    margin: 0 15px;
  }

  &__btn {
    width: 100%;
    border: none;
    padding: 5px 13px;
    border-radius: 5px;
    background-color: #ffcf4f;

    font-size: 16px;
    font-weight: 400;
    line-height: 19px;
    text-align: center;

    color: #000;

    &:hover {
      background-color: #fcecab;
    }

    &-active {
      background: grey;
      pointer-events: none;
    }
  }

  &__title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    line-height: 47px;
    letter-spacing: -0.4px;
    text-align: left;
  }

  &__wrapper {
    display: flex;
    align-items: center;
  }
}

.add-user-btn {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: center;

  border: none;
  background-color: #ffcf4f;
  margin-left: 18px;
  padding: 4.5px 15px;
  max-height: 26px;
  align-items: center;
  border-radius: 3px;

  &:hover {
    background-color: #fcecab;
  }
}

.search-input {
  margin-top: 9px;
  padding: 5px 5px 5px 12px;
  width: 53.5vw;
  height: 32px;
  max-width: 686px;
  border-radius: 6px;
  border: 1px solid #dfe0e5;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: left;

  color: #000;

  outline: none;

  &:focus {
    border: 2px solid #4f420f;
  }
}

.search-btn {
  position: absolute;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: center;

  top: 12px;
  right: 4px;
  border: none;
  padding: 4.5px 30.5px;
  border-radius: 3px;
  background-color: #ffcf4f;

  &:hover {
    background-color: #fcecab;
  }
}

.table-config-bar {
  display: flex;
  justify-content: flex-start;
  margin-top: 7px;
  flex-wrap: wrap;

  &__wrapper {
    position: relative;
  }
}

.icon-btn {
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: left;

  padding: 17px 0 17px 0;
  cursor: pointer;
  background-color: transparent;
  border: none;
  outline: none;
  margin-left: auto;
  display: block;

  &:hover {
    opacity: 0.5;
  }

  img {
    margin-right: 5px;
  }
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  height: 100%;
  display: block;
  overflow: auto;

  border: 1px solid #ddd;

  &::-webkit-scrollbar {
    width: 2px;
    height: 5px;
    background-color: inherit;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
  }
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  color: #000000;

  &:not(:last-child) {
    border-right: 1px solid #ddd;
  }
  &:first-child {
    width: 100%;
  }
}

td {
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  letter-spacing: 0.03em;
  text-align: left;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &:not(:last-child) {
    border-right: 1px solid #ddd;
  }
}

tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>

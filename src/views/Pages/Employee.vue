<template>
  <div class="employee">
    <router-link class="employee__link" :to="{name: 'AdminEmployeeList'}">
      <img src="@/assets/img/icons/arrow-back.svg" />
      <span>обратно к списку</span>
    </router-link>
    <div class="employee__name-wrapper">
      <input
        v-model="userName.name"
        class="employee__name"
        @input.stop="updateUserData"
      />
      <img class="employee__writteble" src="@/assets/img/icons/redacting.svg" />
    </div>
    <div class="employee__information-wrapper">
      <p class="employee__title">
        Роль: <span>{{ userRole }}</span>
      </p>
      <p class="employee__title employee__title-date">
        Последний визит: <span>{{ formatDate(user.updated_at) }}</span>
      </p>
    </div>
    <h3 class="employee__title employee__title-panel">Панель управления</h3>
    <ul class="employee__list">
      <li class="employee__item" v-for="btn in buttons" :key="btn.name">
        <button class="employee__btn" @click.stop="btn.action">
          {{ btn.name }}
        </button>
      </li>
    </ul>
    <div style="width: 100%">
      <button
        class="employee__btn employee__btn-delete"
        @click.stop="switchModalAccept('remove')"
      >
        удалить сотрудника
      </button>
    </div>
    <ModalAccept
      v-if="isVisibleModalAccept"
      @acceptDelete="removeUser"
      @closeModal="switchModalAccept"
      :description="modalAcceptType"
      @acceptUpdate="updateEmployee"
    />
    <ModalChangeUserPassword
      v-if="isVisibleModalChangePassword"
      @acceptChangePassword="changePassword"
      @closeModal="switchModalChangePassword"
    />
    <ModalChangeLogin
      v-if="isVisibleModalChangeLogin"
      @acceptChangeLogin="changeLogin"
      @closeModal="switchModalLogin"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ModalAccept from '@/components/Modal/ModalAccept.vue';
import ModalChangeUserPassword from '@/components/Modal/ModalChangeUserPassword.vue';
import ModalChangeLogin from '@/components/Modal/ModalChangeLogin.vue';

export default {
  components: {
    ModalAccept,
    ModalChangeUserPassword,
    ModalChangeLogin,
  },
  computed: {
    ...mapGetters('admin', ['getUser']),
    user() {
      return this.getUser;
    },
    userRole() {
      return this.getUser?.role?.name || '';
    },
  },
  data() {
    return {
      userName: {
        name: 'Шуриков Жедан Олегович',
      },
      modalAcceptType: '',
      isVisibleModalAccept: false,
      isVisibleModalChangePassword: false,
      isVisibleModalChangeLogin: false,
      buttons: [
        {
          name: 'Сделать администратором',
          action: this.makeAdmin,
        },
        {
          name: 'Поменять пароль',
          action: this.switchModalChangePassword,
        },
        {
          name: 'Поменять имя',
          action: () => this.switchModalAccept('update'),
        },
        {
          name: 'Поменять логин',
          action: this.switchModalLogin,
        },
      ],
    };
  },
  methods: {
    ...mapActions('admin', ['fetchUser', 'assignUserRole', 'deleteUser']), // Import fetchUser action
    changedOptions() {
      let options = {};
      if (this.userName.changed) {
        options = {
          name: this.userName.name,
        };
      }

      let noEmpty = Object.keys(options).length !== 0;

      return {
        options,
        noEmpty,
      };
    },
    switchModalAccept(title) {
      this.modalAcceptType = title;
      if (title === 'update') {
        this.isVisibleModalAccept = this.changedOptions().noEmpty;
      } else {
        this.isVisibleModalAccept = !this.isVisibleModalAccept;
      }
    },
    switchModalLogin() {
      this.isVisibleModalChangeLogin = !this.isVisibleModalChangeLogin;
    },
    async changeLogin(login) {
      console.log(login);
      const data = {
        id: this.user.id,
        login: login,
      };

      const res = await this.$store.dispatch('admin/updateUser', data);

      if (res) {
        this.getData();
      }
    },
    updateUserData() {
      this.userName.changed = true;
    },
    async updateEmployee() {
      console.log('updateEmployee');
      const data = {
        id: this.user.id,
        name: this.userName.name,
      };

      const res = await this.$store.dispatch('admin/updateUser', data);

      if (res) {
        this.getData();
        if (this.userName.changed) {
          delete this.userName.changed;
        }
      }
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
    async makeAdmin() {
      const role = 'super-admin';
      const userId = this.user.id;
      const res = await this.assignUserRole({ userId, role });
      this.getData();
    },
    switchModalChangePassword() {
      this.isVisibleModalChangePassword = !this.isVisibleModalChangePassword;
    },
    async changePassword(password) {
      const data = {
        id: this.user.id,
        password,
      };

      const res = await this.$store.dispatch('admin/updateUser', data);

      if (res) {
        this.getData();
        this.switchModalChangePassword();
      }
    },
    async removeUser() {
      const res = await this.deleteUser(this.user.id);

      if (res) {
        this.$router.push(`/employees`);
      }
    },
    async getData() {
      const res = await this.fetchUser(this.$route.params.userId);

      this.userName.name = res.name;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped lang="scss">
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
p {
  margin: 0;
}
.employee {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 62px;

  &__writteble {
    position: relative;
    right: 10px;
    top: -3px;
  }

  &__information-wrapper {
    width: 100%;
    margin-top: 47px;
  }

  &__list {
    margin-top: 20px;
  }

  &__item:not(:last-child) {
    margin-bottom: 10px;
  }

  &__title {
    display: flex;
    margin: 0;
    margin-left: 3px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: left;

    &-panel {
      width: 100%;
      margin-top: 49px;
    }

    &-date {
      margin-top: 8px;
    }

    span {
      margin-left: 16px;
      font-size: 14px;
      font-weight: 700;
      line-height: 17px;
      letter-spacing: 0.03em;
      text-align: left;

      color: #292824;
    }
  }

  &__link {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: left;
    text-decoration: none;

    color: #292824;

    span {
      margin-left: 7px;
    }
  }

  &__name {
    border: none;
    width: fit-content;
    outline: none;

    font-size: 24px;
    font-weight: 600;
    line-height: 28px;
    letter-spacing: -0.5px;
    text-align: left;

    background: inherit;

    &-wrapper {
      width: 100%;
      margin-top: 9px;
      position: relative;
    }
  }

  &__btn {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: center;

    border: none;
    background-color: #ffcf4f;
    padding: 4.5px 15px;
    max-height: 26px;
    align-items: center;
    border-radius: 3px;

    &-delete {
      margin-top: 37px;
    }

    &:hover {
      background-color: #fcecab;
    }
  }
}
</style>

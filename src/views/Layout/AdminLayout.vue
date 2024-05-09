<template>
  <div class="admin-layout">
    <notifications></notifications>
    <div class="admin-layout__sidebar">
      <div class="admin-layout__logo">
        <img src="@/assets/img/icons/admin.svg" />
        <h2 class="admin-layout__title">АДМИНКА</h2>
      </div>

      <ul class="admin-layout__list">
        <li class="admin-layout__item" v-for="item in menuLinks" :key="item.id">
          <router-link
            class="admin-layout__link"
            :to="{ path: `/${item.link}` }"
          >
            {{ item.name }}
          </router-link>
        </li>
        <li class="admin-layout__item">
          <a
            class="admin-layout__link admin-layout__link-exit"
            href=""
            @click="logout"
          >
            Выйти из админки
          </a>
        </li>
      </ul>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AdminLayout',
  data() {
    return {
      menuLinks: [
        {
          id: 1,
          name: 'Список пользователей',
          link: 'clients',
        },
        {
          id: 2,
          name: 'Лента и уведомления',
          link: 'feed',
        },
        {
          id: 3,
          name: 'Список сотрудников',
          link: 'employees',
        },
        {
          id: 4,
          name: 'Стоимость доставки',
          link: 'delivery',
        },
        {
          id: 5,
          name: 'Курсы валют',
          link: 'exchange',
        },
        {
          id: 6,
          name: 'Промокоды',
          link: 'promo',
        },
        {
          id: 7,
          name: 'Категории',
          link: 'categories',
        },
        {
          id: 8,
          name: 'Упаковка',
          link: 'packages',
        },
        // {
        //   id: 9,
        //   name: 'Прочее',
        //   link: 'misc',
        // },
      ],
    };
  },
  computed: {
    tg_id() {
      if (localStorage.getItem('vue-authenticate.vueauth_access_token')) {
        return localStorage.getItem('vue-authenticate.vueauth_access_token');
      }
    },

    api_key() {
      if (localStorage.getItem('auth_key')) {
        return localStorage.getItem('auth_key');
      }
    },
  },
  methods: {
    ...mapActions({
      logout: 'auth/logout',
      role: 'auth/adminRole',
    }),
  },
  async mounted() {
    await this.role();
    this.$store.commit('auth/SET_TG_ID', this.tg_id);
    this.$store.commit('auth/SET_API_KEY', this.api_key);
  },
};
</script>

<style scoped lang="scss">
.admin-layout {
  display: flex;
  height: 100vh;
  /* overflow: hidden; */

  &__logo {
    display: flex;
    align-items: center;
    padding-bottom: 18px;
    border-bottom: 1px solid #000000;

    img {
      width: 13px;
      height: 13px;
    }
  }

  &__title {
    margin: 0;
    margin-left: 6px;
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
    text-align: left;

    color: #000000;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    min-width: 257px;
    margin: 4.7vw 0 0 4vw;
    background-color: hsla(230, 29%, 92%, 1);
    border-radius: 10px;
    padding: 30px 30px 40px 30px;
    max-height: 655px;
  }

  &__link {
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: left;
    color: #292824;

    text-decoration: none;

    &:hover {
      border-bottom: 1px solid #292824;
    }

    &-exit {
      margin-top: auto;
    }
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 30px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  &__item {
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 22px;
    }

    &:last-child {
      margin-top: auto;
      margin-bottom: 0;
    }

    .active {
      font-weight: 700;
    }
  }
}

.content {
  flex-grow: 1;
  padding: 5.2% 0 0px 2.1%;
  box-sizing: border-box;
  width: 75%;
}
</style>

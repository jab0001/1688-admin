<template>
  <div class="client">
    <router-link class="client__link" :to="{name: 'AdminClientList'}">
      <img src="@/assets/img/icons/arrow-back.svg" />
      <span>обратно к списку</span>
    </router-link>
    <div class="client__name-wrapper">
      <input v-model="userName.name" class="client__name" @input.stop="updateClientData('', 'userName')" />
      <img class="client__writteble" style="position: relative; top: -3px" src="@/assets/img/icons/redacting.svg" />
    </div>
    <div class="client__side client__side-left">
      <div class="client__wrapper">
        <h3 class="client__title client__title-analitics">Аналитика</h3>
        <ul class="client__list">
          <li class="client__item" v-for="(analitic, index) in analitics" :key="index">
            <p class="client__text client__text-name">{{ analitic.name }}</p>
            <input type="text" v-model="analitic.value" class="client__text client__text-value"
              :readonly="analitic.disable" />
          </li>
        </ul>
      </div>
      <div class="client__wrapper">
        <h3 class="client__title client__title-information">
          Информация о клиенте
        </h3>
        <ul class="client__list">
          <li class="client__item" v-for="(information, index) in informations" :key="index">
            <p class="client__text client__text-name">{{ information.name }}</p>
            <input v-model="information.value" :readonly="information.disable"
              :class="`client__text client__text-value ${changedInputStyleClass(index)}`"
              @input.stop="updateClientData('informations', index)" />
            <img v-if="!information.disable" class="client__writteble" src="@/assets/img/icons/redacting.svg" />
          </li>
        </ul>
      </div>
    </div>
    <div class="client__side client__side-right">
      <div class="client__wrapper">
        <h3 class="client__title client__title-panel">Панель управления</h3>
        <ul class="client__list">
          <li class="client__item client__item-panel">
            <button class="client__btn" @click="sentNewPassword('sendSms')">
              Отправить смс с новым паролем
            </button>
          </li>
          <li class="client__item client__item-panel">
            <button class="client__btn" @click="sentNewPassword('sendEmail')">
              Отправить новый пароль на почту
            </button>
          </li>
        </ul>
      </div>
      <div class="client__wrapper">
        <h3 class="client__title client__title-orders">
          Список заказов пользователя:
          <button class="client__btn" @click="switchModalNewOrder">
            Добавить заказ
          </button>
        </h3>
        <ul class="client__list">
          <li class="client__item order" v-for="order in orderList" :key="order.id"
            @click="goToClientOrder(userId, order.id)">
            <ul class="client__list order__list">
              <li class="order__item order__item-marking">
                <img src="@/assets/img/icons/order-icon.svg" style="margin-right: 10px" />
                {{ order.marking }}
              </li>
              <li class="order__item order__item-price">{{ order.price }} P</li>
              <li class="order__item order__item-status">
                {{ order.status_product }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div style="width: 100%; margin-top: 50px">
      <button class="client__btn" @click.stop="switchModalAccept('remove')">
        Удалить пользователя
      </button>
      <button class="client__btn" style="margin-left: 10px" @click.stop="switchModalAccept('update')">
        Сохранить
      </button>
    </div>
    <ModalAccept v-if="isVisibleModalAccept" @acceptDelete="deleteClient" @closeModal="switchModalAccept"
      :description="modalAcceptType" @acceptUpdate="updateClient" />
  </div>
</template>

<script>
import ModalAccept from '@/components/Modal/ModalAccept.vue';

export default {
  components: {
    ModalAccept,
  },
  data() {
    return {
      userName: {
        name: 'Митриков Андур Шурасович',
      },
      modalNewOrder: false,
      isVisibleModalAccept: false,
      modalAcceptType: '',
      analitics: {
        orders_count: {
          name: 'Всего заказов',
          value: '',
          disable: true,
        },
        orders_total_price: {
          name: 'Сумма заказов',
          value: '',
          disable: true,
        },
        orders_total_commission: {
          name: 'Сумма комисии',
          value: '',
          disable: true,
        },
      },
      informations: {
        id: {
          name: 'FLG ID',
          value: '',
          disable: true,
        },
        amoId: {
          name: 'AMO ID',
          value: '',
          disable: true,
        },
        marking: {
          name: 'Маркировка',
          value: '',
          disable: true,
        },
        email: {
          name: 'E-mail',
          value: '',
          disable: false,
        },
        phone: {
          name: 'Телефон',
          value: '',
          disable: false,
        },
        created_at: {
          name: 'Добавлен',
          value: '',
          disable: true,
        },
        long_promo: {
          name: 'Промокод',
          value: '',
          disable: false,
        },
        comission: {
          name: 'Коммисия',
          value: '',
          disable: true,
        },
        min_sum: {
          name: 'Мин. Сумма',
          value: '',
          disable: true,
        },
        address: {
          name: 'Адрес',
          value: '',
          disable: false,
        },
      },
    };
  },
  computed: {
    client() {
      return this.$store.getters['admin/getClient'];
    },
    orderList() {
      return this.$store.getters['admin/getClientOrders'];
    },
    userId() {
      return this.$route.params.userId;
    },
  },
  methods: {
    updateClientData(obj, data) {
      if (obj) {
        this[obj][data].changed = true;
      } else {
        this[data].changed = true;
      }
    },
    changedInputStyleClass(key) {
      const changedFields = Object.keys(this.changedOptions().options);
      return changedFields.includes(key) ? 'client__text-value__changed' : ''
    },
    changedOptions() {
      let options = {};
      if (this.userName.changed) {
        Object.assign(options, { name: this.userName.name });
      }
      for (const key in this.informations) {
        if (this.informations[key].hasOwnProperty('changed')) {
          Object.assign(options, { [key]: this.informations[key].value });
        }
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
    goToClientOrder(userId, orderId) {
      this.$router.push(`/clients/${userId}/order/${orderId}`);
    },
    async getClientData() {
      const res = await this.$store.dispatch('admin/fetchClient', this.userId);

      this.analitics.orders_count.value = res.orders_count;
      this.analitics.orders_total_price.value = `${res.orders_total_price} P`;
      this.analitics.orders_total_commission.value = `${parseFloat(
        res.orders_total_commission
      )} P`;
      this.userName.name = res.username;

      for (const key in this.informations) {
        this.informations[key].value = res[key];
        if (key === 'long_promo') {
          this.informations[key].value = res[key].name;
        }
        if (key === 'created_at') {
          this.informations[key].value = this.formatDate(res[key]);
        }
        if (key === 'phone') {
          this.informations[key].value = +res[key];
        }
      }
    },
    async getOrdersData() {
      const res = await this.$store.dispatch(
        'admin/fetchClientOrders',
        this.userId
      );
    },
    async deleteClient() {
      const res = await this.$store.dispatch('admin/deleteClient', this.userId);

      if (res) {
        this.$router.push(`/clients`);
      }
    },
    async updateClient() {
      console.log('update', this.changedOptions());
      let inputs = this.changedOptions().options;

      let data = {
        id: this.userId,
      };

      for (const key in inputs) {
        if (key === 'phone') {
          Object.assign(data, { [key]: inputs[key].replace(/[-()\s]/g, '') });
        } else if (key === 'long_promo') {
          Object.assign(data, { promo: inputs[key] });
        } else {
          Object.assign(data, { [key]: inputs[key] });
        }
      }

      const res = await this.$store.dispatch('admin/updateClient', data);

      if (res) {
        this.getClientData();
        for (const key in inputs) {
          if (key === 'name') {
            delete this.userName.changed;
          } else {
            delete this.informations[key].changed;
          }
        }
      }
    },
    async sentNewPassword(to) {
      const res = await this.$store.dispatch(`admin/${to}`, this.userId);

      if (res) {
        this.$notify({
          type: 'success',
          message: `password ${to}`,
        });
      }
    },
    switchModalNewOrder() {
      console.log('openModalNewOrder');
      this.modalNewOrder = !this.modalNewOrder;
    },
  },
  mounted() {
    this.getClientData();
    this.getOrdersData();
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

.client {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 62px;

  &__writteble {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  &__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0.03em;
    padding: 10px 0;

    display: flex;
    align-items: center;

    &-value {
      padding: 0;
      margin: 0;
      background: inherit;
      border: none;
      outline: none;

      width: 59%;
      justify-content: flex-start;
      text-align: left;
      padding-left: 9px;
      padding-right: 24px;

      &:not([readonly]):focus {
        border: 1px solid #4f420f;
      }

      &__changed {
        background: #fff9d7;
      }
    }

    &-name {
      width: 41%;
      height: 100%;
      padding-right: 9px;
      justify-content: flex-end;
      text-align: right;
      border-right: 1px solid #e4e6f0;
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

  &__title {
    display: flex;
    margin: 0;
    margin-left: 3px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: left;

    &-analitics {
      margin-bottom: 18px;
    }

    &-information {
      margin-top: 34px;
      margin-bottom: 9px;
    }

    &-panel {
      margin-bottom: 20px;
    }

    &-orders {
      margin-top: 50px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 77%;
    }
  }

  &__side {
    padding-top: 29px;
    width: 50%;

    &-right {
      padding-left: 5.8%;
      padding-right: 10%;
      flex-grow: 1;
      max-width: 65%;
    }

    &-left {
      max-width: 330px;
      padding-left: 5px;
    }
  }

  &__item {
    position: relative;
    display: flex;
    border: 1px solid #e4e6f0;

    &-panel {
      border: none;
      margin-left: 2px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
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
    align-items: center;
    border-radius: 3px;

    &:hover {
      background-color: #fcecab;
    }
  }

  .order {
    background: #fff;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    &:not(:last-child) {
      margin-bottom: 13px;
    }

    &__list {
      display: flex;
      width: 100%;
    }

    &__item {
      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      letter-spacing: 0.03em;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:not(:last-child) {
        border-right: 1px solid #e4e6f0;
      }

      &-price {
        width: 27%;
      }

      &-status {
        width: 41%;
        text-align: center;
      }

      &-marking {
        width: 32%;
      }
    }
  }
}
</style>

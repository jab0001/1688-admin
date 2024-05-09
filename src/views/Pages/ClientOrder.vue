<template>
  <div class="order">
    <router-link class="order__link" :to="`/clients/${userId}`">
      <img src="@/assets/img/icons/arrow-back.svg" />
      <span
        >{{ client.username }}
        <!-- <img class="order__writteble" src="@/assets/img/icons/redacting.svg"
      /> --></span
      >
    </router-link>
    <div class="order__name-wrapper">
      <span class="order__name">{{ order.marking }}</span>
      <button class="order__btn" @click.stop="switchModalAccept('remove')">
        Удалить заказ
      </button>
    </div>
    <div class="order__side order__side-left">
      <div class="order__wrapper">
        <h3 class="order__title order__title-left">Описание</h3>
        <ul class="order__list">
          <li
            class="order__item"
            v-for="(description, index) in descriptions"
            :key="index"
          >
            <p class="order__text order__text-name">{{ description.name }}</p>
            <input
              v-if="description.name !== 'Задачи менеджеру'"
              type="text"
              v-model="description.value"
              :readonly="description.disable"
              :class="`order__text order__text-value ${changedInputStyleClass(
                index
              )}`"
              @input.stop="updateOrderData('descriptions', index)"
            />
            <div v-else style="width: 61%">
              <div
                v-for="(item, index) in description.value"
                :key="index"
                style="display: flex"
              >
                <textarea
                  style="padding: 9px; flex-grow: 1"
                  type="text"
                  v-model="description.value[index].title"
                  :readonly="description.disable"
                  :class="`order__text order__text-value ${changedInputStyleClass(
                    index
                  )}`"
                  @input.stop="updateOrderData('descriptions', 'comment')"
                />
                <div :class="`${item.count ? 'suffix' : 'no-suffix'}`">
                  <input
                    type="text"
                    v-model="description.value[index].count"
                    :readonly="description.disable"
                    style="padding: 0;"
                    :class="`order__text order__text-value ${changedInputStyleClass(
                      'comment'
                    )} ${item.count ? 'suffix' : 'no-suffix'}`"
                    @input.stop="updateOrderData('descriptions', 'comment')"
                  />
                  <span class="suffix__span">шт.</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="order__side order__side-right">
      <div class="order__wrapper">
        <h3 class="order__title order__title-right">Общее по заказу</h3>
        <ul class="order__list">
          <li
            class="order__item"
            v-for="(item, index) in informations"
            :key="index"
          >
            <p class="order__text order__text-name">{{ item.name }}</p>
            <input
              v-model="item.value"
              :readonly="item.disable"
              :class="`order__text order__text-value ${changedInputStyleClass(
                index
              )}`"
              @input.stop="updateOrderData('informations', index)"
            />
            <img
              v-if="!item.disable"
              class="order__writteble"
              src="@/assets/img/icons/redacting.svg"
            />
          </li>
        </ul>
      </div>
    </div>

    <div class="order__side order__side-left">
      <div class="order__wrapper">
        <h3 class="order__title order__title-left">Оплата</h3>
        <ul class="order__list">
          <li
            class="order__item"
            v-for="(payment, index) in payments"
            :key="index"
          >
            <p class="order__text order__text-name">{{ payment.name }}</p>
            <input
              v-if="payment.type === 'text'"
              type="text"
              v-model="payment.value"
              :readonly="payment.disable"
              :class="`order__text order__text-value ${changedInputStyleClass(
                index
              )}`"
              @input.stop="updateOrderData('payments', index)"
              @focus="onClickInputPayment(payment)"
              @blur="onBlurInputPayment(payment)"
            />
            <div v-else class="drop-down">
              <DropDownComponent
                :items="statusDropDownMenuItems"
                :selectedId="payment.value"
                :isChanged="payment.changed"
                @select-item="changePaymentStatus($event, index)"
              />
            </div>
            <img
              v-if="!payment.disable && payment.type === 'text'"
              class="order__writteble"
              src="@/assets/img/icons/redacting.svg"
            />
          </li>
        </ul>
      </div>
    </div>

    <div class="order__side order__side-middle">
      <h3 class="order__title order__title-middle">Состав заказа</h3>
      <ul class="order__list delivery">
        <li class="delivery-row">
          <ul class="delivery__list delivery__list-title">
            <li
              :class="`delivery__item delivery__item-title delivery__item-${
                index + 1
              }`"
              v-for="(item, index) in deliveryList"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </li>
        <li
          class="delivery-row"
          v-for="(orderItem, index) in orderOptions.orderItems"
          :key="orderItem.id"
        >
          <ul
            class="delivery__list"
            v-for="item in orderItem.items"
            :key="item.id"
          >
            <li class="delivery__item delivery__item-1">
              {{ index }}
            </li>
            <li class="delivery__item delivery__item-2">
              {{ item.title ?? item.option_title }}
            </li>
            <li class="delivery__item delivery__item-3">
              <a :href="item.img" target="_blank">просмотреть изображение</a>
            </li>
            <li class="delivery__item delivery__item-4">
              {{ item.model ?? item.model_title }}
            </li>
            <li class="delivery__item delivery__item-5">
              {{ item.count }}
            </li>
            <li class="delivery__item delivery__item-6">
              {{ item.price }}
            </li>
            <li class="delivery__item delivery__item-7">
              {{ item.sum }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div style="width: 100%; margin-top: 50px">
      <button class="order__btn" @click.stop="switchModalAccept('update')">
        Сохранить
      </button>
    </div>
    <ModalAccept
      v-if="isVisibleModalAccept"
      @acceptDelete="deleteOrder"
      @closeModal="switchModalAccept"
      :description="modalAcceptType"
      @acceptUpdate="updateOrder"
    />
  </div>
</template>

<script>
import ModalAccept from '@/components/Modal/ModalAccept.vue';
import DropDownComponent from '@/views/Components/DropDownComponent.vue';

export default {
  components: {
    DropDownComponent,
    ModalAccept,
  },
  data() {
    return {
      deliveryList: [
        '№',
        'Название',
        'Изображение',
        'Модель',
        'Кол-во',
        'Цена',
        'Итог',
      ],
      statusDropDownMenuItems: [
        {
          name: 'Оплачено',
        },
        {
          name: 'Не оплачено',
        },
      ],
      selectedDropDownMenuItem: 0,
      paymentCurrency: ' RUB',
      isVisibleModalAccept: false,
      modalAcceptType: '',
      descriptions: {
        volume: {
          name: 'Объем',
          value: '',
          disable: false,
        },
        weight: {
          name: 'Вес',
          value: '',
          disable: false,
        },
        package: {
          name: 'Упаковка',
          value: '',
          disable: false,
        },
        boxes: {
          name: 'Кол-во коробок',
          value: '',
          disable: false,
        },
        comment: {
          name: 'Задачи менеджеру',
          value: [],
          disabled: false,
        },
        delivery_address: {
          name: 'Адрес доставки',
          value: '',
          disable: false,
        },
      },
      informations: {
        name: {
          name: 'Заказ',
          value: '',
          disable: true,
        },
        username: {
          name: 'Заказчик',
          value: '',
          disable: true,
        },
        created_at: {
          name: 'Дата заказа',
          value: '',
          disable: true,
        },
        commission_rub: {
          name: 'Комиссия',
          value: '',
          disable: false,
        },
        discount: {
          name: 'Скидка',
          value: '',
          disable: false,
        },
        price: {
          name: 'Сумма заказа',
          value: '',
          disable: false,
        },
      },
      payments: {
        totalProductPrice: {
          name: 'Цена товара',
          value: '',
          disable: false,
          type: 'text',
        },
        payPaymentStatus: {
          name: 'Статус оплаты платежа',
          value: 0,
          disable: false,
          type: 'dropDownList',
        },
        deliveryPrice: {
          name: 'Цена доставки',
          value: '',
          disable: false,
          type: 'text',
        },
        productPaymentStatus: {
          name: 'Статус оплаты товара',
          value: 0,
          disable: false,
          type: 'dropDownList',
        },
      },
      orderOptions: {},
    };
  },
  computed: {
    client() {
      return this.$store.getters['admin/getClient'];
    },
    order() {
      return this.$store.getters['admin/getOrder'];
    },
    userId() {
      return this.$route.params.userId;
    },
    orderId() {
      return this.$route.params.orderId;
    },
    role() {
      return this.$store.getters['auth/role']?.role.name;
    },
  },
  methods: {
    changePaymentStatus(event, index) {
      this.payments[index].value = event;
      this.updateOrderData('payments', index);
      console.log(this.payments);
    },
    onClickInputPayment(obj) {
      obj.value = obj.value.slice(0, 0 - this.paymentCurrency.length);
    },
    onBlurInputPayment(obj) {
      obj.value += this.paymentCurrency;
    },
    updateOrderData(obj, data) {
      console.log(obj, data);
      if (obj) {
        this[obj][data].changed = true;
      } else {
        this[data].changed = true;
      }
    },
    changedInputStyleClass(key) {
      const changedFields = Object.keys(this.changedOptions().options);
      return changedFields.includes(key) ? 'order__text-value__changed' : '';
    },
    changedOptions() {
      let options = {};
      for (const key in this.informations) {
        if (this.informations[key].hasOwnProperty('changed')) {
          Object.assign(options, { [key]: this.informations[key].value });
        }
      }

      for (const key in this.descriptions) {
        if (this.descriptions[key].hasOwnProperty('changed')) {
          Object.assign(options, { [key]: this.descriptions[key].value });
        }
      }

      for (const key in this.payments) {
        if (this.payments[key].hasOwnProperty('changed')) {
          Object.assign(options, { [key]: this.payments[key].value });
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
      if (title === 'remove' && this.role !== 'super-admin') {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
        return;
      }
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
    makeDataObj(orderInfo) {
      let comments = [];
      if (orderInfo.options.checking) {
        orderInfo.options.checking.map((item) => {
          if (item.isActive) {
            comments.push(item);
          }
        });
      }
      console.log('comments', comments);
      this.descriptions.volume.value = orderInfo?.options?.volume;
      this.descriptions.weight.value = orderInfo?.options?.weight;
      this.descriptions.package.value = orderInfo?.package?.title;
      this.descriptions.boxes.value = orderInfo?.options?.boxes?.length;
      this.descriptions.comment.value = comments;
      this.descriptions.delivery_address.value = orderInfo?.delivery_address;
      this.informations.name.value = orderInfo?.name;
      this.informations.username.value = orderInfo?.client?.username;
      this.informations.created_at.value = orderInfo?.created_at
        ? this.formatDate(orderInfo.created_at)
        : null;
      this.informations.commission_rub.value = orderInfo?.commission_rub;
      this.informations.discount.value = orderInfo?.discount;
      this.informations.price.value = orderInfo?.price;

      this.payments.totalProductPrice.value =
        orderInfo?.options?.totalProductPrice + this.paymentCurrency;
      this.payments.payPaymentStatus.value = 0;
      this.payments.productPaymentStatus.value = 1;
      this.payments.deliveryPrice.value =
        orderInfo?.options?.deliveryPrice + this.paymentCurrency;
    },
    async getClientData() {
      const res = await this.$store.dispatch('admin/fetchClient', this.userId);
    },
    async updateOrder() {
      const data = {
        id: this.orderId,
      };

      let inputs = this.changedOptions().options;

      for (const key in inputs) {
        if (
          key === 'volume' ||
          key === 'weight' ||
          key === 'boxes' ||
          key === 'totalProductPrice' ||
          key === 'deliveryPrice'
        ) {
          Object.assign(data, {
            options: { ...this.orderOptions, [key]: inputs[key] },
          });
        } else {
          Object.assign(data, { [key]: inputs[key] });
        }
      }

      const res = await this.$store.dispatch('admin/updateOrder', data);

      if (res) {
        this.getOrderData();
        for (const key in inputs) {
          if (
            key === 'commission_rub' ||
            key === 'discount' ||
            key === 'price'
          ) {
            delete this.informations[key].changed;
          } else if (
            key === 'totalProductPrice' ||
            key === 'deliveryPrice' ||
            key === 'payPaymentStatus' ||
            key === 'productPaymentStatus'
          ) {
            delete this.payments[key].changed;
          } else {
            delete this.descriptions[key].changed;
          }
        }
      }
    },

    async getOrderData() {
      const res = await this.$store.dispatch('admin/fetchOrder', this.orderId);
      this.orderOptions = res.options;
      this.makeDataObj(res);
    },
    async deleteOrder() {
      const res = await this.$store.dispatch('admin/deleteOrder', this.orderId);

      if (res) {
        this.getOrderData();
      }
    },
  },
  mounted() {
    this.getClientData();
    this.getOrderData();
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

.drop-down {
  width: 61%;
}

.suffix {
  max-width: 20%;
  padding-left: 4px;
  position: relative;
  display: flex;
  align-items: center;

  &__span {
    margin-left: 2px;
  }
}

.no-suffix {
  display: none !important;
}
.order {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 62px;

  &__writteble {
    position: absolute;
    right: 7px;
    top: 9px;
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

      width: 61%;
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
      width: 39%;

      padding-right: 9px;
      justify-content: flex-end;
      text-align: right;
      border-right: 1px solid #e4e6f0;
    }
  }

  &__link {
    position: relative;

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
      margin-top: 11px;
      padding-right: 16.7%;
      display: flex;
      justify-content: space-between;
    }
  }

  &__title {
    display: flex;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0.03em;
    text-align: left;

    &-left {
      margin-bottom: 20px;
    }

    &-right {
      margin-bottom: 18px;
    }

    &-middle {
      margin-bottom: 20px;
      margin-top: 23px;
    }
  }

  &__side {
    padding-top: 29px;
    width: 50%;

    &-right {
      padding-left: 8.9%;
      padding-right: 16.7%;
      flex-grow: 1;
    }

    &-left {
      max-width: 351px;
    }

    &-middle {
      width: 78.5%;
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

  &__item {
    position: relative;
    display: flex;
    border: 1px solid #e4e6f0;
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

    &:hover {
      background-color: #fcecab;
    }
  }
}

.delivery {
  display: flex;
  flex-direction: column;

  &__item {
    border: 1px solid #e5e6eb;
    border-left: none;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 14px;
    font-weight: 300;
    line-height: 17px;

    color: #000000;

    a {
      text-align: center;
      color: #000;
      text-decoration: none;

      &:hover {
        opacity: 0.5;
      }
    }

    &-title {
      font-size: 14px;
      font-weight: 700;
      line-height: 17px;
      letter-spacing: 0.03em;

      color: #000;
    }

    &:first-child {
      border-left: 1px solid #e5e6eb;
    }

    &:last-child {
      border-left: none;
    }

    &-1 {
      width: 7%;
    }

    &-2 {
      width: 33%;
    }

    &-3 {
      width: 15%;
    }

    &-4 {
      width: 17%;
    }

    &-5 {
      width: 9.5%;
    }

    &-6 {
      width: 8%;
    }

    &-7 {
      width: 10%;
    }
  }

  &__list {
    display: flex;

    height: 52px;

    &-title {
      height: 37px;
    }
  }
}
</style>

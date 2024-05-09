<template>
  <div class="exchange-rates_inner">
    <div class="exchange-rates_view" v-if="isVisible">
      <div class="exchange-rates_items">
        <div class="exchange-rates_items">
          <h2>Курс юаня к рублю</h2>
          <div class="exchange-rates_item">
            <span class="exchange-rates_item_header">Мин. сумма</span>
            <span class="exchange-rates_item_header">Курс</span>
          </div>
          <div class="exchange-rates_item" v-for="(item, index) in courses.cny_rub" :key="index">
            <span>{{ item.course }}¥ - {{ item.orderPrice }}₽</span>
          </div>
        </div>
        <br />
        <div class="exchange-rates_items">
          <h2>Курс доллара к юаню</h2>
          <div class="exchange-rates_item">
            <span class="exchange-rates_item_header">Мин. сумма</span>
            <span class="exchange-rates_item_header">Курс</span>
          </div>
          <div class="exchange-rates_item" v-for="(item, index) in courses.usd_rub" :key="index">
            <span>{{ item.course }}¥ - {{ item.orderPrice }}₽</span>
          </div>
        </div>
      </div>
      <button
        class="exchange-rates_change btn base-button text-dark"
        @click="openExchange"
      >
        Редактировать курсы
      </button>
    </div>
    <div class="exchange-rates_change" v-else>
      <form class="exchange-rates_form">
        <div class="exchange-rates_items">
          <h2>Курс юаня к рублю</h2>
          <div class="exchange-rates_item">
            <span class="exchange-rates_item_header">Мин. сумма</span>
            <span class="exchange-rates_item_header">Курс</span>
          </div>
        </div>
        <div class="exchange-rates_form_item" v-for="(item, index) in form.cny_rub" :key="index">
          <input class="rounded-sm text-dark form-control" type="number" step="10000" min="0"
            v-model.number="item.orderPrice" />
          <input class="rounded-sm text-dark form-control" type="number" step="0.01" min="0.1"
            v-model.number="item.course" />
        </div>
        <div class="exchange-rates_items">
          <h2>Курс доллара к юаню</h2>
          <div class="exchange-rates_item">
            <span class="exchange-rates_item_header">Мин. сумма</span>
            <span class="exchange-rates_item_header">Курс</span>
          </div>
        </div>
        <div class="exchange-rates_form_item" v-for="(item, index) in form.usd_rub" :key="index">
          <input class="rounded-sm text-dark form-control" type="number" step="10000" min="0"
            v-model.number="item.orderPrice" />
          <input class="rounded-sm text-dark form-control" type="number" step="0.01" min="0.1"
            v-model.number="item.course" />
        </div>
      </form>
      <div class="exchange-rates_btns">
        <button class="exchange-rates_change btn base-button text-dark" @click="updateExchangeRates">
          Сохранить
        </button>
        <button class="exchange-rates_change btn base-button text-dark" @click="isVisible = !isVisible">
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExchangeRates',

  data() {
    return {
      courses: {},
      isVisible: true,
      form: {
        cny_rub: {},
        usd_rub: {},
      }
    };
  },

  computed: {
    tg_id() {
      return this.$store.getters['auth/tg_id'];
    },
    api_key() {
      return this.$store.getters['auth/api_key'];
    },
    role() {
      return this.$store.getters['auth/role']?.role.name;
    },
  },

  methods: {
    openExchange() {
      if (this.role === 'super-admin') {
        this.isVisible = !this.isVisible;
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async getExchangeRates() {
      await this.$http.get(`/v1/admin/settings/courses`).then((response) => {
        this.courses = response.data.data.courses;
        this.form = response.data.data.courses;
      });
    },
    async updateExchangeRates() {
      await this.$http
        .patch(
          `v1/admin/settings/courses?tg_id=${this.tg_id}&api_key=${this.api_key}`, {
            value: this.form
          }).then((response) => {
            this.courses.cny_rub = this.form.cny_rub;
            this.courses.usd_rub = this.form.usd_rub;
            this.isVisible = !this.isVisible;
            this.$notify({
              type: 'success',
              message: 'Курс валют успешно сохранен',
            });
          })
    }
  },

  mounted() {
    this.getExchangeRates();
    this.$notify({
      type: 'success',
      message: 'Курсы успешно получены',
    });
  },
};
</script>

<style lang="scss" scoped>
.exchange-rates {
  &_view{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &_change{
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn{
      margin-right: 0;
    }
  }
  &_items,
  &_form {
    max-width: 400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    widows: 100%;

    &_item {
      display: flex;
      justify-content: space-around;

      & input {
        margin: 1px;
      }
    }
  }

  &_item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #000;

    &_header {
      width: 50%;
      text-align: center;
    }
  }

  &_btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
    & button {
      &:not(:first-child) {
        margin-top: 0;

      }
    }
  }
}

button {
  max-width: 500px;
  width: 100%;
  background: linear-gradient(180deg, #f5dd6d 0%, #ffcd4d 100%);
  margin-top: 25px;
  margin: 30px 0 0 0;
}

input {
  width: 100%;
}
</style>

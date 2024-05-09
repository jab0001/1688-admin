<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Новый пользователь</h3>
      <ul class="modal__list">
        <li class="modal__item">
          <div class="modal__select-wrapper">
            <select class="modal__select" v-model="selectedCountryCode">
              <option value="+7">+7</option>
              <option value="+1">+1</option>
              <option value="+33">+33</option>
            </select>
          </div>

          <input
            ref="phone"
            type="text"
            v-mask="`(###) ###-##-##`"
            v-model="formModel.phone"
            :class="isValidPhone"
            placeholder="999 9999"
            class="modal__input-phone modal__input profile-order__input form-control rounded-sm text-dark"
            @blur="checkEmpty"
            required
          />
        </li>
        <li class="modal__item">
          <input
            ref="fio"
            type="text"
            v-model="formModel.name"
            class="modal__input-fio modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="Ваше ФИО"
            @click="resetValidation"
            @blur="checkEmpty"
            required
          />
        </li>
        <li class="modal__item">
          <input
            ref="email"
            type="email"
            v-model="formModel.email"
            :class="[isValidEmail]"
            class="modal__input-fio modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="E-mail"
            @blur="checkEmpty"
            required
          />
        </li>
        <li class="modal__item">
          <input
            type="text"
            v-model="formModel.promo"
            class="modal__input-fio modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="Промокод"
          />
        </li>
      </ul>
      <button @click.prevent="onSubmitHandler" class="modal__btn">
        Добавить пользователя
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {},
  computed: {
    isValidPhone() {
      return this.formModel.phone === ''
        ? ''
        : this.formModel.phone.length === 15
        ? 'is-valid'
        : 'is-invalid';
    },
    isValidEmail() {
      return this.formModel.email === ''
        ? ''
        : this.reg.test(this.formModel.email)
        ? 'is-valid'
        : 'is-invalid';
    },
  },
  data() {
    return {
      formModel: {
        name: '',
        phone: '',
        email: '',
        promo: '',
      },
      selectedCountryCode: '+7',
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    };
  },
  methods: {
    ...mapActions({
      addClient: 'admin/addClient',
    }),
    closeModal() {
      this.$emit('closeModal');
    },

    checkEmpty(event) {
      event.target.value === '' ? event.target.classList.add('is-invalid') : '';
    },

    resetValidation(event) {
      event.target.classList.remove('is-invalid');
    },

    isValid() {
      return Object.keys(this.$refs)
        .map((ref) => {
          if (this.$refs[ref].value === '') {
            this.$refs[ref].classList.add('is-invalid');
          }
          return this.$refs[ref].value;
        })
        .every((el) => el);
    },

    async onSubmitHandler() {
      const data = {
        username: this.formModel.name,
        email: this.formModel.email,
        phone: this.selectedCountryCode + this.formModel.phone,
        promo: this.formModel.promo,
      };

      this.isValid();

      if (
        this.isValidPhone === 'is-valid' &&
        this.isValid() &&
        this.isValidEmail === 'is-valid'
      ) {
        let res = await this.addClient(data);

        if (res) {
          this.$emit('closeModal');
          this.$emit('updateClients');
        }
      } else {
        this.$notify({
          type: 'warning',
          message: 'Необходимо заполнить форму',
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 76px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(99, 100, 102, 0.6);
  z-index: 10;

  &__title {
    width: 100%;
    margin: 0;
    font-size: 28px;
    font-weight: 400;
    line-height: 34px;
    text-align: left;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 36px;
    width: 100%;
  }

  &__item {
    position: relative;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__select::-ms-expand {
    display: none;
  }

  &__select {
    cursor: pointer;
    outline: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: inherit;
    border: none;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    padding-left: 22px;
  }

  &__select-wrapper {
    position: absolute;
    top: 25%;
    left: 13px;
    width: 79px;
    height: 27px;
    background-color: #e5e5e5;
    border-radius: 5px;

    :hover {
      background: #f6f4f4;
    }

    &::after {
      content: '▼';
      position: absolute;
      top: 15px;
      right: 13px;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      color: #000;
      font-size: 7px;
      pointer-events: auto;
    }
  }

  &__input-phone {
    padding-left: 105px;

    &:focus {
      border: 2px solid #4f420f;
    }
  }

  &__input-phone,
  &__input-fio,
  &__input-email,
  &__input-password {
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;

    &:focus {
      border: 2px solid #4f420f;
    }
  }

  &__btn {
    margin-top: 39px;
    width: 100%;
    border: none;
    padding: 13px 0;
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
  }
}

.popup {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  width: 384px;
  max-height: 706px;
  background-color: #fff;
  border-radius: 15px;
  padding: 45px 39px 65px;

  @media screen and (min-width: 360px) and (max-width: 768px) {
    width: 340px;
  }
}
</style>

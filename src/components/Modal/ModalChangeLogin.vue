<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Изменить логин</h3>
      <ul class="modal__list">
        <li class="modal__item">
          <input
            ref="fio"
            type="text"
            v-model="login"
            class="modal__input-fio modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="Логин"
            @click="resetValidation"
            @blur="checkEmpty"
            required
          />
        </li>
      </ul>
      <button @click.prevent="onSubmitHandler" class="modal__btn">
        Добавить пользователя
      </button>
      <button class="modal__btn modal__btn-close" @click="$emit('closeModal')">
        Отмена
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {},
  computed: {},
  data() {
    return {
      login: '',
    };
  },
  methods: {
    ...mapActions({
      updateUser: 'admin/updateUser',
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
      this.isValid();

      if (this.isValid()) {
        this.$emit('acceptChangeLogin', this.login);
        this.$emit('closeModal');
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

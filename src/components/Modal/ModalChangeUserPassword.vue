<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Смена пароля</h3>
      <input
        ref="password"
        type="password"
        v-model="password"
        class="modal__input-password registartion__input profile-order__input form-control rounded-sm text-dark"
        placeholder="Придумайте пароль"
        @click="resetValidation"
        @blur="checkEmpty"
        required
      />
      <button class="modal__btn" @click="saveSettings">Подтвердить</button>
      <button class="modal__btn modal__btn-close" @click="$emit('closeModal')">
        Отмена
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  computed: {},
  data() {
    return {
      password: '',
    };
  },
  methods: {
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
    closeModal() {
      this.$emit('closeModal');
    },
    saveSettings() {
      let password = this.password;

      this.isValid();

      if (this.isValid()) {
        this.$emit('acceptChangePassword', password);
      } else {
        this.$notify({
          type: 'warning',
          message: 'Необходимо заполнить пароль',
        });
      }
    },
  },
  mounted() {},
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

  &__input-password {
    margin-top: 25px;
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

    &-close {
      margin-top: 12px;
      text-decoration: none;
      background: #e5e5e5;

      &:hover {
        background: #f6f4f4;
      }
    }
  }

  &__description {
    margin: 0;
    margin-top: 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;

    color: #000000;
  }

  &__title {
    width: 100%;
    margin: 0;
    font-size: 28px;
    font-weight: 400;
    line-height: 34px;
    text-align: center;
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
  border-radius: 24px;
  padding: 45px 39px 65px;

  @media screen and (min-width: 360px) and (max-width: 768px) {
    width: 340px;
  }
}
</style>

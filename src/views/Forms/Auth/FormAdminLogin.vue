<template>
  <form class="login-admin">
    <div class="login-admin__logo">
      <img src="@/assets/img/icons/admin.svg" />
      <h2 class="login-admin__title">АДМИНКА</h2>
    </div>

    <p class="login-admin__description">Вход в админку</p>

    <ul class="login-admin__list">
      <li class="login-admin__item">
        <input
          ref="email"
          type="email"
          v-model="formModel.email"
          :class="[isValidEmail]"
          class="login-admin__input-email registartion__input profile-order__input form-control rounded-sm text-dark"
          placeholder="Ваш логин"
          @blur="checkEmpty"
          required
        />
      </li>
      <li class="login-admin__item">
        <input
          ref="password"
          :type="showPass ? 'text' : 'password'"
          v-model="formModel.password"
          class="login-admin__input-password profile-order__input form-control rounded-sm text-dark"
          placeholder="Ваш пароль"
          required
          @click="resetValidation"
          @blur="checkEmpty"
        />
        <button
          class="login-admin__input-password--visibility"
          type="button"
          @click="passwordVisibility"
        >
          <img src="@/assets/img/icons/eye-show.svg" />
        </button>
      </li>
    </ul>

    <button
      @click.prevent="onSubmitHandler"
      class="login-admin__btn login-admin__btn-submit"
    >
      Войти
    </button>
  </form>
</template>
<script>
export default {
  data() {
    return {
      formModel: {
        email: '',
        password: '',
      },
      showPass: false,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    };
  },
  computed: {
    isValidEmail() {
      return this.formModel.email === ''
        ? ''
        : this.reg.test(this.formModel.email)
        ? 'is-valid'
        : 'is-invalid';
    },
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
    passwordVisibility() {
      this.showPass = !this.showPass;
    },

    onSubmitHandler() {
      const data = {
        email: this.formModel.email,
        password: this.formModel.password,
      };

      this.isValid();

      if (this.isValidEmail === 'is-valid' && this.isValid()) {
        this.$emit('onSubmit', data);
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

<style lang="scss" scoped>
.login-admin {
  padding: 46px 38px 66px 38px;
  min-width: 384px;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 34px;
  }

  &__item {
    position: relative;

    &:first-child {
      margin-bottom: 12px;
    }
  }

  &__logo {
    display: flex;
  }

  &__title {
    margin: 0;
    margin-left: 9px;
    font-size: 25px;
    font-weight: 700;
    line-height: 29px;
    letter-spacing: -0.055em;
    text-align: left;

    color: #000000;
  }

  &__description {
    margin: 0;
    margin-top: 36px;
    font-size: 28px;
    font-weight: 400;
    line-height: 34px;
    letter-spacing: 0em;
    text-align: left;

    color: #000000;
  }

  &__input-password,
  &__input-email {
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;

    &:focus {
      border: 2px solid #4f420f;
    }

    &--visibility {
      position: absolute;
      border: none;
      background: inherit;
      top: 15px;
      right: 19px;
      width: 19px;
      height: 15px;
      padding: 0;
      display: flex;

      &:hover {
        opacity: 0.5;
      }
    }
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    height: 45px;
    border-radius: 5px;
    color: #000;

    &-submit {
      margin-top: 32px;
      background-color: #ffcf4f;

      &:hover {
        background-color: #fcecab;
      }
    }
  }
}
</style>

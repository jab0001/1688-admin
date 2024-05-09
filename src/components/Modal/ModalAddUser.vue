<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Новый сотрудник</h3>
      <ul class="modal__list">
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
            class="modal__input-email modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="E-mail"
            @blur="checkEmpty"
            required
          />
        </li>
        <li class="modal__item">
          <input
            ref="password"
            type="password"
            v-model="formModel.password"
            class="modal__input-password modal__input profile-order__input form-control rounded-sm text-dark"
            placeholder="Придумайте пароль"
            @click="resetValidation"
            @blur="checkEmpty"
            required
          />
        </li>
        <li class="modal__item">
          <select
            class="modal__input-select modal__input profile-order__input form-control rounded-sm"
            v-model="formModel.role"
            @change="changeColorSelect"
            :style="switchColor ? 'color: #000;' : 'color: #acb5bd;'"
          >
            <option disabled selected value="">Выберите опцию</option>
            <option value="super-admin">Админ</option>
            <option value="manager">Менеджер</option>
          </select>
          <span
            ><svg
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9L0.803847 -2.51245e-08L11.1962 8.834e-07L6 9Z"
                fill="#252525"
              />
            </svg>
          </span>
        </li>
      </ul>
      <button @click.prevent="onSubmitHandler" class="modal__btn">
        Добавить сотрудника
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {},
  computed: {
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
        email: '',
        password: '',
        role: '',
      },
      switchColor: false,
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
    };
  },
  methods: {
    ...mapActions({
      addUser: 'admin/addUser',
      addRole: 'admin/assignUserRole',
    }),
    changeColorSelect() {
      this.switchColor = true;
    },
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
        password: this.formModel.password,
      };

      const role = this.formModel.role;

      this.isValid();

      if (this.isValid() && this.isValidEmail === 'is-valid') {
        let res = await this.addUser(data);

        let id = res.data.data.id;

        if (role && id) {
          let result = await this.addRole({ userId: id, role });
        }

        if (res) {
          this.$emit('closeModal');
          this.$emit('updateUsers');
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

    span {
      position: absolute;
      top: 11px;
      left: 16px;
    }
  }

  &__input {
    font-size: 16px;
    font-weight: 400;
    line-height: 19px;

    &:focus {
      border: 2px solid #4f420f;
    }

    &-select::-ms-expand {
      display: none;
    }

    &-select {
      cursor: pointer;
      outline: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: inherit;
      height: 49px;
      width: 100%;
      border-radius: 5px;
      padding-left: 41px;
      position: relative;

      color: #000;
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

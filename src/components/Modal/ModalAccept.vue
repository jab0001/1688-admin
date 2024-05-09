<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Подтверждение</h3>
      <p class="modal__description">
        Вы уверены что хотите {{ textDescription }} ?
      </p>
      <button class="modal__btn" @click="saveSettings">Подтвердить</button>
      <button class="modal__btn modal__btn-close" @click="$emit('closeModal')">
        Отмена
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: 'Are you sure?',
    },
  },
  computed: {
    textDescription() {
      if (this.description === 'remove') {
        return 'удалить пользователя';
      }
      if (this.description === 'update') {
        return 'изменить данные';
      }
    },
  },
  data() {
    return {};
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    saveSettings() {
      if (this.description === 'remove') {
        this.$emit('acceptDelete');
        this.closeModal();
      }
      if (this.description === 'update') {
        this.$emit('acceptUpdate');
        this.closeModal();
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

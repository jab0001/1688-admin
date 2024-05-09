<template>
  <div class="modal">
    <div class="popup" v-click-outside="closeModal">
      <h3 class="modal__title">Поменять поля</h3>
      <ul class="modal__list">
        <li class="modal__item" v-for="setting in settings" :key="setting.name">
          <label class="modal__label">
            <input
              class="modal__input"
              type="checkbox"
              :checked="setting.visible"
              v-model="setting.visible"
            />
            <span class="modal__label-icon"></span>
            <span class="modal__label-text">{{ setting.name }}</span>
          </label>
        </li>
      </ul>
      <button class="modal__btn" @click="saveSettings">
        Сохранить изменения
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
  data() {
    return {
      settings: {},
    };
  },
  methods: {
    closeModal() {
      this.$emit('closeModal');
    },
    saveSettings() {
      this.$emit('updateSettings', this.settings);
      this.closeModal();
    },
  },
  mounted() {
    this.settings = JSON.parse(JSON.stringify(this.tableData));
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

  &__title {
    width: 100%;
    margin: 0;
    font-size: 28px;
    font-weight: 400;
    line-height: 34px;
    text-align: left;
  }

  &__list {
    margin: 0;
    margin-top: 15px;
    list-style: none;
    padding: 0;

    width: 100%;
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  &__label {
    position: relative;
    cursor: pointer;
    margin: 0;
    padding-left: 30px;

    &-icon {
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      left: 0;
      width: 20px;
      height: 20px;
      background-color: #fff;
      border: 1px solid #929292;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &-text {
      display: block;
      border: 1px solid #929292;
      border-radius: 3px;
      padding: 6.5px 0 6.5px 10px;
      min-width: 177px;

      font-size: 14px;
      font-weight: 400;
      line-height: 17px;
      text-align: left;
    }
  }

  &__input[type='checkbox'] {
    display: none;
  }

  &__input[type='checkbox']:checked + &__label-icon:after {
    content: '';
    width: 14px;
    height: 14px;
    padding: 3px;
    background: #ffcf4f;
    display: block;
  }

  &__label:hover {
    .modal__label-icon,
    .modal__label-text {
      opacity: 0.5;
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
  border-radius: 24px;
  padding: 45px 39px 65px;

  @media screen and (min-width: 360px) and (max-width: 768px) {
    width: 340px;
  }
}
</style>

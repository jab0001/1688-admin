<template>
  <div class="feed">
    <h3 class="feed__title">Плашка</h3>
    <p class="feed__text">
      Статус:<span class="feed__text feed__text-status">{{
        activeFormat(Number(storedNotice.is_active))
      }}</span>
    </p>
    <div class="feed__wrapper feed__wrapper-informs">
      <div class="feed__label">
        <div class="feed__label-text">
          Текст на платформе:<span
            class="feed__error"
            :style="checkTextArea ? 'display: initial;' : 'display: none;'"
            >Слишком много символов</span
          ><span style="display: flex"
            ><button
              class="feed__btn feed__btn-save feed__btn-save-text"
              @click.stop="changeNoticeText"
              v-if="!checkTextArea"
            >
              <img
                class="feed__btn-save-img"
                src="@/assets/img/icons/success-feed.svg"
              />
              Сохранить
            </button>
            <div style="position: relative">
<!--              <a href="" @click.prevent="togglePopupText" class="feed__btn-more"-->
<!--                ><img-->
<!--                  src="@/assets/img/icons/more.svg"-->
<!--                  class="feed__btn-more-img"-->
<!--              /></a>-->
              <label class="checkbox-ios">
                  <input type="checkbox" v-model="storedNotice.is_active">
                  <span class="checkbox-ios-switch"  @click="turnOffNotice"></span>
              </label>

              <div v-if="popupText" class="feed__popup">
                <button
                  class="feed__btn feed__btn-active"
                  @click="turnOffNotice"
                >
                  {{ storedNotice.is_active ? 'Выключить' : 'Включить' }} банер
                </button>
              </div>
            </div>
          </span>
        </div>
        <textarea
          class="feed__input feed__input-textarea"
          v-model="storedNotice.text"
          :style="checkTextArea ? 'border-color:#E86A6A;' : ''"
        />
      </div>
    </div>
    <h3 class="feed__title feed__title-banners">Банеры</h3>
    <ul class="feed__list">
      <li class="feed__item" v-for="feed in feedsList" :key="feed.id">
        <p class="feed__text feed__text-item">
          Статус:<span
            class="feed__text feed__text-status feed__text-status-item"
            >{{ activeFormat(feed.is_active) }}</span
          >
        </p>
        <div class="feed__wrapper-btns">
          <button
            class="feed__btn feed__btn-download"
            @click="bannerHandlerPreview(feed.id)"
          >
            <img
              src="@/assets/img/icons/download.svg"
              class="feed__btn-download-img"
            />Загрузить новый банер
          </button>
                      <label class="checkbox-ios">
                        <input type="checkbox" v-model="feed.is_active">
                        <span class="checkbox-ios-switch"
                              @click="bannerHandlerActions(
                              feed.id,
                              'is_active',
                              Number(!feed.is_active)
                            )"/>

                      </label>
          <div :style="{position: 'relative'}">
            <a
              href=""
              @click.prevent="(evt) => toggleBannersPopup(feed.id)"
              class="feed__btn-more"
              ><img
                src="@/assets/img/icons/more.svg"
                class="feed__btn-more-img"
            /></a>
            <div v-if="bannersSettings[feed.id].popup" class="feed__popup">
<!--              <button-->
<!--                class="feed__btn feed__btn-active"-->
<!--                @click="-->
<!--                  bannerHandlerActions(-->
<!--                    feed.id,-->
<!--                    'is_active',-->
<!--                    Number(!feed.is_active)-->
<!--                  )-->
<!--                "-->
<!--              >-->
<!--                {{ feed.is_active === 0 ? 'Включить' : 'Выключить' }} банер-->
<!--              </button>-->
              <button
                class="feed__btn feed__btn-default"
                @click="bannerHandlerActions(feed.id, 'default')"
              >
                Сбросить настройки
              </button>
            </div>
          </div>
        </div>
        <div class="feed__item-wrapper">
          <div class="feed__item-wrapper-side">
            <input
              type="file"
              :ref="`fileInput${feed.id}`"
              style="display: none"
              @change="(event) => handleFileChange(event, feed.id)"
            />
            <img
              :src="feed.image ? formattedUrl(feed.image.path) : false"
              :class="`feed__item-img banner-${feed.id}`"
              :style="
                bannersSettings[feed.id].img ? '' : 'border: 2px solid #E86A6A;'
              "
            />
            <span
              v-if="!feed.image?.path"
              class="feed__item-img-no"
              :style="
                bannersSettings[feed.id].img
                  ? 'top: 30%; transform(translate(-50%, -30%))'
                  : 'color: #000; font-size: 16px;'
              "
              v-html="bannerPreview(feed.id)"
            ></span>
            <p class="feed__item-input-text">Ссылка банера</p>
            <input
              class="feed__item-input"
              type="text"
              v-model="feed.external_link"
              @change="checkBannerLink(feed.external_link, feed.id)"
              :style="
                bannersSettings[feed.id].link ? '' : 'border-color: #E86A6A;'
              "
            />
            <span
              class="feed__error"
              :style="
                bannersSettings[feed.id].link
                  ? 'display: none;'
                  : 'display: initial; margin-top: 9px;'
              "
              >Неверный формат ссылки</span
            >
            <button
              class="feed__btn feed__btn-save"
              v-if="
                bannersSettings[feed.id].link && bannersSettings[feed.id].img
              "
              @click="
                bannerHandlerActions(
                  feed.id,
                  'external_link',
                  feed.external_link
                )
              "
            >
              <img
                class="feed__btn-save-img"
                src="@/assets/img/icons/success-feed.svg"
              />
              Сохранить
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'Packages',

  data() {
    return {
      popupText: false,
      bannersSettings: {
        1: {
          popup: false,
          link: true,
          img: true,
        },
        2: {
          popup: false,
          link: true,
          img: true,
        },
        3: {
          popup: false,
          link: true,
          img: true,
        },
        4: {
          popup: false,
          link: true,
          img: true,
        },
      },
    };
  },
  computed: {
    storedNotice() {
      return this.$store.getters['feed/getNotice'];
    },
    feedsList() {
      return this.$store.getters['feed/getFeedsList'];
    },
    checkTextArea() {
      if (this.storedNotice.text) {
        return this.storedNotice.text.length > 1024 ? true : false;
      }
    },
    role() {
      return this.$store.getters['auth/role']?.role.name;
    },
  },
  methods: {
    ...mapActions({
      fetchNotice: 'feed/fetchNotice',
      fetchFeeds: 'feed/fetchFeedsList',
      fetchImages: 'feed/fetchImagesList',
    }),
    bannerPreview(id) {
      const img = this.bannersSettings[id].img;
      if (img) {
        return `Баннер ${id} предпросмотр`;
      } else {
        return `Неверный формат&nbsp;файла <br/> Нужные форматы: jpg, jpeg, gif, png`;
      }
    },
    checkBannerLink(link, id) {
      const imageUrlPattern =
        /(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;

      this.bannersSettings[id].link = imageUrlPattern.test(link);
    },
    togglePopupText() {
      this.popupText = !this.popupText;
    },
    toggleBannersPopup(id) {
      this.bannersSettings[id].popup = !this.bannersSettings[id].popup;
    },
    formattedUrl(link) {
      if (link) {
        const home = process.env.STATIC_FILES_HOST;
        return `${home}/${link}`;
      } else {
        return;
      }
    },
    activeFormat(active) {
      const dictionary = {
        0: 'не активен',
        1: 'активен',
      };

      return dictionary[active];
    },
    bannerHandlerPreview(id) {
      if (this.role === 'super-admin') {
        let element = `fileInput${id}`;
        this.$refs[element][0].click();
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async bannerHandlerActions(id, name, value) {
      if (this.role === 'super-admin') {
        const res = await this.$store.dispatch('feed/updateFeed', {
          id,
          name,
          value,
        });
        if (name === 'external_link') {
          this.bannerHandlerChange(id);
        }
        if (res) {
          this.$notify({
            type: 'success',
            message: 'Данные успешно обновлены',
          });
          await this.getFeedsData();
        }
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async bannerHandlerChange(id) {
      let element = `fileInput${id}`;
      let file = this.$refs[element][0].files[0];
      if (file && this.bannersSettings[id].img) {
        const form = new FormData();
        form.append('image', file);
        const upload = await this.$store.dispatch('feed/uploadImage', form);

        if (upload) {
          const res = await this.$store.dispatch('feed/updateFeed', {
            id,
            name: 'image_id',
            value: upload.id,
          });
          if (res) {
            this.$notify({
              type: 'success',
              message: 'Баннер успешно изменен!',
            });
          }
        }
      } else {
        this.$notify({
          type: 'error',
          message: 'Баннер должен быть нужного формата.',
        });
        return;
      }
    },
    async handleFileChange(event, id) {
      const selectedFile = event.target.files[0];

      const imageUrlPattern = /\.(jpeg|jpg|gif|png)$/;

      if (selectedFile && imageUrlPattern.test(selectedFile.name)) {
        const previewImage = document.querySelector(`.banner-${id}`);

        previewImage.src = URL.createObjectURL(selectedFile);
        this.bannersSettings[id].img = true;
      } else {
        this.bannersSettings[id].img = false;
      }
    },
    async turnOffNotice() {
      if (this.role === 'super-admin') {
        const update = await this.$store.dispatch('feed/updateNotice', {
          is_active: !this.storedNotice.is_active,
        });

        if (update) {
          this.$notify({
            type: 'success',
            message: 'Статус плашки успешно изменен',
          });
          await this.getNoticeData();
        }
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async changeNoticeText() {
      if (this.role === 'super-admin') {
        const update = await this.$store.dispatch('feed/updateNotice', {
          text: this.storedNotice.text,
        });

        if (update) {
          this.$notify({
            type: 'success',
            message: 'Текст плашки успешно изменен',
          });
        }
      } else {
        this.$notify({
          type: 'warning',
          message: 'Нет прав на операцию!',
        });
      }
    },
    async getNoticeData() {
      const res = await this.fetchNotice();
    },
    async getFeedsData() {
      const res = await this.fetchFeeds();
    },
    async getImagesData() {
      const res = await this.fetchImages();
    },
  },
  async mounted() {
    await this.getNoticeData();
    await this.getImagesData();
    await this.getFeedsData();
  },
};
</script>

<style lang="scss" scoped>
h1,
h3,
p {
  margin: 0;
  padding: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.feed {
  padding: 0 0px 50px 12px;

  &__error {
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;

    color: #e86a6a;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 25px;
  }

  &__item {
    width: 352px;
    &:nth-child(odd) {
      margin-right: 244px;
    }

    &-img {
      width: 100%;
      height: 196px;
      border-radius: 5px;
      background: #f8db79;
      margin-top: 2px;

      &-no {
        position: absolute;
        font-size: 20px;
        font-weight: 300;
        line-height: 24px;

        color: #a5a5a5;

        margin: 0;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -20%);

        pointer-events: none;
      }
    }

    &-input {
      margin-top: 11px;
      height: 45px;
      border-radius: 5px;
      border: 1px solid #909090;
      padding: 17px 10px;

      font-size: 20px;
      font-weight: 300;
      line-height: 24px;

      letter-spacing: -0.3px;

      color: #737373;

      outline: none;

      &:focus {
        border: 2px solid #4f420f;
      }

      &-text {
        margin-top: 20px;

        font-size: 20px;
        font-weight: 300;
        line-height: 24px;
      }
    }

    &-wrapper {
      display: flex;
      width: 100%;

      &-side {
        display: flex;
        flex-direction: column;
        margin-top: 9px;
        position: relative;
        width: 100%;
      }
    }

    &:not(:last-child) {
      margin-bottom: 58px;
    }
  }

  &__label {
    display: flex;
    flex-wrap: wrap;
    width: 67.3%;

    &-text {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 300;
      line-height: 24px;
      letter-spacing: -0.2px;
      text-align: left;

      color: #000;
      width: 100%;
    }
  }

  &__wrapper {
    display: flex;

    &-informs {
      margin-top: 21px;
    }

    &-btns {
      margin-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__input {
    padding: 14px 13px;
    margin-top: 15px;

    font-size: 20px;
    font-weight: 300;
    line-height: 24px;
    text-align: left;
    letter-spacing: -0.24px;

    color: #737373;

    border: 1px solid #909090;
    border-radius: 5px;

    outline: none;

    &:focus {
      border: 2px solid #4f420f;
    }

    &-textarea {
      padding: 25px 105px 25px 23px;
      min-height: 158px;
      white-space: wrap;
      width: 100%;
    }
  }

  &__text {
    font-size: 20px;
    font-weight: 300;
    line-height: 24px;
    text-align: left;
    letter-spacing: -0.1px;

    color: #000000;

    &-status {
      margin-left: 5px;
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.3px;
      text-align: left;

      &-item {
        margin-left: 5px;
      }
    }
  }

  &__title {
    margin-bottom: 32px;
    font-size: 24px;
    font-weight: 500;
    line-height: 29px;
    text-align: left;
    letter-spacing: 0.7px;

    color: #000;

    &-banners {
      margin-top: 25px;
      margin-bottom: 0;
    }
  }

  &__popup {
    position: absolute;
    border: 1px solid #f8db79;
    border-radius: 1px;
    padding: 20px;
    top: 0;
    left: 41px;
  }

  &__btn {
    border: none;
    font-size: 16px;
    font-weight: 300;
    line-height: 22px;
    letter-spacing: -0.2px;

    &-download {
      padding: 0;
      background: none;

      &:hover {
        opacity: 0.3;
      }

      &-img {
        margin-right: 12px;
      }
    }

    &-more {
      &:hover {
        opacity: 0.3;
      }
    }

    &-save {
      background: none;
      position: absolute;
      bottom: 11px;
      right: -137px;

      &:hover {
        opacity: 0.3;
      }

      &-img {
        margin-right: 3px;
      }

      &-text {
        margin-right: 30px;
        position: initial;
      }
    }

    &-active {
      background: none;
      white-space: nowrap;

      &:hover {
        opacity: 0.3;
      }
    }

    &-default {
      background: none;
      white-space: nowrap;

      &:hover {
        opacity: 0.3;
      }
    }
  }
}

//checkbox
.checkbox-ios {
  display: inline-block;
  height: 28px;
  line-height: 28px;
  position: relative;
  vertical-align: middle;
  font-size: 14px;
  user-select: none;
  margin: 0;

}
.checkbox-ios .checkbox-ios-switch {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 56px;
  height: 28px;
  border: 1px solid rgba(0, 0, 0, .1);
  border-radius: 25%/50%;
  vertical-align: top;
  background: #eee;
  transition: .2s;
}
.checkbox-ios .checkbox-ios-switch:before {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
  transition: .15s;
}
.checkbox-ios input[type=checkbox] {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.checkbox-ios input[type=checkbox]:not(:disabled):active + .checkbox-ios-switch:before {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, .3);
}
.checkbox-ios input[type=checkbox]:checked + .checkbox-ios-switch {
  background: limegreen;
}
.checkbox-ios input[type=checkbox]:checked + .checkbox-ios-switch:before {
  transform:translateX(28px);
}

/* Hover */
.checkbox-ios input[type="checkbox"]:not(:disabled) + .checkbox-ios-switch {
  cursor: pointer;
  border-color: rgba(0, 0, 0, .3);
}

/* Disabled */
.checkbox-ios input[type=checkbox]:disabled + .checkbox-ios-switch {
  filter: grayscale(70%);
  border-color: rgba(0, 0, 0, .1);
}
.checkbox-ios input[type=checkbox]:disabled + .checkbox-ios-switch:before {
  background: #eee;
}

/* Focus */
.checkbox-ios.focused .checkbox-ios-switch:before {
  box-shadow: inset 0px 0px 4px #ff5623;
}
</style>

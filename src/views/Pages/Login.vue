<template>
  <FormAdminLogin @onSubmit="onSubmitHandler" />
</template>

<script>
import { mapActions } from 'vuex';
import FormAdminLogin from '@/views/Forms/Auth/FormAdminLogin.vue';

export default {
  components: {
    FormAdminLogin,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions({
      login: 'auth/adminLogin',
    }),
    async onSubmitHandler(payload) {
      const { email, password } = payload;
      try {
        const res = await this.login({ email, password });

        if (res.token) {
          this.$router.push({ name: 'AdminClientList' });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>

# Register

The register functionality is fully implemented in our theme helping you to start your project in no time. To register a new user you just have to add **/register** in the URL or click on register link from login page and fill the register form with user details.

The `src\views\pages\Register.vue` is the Vue component which handles the login functinality. You can easily extend it to your needs.

It uses the auth store located in `src\store\modules\auth.js`.

## Register card

```
<div class="container mt--8 pb-5">
  <!-- Table -->
  <div class="row justify-content-center">
    <div class="col-lg-6 col-md-8">
      <div class="card bg-secondary border-0">
        <div class="card-header bg-transparent pb-5">
          <div class="text-muted text-center mt-2 mb-4">
            <small>Sign up with</small>
          </div>
          <div class="text-center">
            <a href="#" class="btn btn-neutral btn-icon mr-4">
              <span class="btn-inner--icon"
                ><img src="/img/icons/common/github.svg"
              /></span>
              <span class="btn-inner--text">Github</span>
            </a>
            <a href="#" class="btn btn-neutral btn-icon">
              <span class="btn-inner--icon"
                ><img src="/img/icons/common/google.svg"
              /></span>
              <span class="btn-inner--text">Google</span>
            </a>
          </div>
        </div>
        <div class="card-body px-lg-5 py-lg-5">
          <div class="text-center text-muted mb-4">
            <small>Or sign up with credentials</small>
          </div>
          <form role="form" @submit.prevent="handleSubmit()">
            <base-input
              alternative
              class="mb-3"
              prepend-icon="ni ni-hat-3"
              placeholder="Name"
              name="Name"
              v-model="name"
            >
            </base-input>
            <validation-error :errors="apiValidationErrors.name" />

            <base-input
              alternative
              class="mb-3"
              prepend-icon="ni ni-email-83"
              placeholder="Email"
              name="Email"
              v-model="email"
            >
            </base-input>
            <validation-error :errors="apiValidationErrors.email" />

            <base-input
              alternative
              class="mb-3"
              prepend-icon="ni ni-lock-circle-open"
              placeholder="Password"
              type="password"
              name="Password"
              v-model="password"
            >
            </base-input>
            <password
              class="mb-3"
              v-model="password"
              :strength-meter-only="true"
              @score="showScore"
              :showStrengthMeter="false"
            />

            <validation-error :errors="apiValidationErrors.password" />

            <base-input
              alternative
              class="mb-3"
              prepend-icon="ni ni-lock-circle-open"
              placeholder="Confirm Password"
              type="password"
              name="Password confirmation"
              v-model="password_confirmation"
            >
            </base-input>
            <validation-error
              :errors="apiValidationErrors.password_confirmation"
            />

            <div class="text-muted font-italic">
              <small
                >password strength:
                <template v-if="scors === 0">
                  <span class="text-danger font-weight-700">
                    very weak
                  </span>
                </template>

                <template v-if="scors === 1">
                  <span class="text-danger font-weight-700"> weak </span>
                </template>

                <template v-if="scors === 2">
                  <span class="text-warning font-weight-700"> medium </span>
                </template>

                <template v-if="scors === 3">
                  <span class="text-success font-weight-700"> strong </span>
                </template>

                <template v-if="scors === 4">
                  <span class="text-success font-weight-700">
                    very strong
                  </span>
                </template>
              </small>

            </div>
            <div class="row my-4">
              <div class="col-12">
                <base-input
                  :rules="{ required: { allowFalse: false } }"
                  name="Privacy"
                  Policy
                >
                  <base-checkbox v-model="boolean">
                    <span class="text-muted"
                      >I agree with the
                      <a href="#!">Terms and conditions</a></span
                    >
                  </base-checkbox>
                </base-input>
              </div>
            </div>
            <div class="text-center">
              <base-button type="primary" native-type="submit" class="my-4"
                >Create account</base-button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
```

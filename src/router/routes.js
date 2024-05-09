import AuthLayout from '@/views/Layout/AuthLayout.vue';
import AdminLayout from '@/views/Layout/AdminLayout.vue';

const AdminLogin = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Login.vue');

const AdminEmployee = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Employee.vue');

const AdminEmployeeList = () =>
  import(
    /* webpackChunkName: "pages" */ '@/views/Pages/EmployeeList.vue'
  );

const AdminExchangeRates = () =>
  import(
    /* webpackChunkName: "pages" */ '@/views/Pages/ExchangeRates.vue'
  );

const AdminPackages = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Packages.vue');

const AdminFeed = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Feed.vue');

const AdminClient = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Client.vue');

const AdminClientOrder = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/ClientOrder.vue');

const AdminClientList = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/ClientList.vue');

const AdminCategories = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Categories.vue');

const AdminPromoCodes = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/PromoCodes.vue');

const AdminDelivery = () =>
  import(/* webpackChunkName: "pages" */ '@/views/Pages/Delivery.vue');

//import middleware
import auth from '@/middleware/auth';

const routes = [
  {
    path: '/',
    redirect: '/clients',
  },
  {
    path: '/auth',
    component: AuthLayout,
    name: 'Auth layout',
    children: [
      {
        path: 'login',
        name: 'AdminLogin',
        component: AdminLogin,
      },
    ],
  },
  {
    path: '/',
    component: AdminLayout,
    name: 'Admin layout',
    children: [
      {
        path: 'employees',
        name: 'AdminEmployeeList',
        component: AdminEmployeeList,
        meta: { middleware: auth },
      },
      {
        path: 'employees/:userId',
        name: 'AdminEmployee',
        component: AdminEmployee,
        meta: { middleware: auth },
      },
      {
        path: 'clients/:userId',
        name: 'AdminClient',
        component: AdminClient,
        meta: { middleware: auth },
      },

      {
        path: 'clients/:userId/order/:orderId',
        name: 'AdminClientOrder',
        component: AdminClientOrder,
        meta: { middleware: auth },
      },

      {
        path: 'clients',
        name: 'AdminClientList',
        component: AdminClientList,
        meta: { middleware: auth },
      },
      {
        path: 'exchange',
        name: 'AdminExchangeRates',
        component: AdminExchangeRates,
        meta: { middleware: auth },
      },
      {
        path: 'packages',
        name: 'AdminPackages',
        component: AdminPackages,
        meta: { middleware: auth },
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: AdminCategories,
        meta: { middleware: auth },
      },
      {
        path: 'feed',
        name: 'AdminFeed',
        component: AdminFeed,
        meta: { middleware: auth },
      },
      {
        path: 'promo',
        name: 'AdminPromoCodes',
        component: AdminPromoCodes,
        meta: { middleware: auth },
      },
      {
        path: 'delivery',
        name: 'AdminDelivery',
        component: AdminDelivery,
        meta: { middleware: auth },
      },
    ],
  },
];

export default routes;

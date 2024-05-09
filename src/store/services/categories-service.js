import qs from 'qs';
import axios from 'axios';
import Jsona from 'jsona';

const url = process.env.APP_API_BASE_URL;
const jsona = new Jsona();

function list(params) {
  const options = {
    params: params,
    paramsSerializer: function (params) {
      return qs.stringify(params, {encode: false});
    }
  };

  return axios.get(`${url}/v1/categories`, options)
    .then(response => {
      return {
        list: jsona.deserialize(response.data),
        meta: response.data.meta
      };
    });
}

function get(id) {
  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.get(`${url}/v1/categories/${id}`, options)
    .then(response => {
      let category = jsona.deserialize(response.data);
      delete category.links;
      return category;
    });
}

function add(category) {
  const payload = jsona.serialize({
    stuff: category,
    includeNames: null
  });

  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.post(`${url}/v1/categories`, payload, options)
    .then(response => {
      return jsona.deserialize(response.data);
    });
}

function update(category) {
  const payload = jsona.serialize({
    stuff: category,
    includeNames: []
  });

  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  // TODO: Почему не Vue.axios ?
  return axios.patch(`${url}/v1/categories/${category.id}`, payload, options)
    .then(response => {
      return jsona.deserialize(response.data);
    });
}

function destroy(id) {
  const options = {
    headers: {
      'Accept': 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
    }
  };

  return axios.delete(`${url}/v1/categories/${id}`, options);
}

export default {
  list,
  get,
  add,
  update,
  destroy
};


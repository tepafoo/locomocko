/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

(function (window) {

  var mockedEndpoints = [],
    mockedLibraries = {
      jQueryAjax: function (options) {
        var mockedEndpoint = findMockedEndpoint(options.url),
          mockedMethod = mockedEndpoint.getMethod(options.type);

        var responseData = mockedMethod.getResponseData();
        options.success(responseData, 'success', {
          readyState: 4,
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(responseData)
        })
      }
    },
    findMockedEndpoint = function (url) {
      return _.find(mockedEndpoints, function (mockedEndpoint) {
        return mockedEndpoint.getUrl() === url;
      });
    };

  function MockedMethod(method) {
    this._method = method;
  }

  MockedMethod.prototype = {
    withData: function (data) {
      this._requestData = data;
      return this;
    },

    thenRespond: function (data) {
      this._responseData = data;
      return this;
    },

    getResponseData: function () {
      return this._responseData;
    }
  };

  function MockedEndpoint(url) {
    this._url = url;
    this._methods = {};
  }

  MockedEndpoint.prototype = {
    withMethod: function (method) {
      var normalized = this._normalize(method);
      if (this._methods.hasOwnProperty(normalized)) {
        return this._methods[normalized];
      } else {
        this._methods[normalized] = new MockedMethod(normalized);
        return this._methods[normalized];
      }
    },

    getUrl: function () {
      return this._url;
    },

    getMethod: function (method) {
      var normalized = this._normalize(method);
      return this._methods[normalized];
    },

    _normalize: function (method) {
      return method.toUpperCase();
    }
  };


  function LocoMocko() {
  }

  LocoMocko.version = '0.0.1';

  LocoMocko.shouldMock = function (library) {
    if (library === 'jQuery') {
      $.ajax = mockedLibraries.jQueryAjax;
    }
  };

  LocoMocko.whenUrl = function (url) {

    var mockedEndpoint = findMockedEndpoint(url);

    if (_.isUndefined(mockedEndpoint)) {
      mockedEndpoint = new MockedEndpoint(url);
      mockedEndpoints.push(mockedEndpoint);
    }

    return mockedEndpoint;
  };


  window.locomocko = LocoMocko;
})
  (window);
/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

(function (window) {

  // constants
  var NO_HEADERS = {},
    ANY_HEADERS = 'LOCO_MOCKO_ANY_HEADERS',
    NO_DATA = 'LOCO_MOCKO_NO_DATA',
    ANY_DATA = 'LOCO_MOCKO_ANY_DATA',

  // util methods
    isNullOrUndefined = function (object) {
      return typeof object === 'undefined' || object === null;
    },

    isObject = function (object) {
      return Object.prototype.toString.call(object) === '[object Object]';
    },

  // other
    mockedEndpoints = {},
    libraryOriginals = {
      jQueryAjax: null
    },
    libraryMocks = {
      jQueryAjax: function (options) {
        var mockedMethod,
          response, responseData,
          i, j, headers, data;

        if (!mockedEndpoints.hasOwnProperty(options.url)) {
          throw new Error('Please mock endpoint: ' + options.url);
        }

        mockedMethod = mockedEndpoints[options.url].getMethod(options.type);

        response = null;
        headers = [isObject(options.headers) ? options.headers : NO_HEADERS, ANY_HEADERS];
        data = [isObject(options.data) ? options.data : NO_DATA, ANY_DATA];

        for (i = 0; i < headers.length && isNullOrUndefined(response); i++) {
          for (j = 0; j < data.length && isNullOrUndefined(response); j++) {
            response = mockedMethod.getResponse(headers[i], data[j]);
          }
        }

        if (isNullOrUndefined(response)) {
          throw new Error(
            'Please mock endpoint: ' + options.url +
              ' with method: ' + options.type +
              ' with headers: ' + JSON.stringify(options.headers) +
              ' and data: ' + JSON.stringify(options.data)
          );
        }

        responseData = response.getData();

        options.success(responseData, 'success', {
          readyState: 4,
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(responseData)
        });
      }
    };

  function MockedResponse() {
  }

  MockedResponse.prototype = {
    thenRespond: function (data) {
      this._data = data;
      return this;
    },

    getData: function () {
      return this._data;
    }
  };

  function MockedMethod() {
    this._responses = {};
    this._resetCurrentHeaders();
  }

  MockedMethod.prototype = {
    withHeaders: function (headers) {
      this._currentHeaders = headers;
      return this;
    },

    withoutHeaders: function () {
      this._resetCurrentHeaders();
      return this;
    },

    withAnyHeaders: function () {
      this._currentHeaders = ANY_HEADERS;
      return this;
    },

    withData: function (data) {
      var normalized = MockedMethod._normalize(this._currentHeaders, data);

      if (!this._responses.hasOwnProperty(normalized)) {
        this._responses[normalized] = new MockedResponse();
      }

      this._resetCurrentHeaders();

      return this._responses[normalized];
    },

    withoutData: function () {
      return this.withData(NO_DATA);
    },

    withAnyData: function () {
      return this.withData(ANY_DATA);
    },

    getResponse: function (requestHeaders, requestData) {
      return this._responses[MockedMethod._normalize(requestHeaders, requestData)];
    },

    _resetCurrentHeaders: function () {
      this._currentHeaders = NO_HEADERS;
    }
  };

  MockedMethod._normalize = function (headers, data) {
    return JSON.stringify(headers) + JSON.stringify(data);
  };

  function MockedEndpoint() {
    this._methods = {};
  }

  MockedEndpoint.prototype = {
    withMethod: function (method) {
      var normalized = MockedEndpoint._normalize(method);

      if (!this._methods.hasOwnProperty(normalized)) {
        this._methods[normalized] = new MockedMethod();
      }

      return this._methods[normalized];
    },

    getMethod: function (method) {
      var normalized = MockedEndpoint._normalize(method);
      return this._methods[normalized];
    }
  };

  MockedEndpoint._normalize = function (method) {
    return method.toUpperCase();
  };


  function LocoMocko() {
  }

  LocoMocko.version = '0.0.1';

  LocoMocko.shouldMock = function (library) {
    if (library === 'jQuery') {
      libraryOriginals.jQueryAjax = $.ajax;
      $.ajax = libraryMocks.jQueryAjax;
    }
  };

  LocoMocko.reset = function () {
    $.ajax = libraryOriginals.jQueryAjax;
    mockedEndpoints = {};
  };

  LocoMocko.whenUrl = function (url) {

    if (!mockedEndpoints.hasOwnProperty(url)) {
      mockedEndpoints[url] = new MockedEndpoint();
    }

    return mockedEndpoints[url];
  };


  window.locomocko = LocoMocko;
})(window);
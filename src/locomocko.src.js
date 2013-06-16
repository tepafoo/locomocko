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

    ZERO_LENGTH = 0,
    NOT_IN_ARRAY = -1,
    EXPECTED_METHODS_ARRAY = ['GET', 'POST', 'PUT', 'DELETE'],

  // util methods
    isNullOrUndefined = function (object) {
      return typeof object === 'undefined' || object === null;
    },

    isObject = function (object) {
      return Object.prototype.toString.call(object) === '[object Object]';
    },

    isString = function (object) {
      return Object.prototype.toString.call(object) === '[object String]';
    },

    hasArguments = function (input) {
      return input.length !== ZERO_LENGTH
    },

    getIllegalArgumentError = function () {
      return new Error('IllegalArgumentError');
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
          i, j, headers, data,
          getError = function () {
            return new Error(
              'Please mock endpoint: ' + options.url +
                ' with method: ' + options.type +
                ' with headers: ' + JSON.stringify(options.headers) +
                ' and data: ' + JSON.stringify(options.data)
            );
          };

        if (!(mockedEndpoints.hasOwnProperty(options.url) && mockedEndpoints[options.url].hasMethod(options.type))) {
          throw getError();
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
          throw getError();
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
    this._data = NO_DATA;
  }

  MockedResponse.prototype = {

    withData: function (data) {
      this._data = data;
    },

    getData: function () {
      return this._data;
    }
  };

  function MockedMethod() {
    this._responses = {};
    this._resetCurrentHeaders();
    this._resetCurrentData();
  }

  MockedMethod.prototype = {
    withHeaders: function (headers) {
      this._currentHeaders = headers;
      return this;
    },

    withoutHeaders: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      this._resetCurrentHeaders();
      return this;
    },

    withAnyHeaders: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      this._currentHeaders = ANY_HEADERS;
      return this;
    },

    withData: function (data) {
      this._currentData = data;
      return this;
    },

    withoutData: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      this._resetCurrentData();
      return this;
    },

    withAnyData: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      this._currentData = ANY_DATA;
      return this;
    },

    thenRespond: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      var normalized = MockedMethod._normalize(this._currentHeaders, this._currentData);

      if (!this._responses.hasOwnProperty(normalized)) {
        this._responses[normalized] = new MockedResponse();
      }

      this._resetCurrentHeaders();
      this._resetCurrentData();

      return this._responses[normalized];
    },

    getResponse: function (requestHeaders, requestData) {
      return this._responses[MockedMethod._normalize(requestHeaders, requestData)];
    },

    _resetCurrentHeaders: function () {
      this._currentHeaders = NO_HEADERS;
    },

    _resetCurrentData: function () {
      this._currentData = NO_DATA;
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
    },

    hasMethod: function (method) {
      var normalized = MockedEndpoint._normalize(method);
      return this._methods.hasOwnProperty(normalized);
    }
  };

  MockedEndpoint._normalize = function (method) {
    var normalized;

    if (!isString(method)) {
      throw getIllegalArgumentError();
    }

    normalized = method.toUpperCase();

    if (EXPECTED_METHODS_ARRAY.indexOf(normalized) === NOT_IN_ARRAY) {
      throw getIllegalArgumentError();
    }

    return normalized;
  };


  function LocoMocko() {
  }

  LocoMocko.version = '0.0.1';

  LocoMocko.shouldMock = function (library) {
    if (!isString(library)) {
      throw getIllegalArgumentError();
    }

    if (library === 'jQuery') {
      libraryOriginals.jQueryAjax = $.ajax;
      $.ajax = libraryMocks.jQueryAjax;
    }
  };

  LocoMocko.reset = function () {
    if (hasArguments(arguments)) {
      throw getIllegalArgumentError();
    }

    $.ajax = libraryOriginals.jQueryAjax;
    mockedEndpoints = {};
  };

  LocoMocko.whenUrl = function (url) {

    if (!isString(url)) {
      throw getIllegalArgumentError();
    }

    if (!mockedEndpoints.hasOwnProperty(url)) {
      mockedEndpoints[url] = new MockedEndpoint();
    }

    return mockedEndpoints[url];
  };


  window.locomocko = LocoMocko;
})(window);
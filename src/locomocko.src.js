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
  var SUPPORTED_LIBRARIES = ['jQuery', 'angular'],
    NO_ANGULAR_MODULE = '',
    STATUS_CODE_TO_TEXT = {
      100: 'Continue',
      101: 'Switching Protocols',
      102: 'Processing',
      200: 'OK',
      201: 'Created',
      202: 'Accepted',
      203: 'Non-Authoritative Information',
      204: 'No Content',
      205: 'Reset Content',
      206: 'Partial Content',
      207: 'Multi-Status',
      208: 'Already Reported',
      226: 'IM Used',
      300: 'Multiple Choices',
      301: 'Moved Permanently',
      302: 'Found',
      303: 'See Other',
      304: 'Not Modified',
      305: 'Use Proxy',
      306: 'Switch Proxy',
      307: 'Temporary Redirect',
      308: 'Permanent Redirect',
      400: 'Bad Request',
      401: 'Unauthorized',
      402: 'Payment Required',
      403: 'Forbidden',
      404: 'Not Found',
      405: 'Method Not Allowed',
      406: 'Not Acceptable',
      407: 'Proxy Authentication Required',
      408: 'Request Timeout',
      409: 'Conflict',
      410: 'Gone',
      411: 'Length Required',
      412: 'Precondition Failed',
      413: 'Request Entity Too Large',
      414: 'Request-URI Too Long',
      415: 'Unsupported Media Type',
      416: 'Requested Range Not Satisfiable',
      417: 'Expectation Failed',
      418: "I'm a teapot",
      419: 'Authentication Timeout',
      422: 'Unprocessable Entity',
      423: 'Locked',
      424: 'Failed Dependency',
      425: 'Unordered Collection',
      426: 'Upgrade Required',
      428: 'Precondition Required',
      429: 'Too Many Requests',
      431: 'Request Header Fields Too',
      451: 'Unavailable For Legal Reasons',
      500: 'Internal Server Error',
      501: 'Not Implemented',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
      504: 'Gateway Timeout',
      505: 'HTTP Version Not Supported',
      506: 'Variant Also Negotiates',
      507: 'Insufficient Storage',
      508: 'Loop Detected',
      510: 'Not Extended',
      511: 'Network Authentication Required'
    },
    NO_HEADERS = {},
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
      jQueryAjax: null,
      angularHttpProvider: null
    },
    libraryMocks = {
      currentlyMocked: {
        jQuery: false,
        angular: false
      },
      angularModule: NO_ANGULAR_MODULE,
      jQueryAjax: function (options) {
        var response = libraryMocks.getResponse(options),
          responseData = response.getData(),
          responseStatusCode = response.getStatusCode();

        options.success(responseData, 'success', {
          readyState: 4,
          status: responseStatusCode,
          statusText: STATUS_CODE_TO_TEXT[responseStatusCode],
          responseText: JSON.stringify(responseData),
          getAllResponseHeaders: function () {
            var responseHeaders = response.getHeaders(),
              headerKey, result = '';
            for (headerKey in responseHeaders) {
              if (responseHeaders.hasOwnProperty(headerKey)) {
                result += headerKey + ': ' + responseHeaders[headerKey] + '\n';
              }
            }

            return result;
          },
          getResponseHeader: function (headerKey) {
            return response.getHeaders()[headerKey];

          }
        });
      },
      angularHttpProvider: {
        $get: function () {
          var http = function (options) {
            var response = libraryMocks.getResponse(options),
              statusCode = response.getStatusCode(),
              headers = response.getHeaders(),
              isSuccess = function () {
                return 200 <= statusCode && statusCode < 300;
              },
              headersFunction = function (header) {
                if (isNullOrUndefined(header)) {
                  return headers;
                } else {
                  return headers[header];
                }
              },
              toCall = function (callback) {
                callback(response.getData(), statusCode, headersFunction, options);
                return this;
              },
              noOperation = function () {
                return this;
              };

            if (isSuccess()) {
              return {
                success: toCall,
                error: noOperation
              };
            } else {
              return {
                success: noOperation,
                error: toCall
              };
            }
          };

          http.get = function (url, config) {
            config = config || {};
            config.method = 'GET';
            config.url = url;
            return http(config);
          };

          http.post = function (url, config) {
            config = config || {};
            config.method = 'POST';
            config.url = url;
            return http(config);
          };

          http.put = function (url, config) {
            config = config || {};
            config.method = 'PUT';
            config.url = url;
            return http(config);
          };

          http.delete = function (url, config) {
            config = config || {};
            config.method = 'DELETE';
            config.url = url;
            return http(config);
          };
          return http;
        }
      },
      normalize: function (options) {
        var option, result = {};

        for (option in options) {
          if (options.hasOwnProperty(option)) {
            if (option === 'type') {
              result['method'] = options[option];
            } else {
              result[option] = options[option];
            }
          }
        }

        return result;
      },
      getResponse: function (options) {
        var mockedMethod,
          response,
          headers, data,
          normalized = libraryMocks.normalize(options),
          i, j,
          getError = function () {
            return new Error(
              'Please mock endpoint: ' + normalized.url +
                ' with method: ' + normalized.method +
                ' with headers: ' + JSON.stringify(normalized.headers) +
                ' and data: ' + JSON.stringify(normalized.data)
            );
          };

        if (!(mockedEndpoints.hasOwnProperty(normalized.url) && mockedEndpoints[normalized.url].hasMethod(normalized.method))) {
          throw getError();
        }

        mockedMethod = mockedEndpoints[normalized.url].getMethod(normalized.method);

        response = null;
        headers = [isObject(normalized.headers) ? normalized.headers : NO_HEADERS, ANY_HEADERS];
        data = [isObject(normalized.data) ? normalized.data : NO_DATA, ANY_DATA];

        for (i = 0; i < headers.length && isNullOrUndefined(response); i++) {
          for (j = 0; j < data.length && isNullOrUndefined(response); j++) {
            response = mockedMethod.getResponse(headers[i], data[j]);
          }
        }

        if (isNullOrUndefined(response)) {
          throw getError();
        }

        return response;
      }
    };

  function MockedResponse() {
    this._data = NO_DATA;
    this._headers = {};
    this._statusCode = 200;
  }

  MockedResponse.prototype = {

    withData: function (data) {
      this._data = data;

      return this;
    },

    withHeaders: function (headers) {
      this._headers = headers;

      return this;
    },

    withStatusCode: function (statusCode) {
      this._statusCode = statusCode;

      return this;
    },

    getData: function () {
      if (hasArguments(arguments)) {
        throw getIllegalArgumentError();
      }

      return this._data;
    },

    getHeaders: function () {
      return this._headers;
    },

    getStatusCode: function () {
      return this._statusCode;
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

  LocoMocko.shouldMockJQuery = function () {
    libraryMocks.currentlyMocked.jQuery = true;

    libraryOriginals.jQueryAjax = $.ajax;
    $.ajax = libraryMocks.jQueryAjax;
  };

  LocoMocko.shouldMockAngular = function (module) {

    if (!isString(module)) {
      throw getIllegalArgumentError();
    }

    angular.module(module)
      .config(function ($httpProvider, $provide) {
        libraryOriginals.angularHttpProvider = $httpProvider;
        $provide.provider('$http', libraryMocks.angularHttpProvider);

        libraryMocks.angularModule = module;
        libraryMocks.currentlyMocked.angular = true;
      });
  };

  LocoMocko.reset = function () {
    if (hasArguments(arguments)) {
      throw getIllegalArgumentError();
    }

    if (libraryMocks.currentlyMocked.jQuery) {
      $.ajax = libraryOriginals.jQueryAjax;

      libraryMocks.currentlyMocked.jQuery = false;
    }

    if (libraryMocks.currentlyMocked.angular) {
      angular.module(libraryMocks.angularModule).config(function ($provide) {
        $provide.provider('$http', libraryOriginals.angularHttpProvider);

        libraryMocks.angularModule = NO_ANGULAR_MODULE;
        libraryMocks.currentlyMocked.angular = false;
      });
    }

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
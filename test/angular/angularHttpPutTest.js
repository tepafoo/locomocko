/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('angular $http.put()', function () {

  var NO_REQUEST_HEADERS = {},
    NO_REQUEST_DATA = 'NO_REQUEST_DATA',
    assertHttpServiceMocked = function (method, done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, method, null, expectedResponseData, done);
    },
    assertHttpServiceCalled = function (expectedUrl, method, requestData, expectedResponseData, done) {
      var success = function (data, status, headers, config) {
          status.should.equal(200);
          JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done)) done();
        },
        error = function (data, status, headers, config) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        };

      if (requestData === NO_REQUEST_DATA) {
        angularHttpPut(expectedUrl).success(success).error(error);
      } else {
        angularHttpPut(expectedUrl, {data: requestData}).success(success).error(error);
      }
    },
    assertHttpServiceMockedWithRequestHeadersWithAnyData = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        requestHeaders = {
          'headerKey1': 'headerValue1',
          'headerKey2': 'headerValue2'
        },
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithRequestHeaders = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        requestHeaders = {
          'headerKey1': 'headerValue1',
          'headerKey2': 'headerValue2'
        },
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceCalledWithRequestHeaders = function (expectedUrl, method, requestHeaders, requestData, expectedResponseData, done) {
      var options = {
          headers: requestHeaders
        },
        success = function (data, status, headers, config) {
          status.should.equal(200);
          JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done))  done();

        },
        error = function (data, status, headers, config) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      angularHttpPut(expectedUrl, options).success(success).error(error);
    },
    assertHttpServiceMockedWithoutHeadersWithAnyData = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithoutHeaders = function (method, done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withoutHeaders().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    mockHttpServiceResponseHeaders = function (method, done) {
      var url = 'someUrl',
        expectedResponseHeaders = {
          "someResponseHeaderKey1": "someResponseHeaderValue1",
          "someResponseHeaderKey2": "someResponseHeaderValue2"
        };
      locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders);

      // when and then
      angularHttpPut(url).
        success(function (data, status, headers, config) {
          status.should.equal(200);

          JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
          headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
          headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');
          _.isUndefined(headers('thisHeaderDoesNotExist')).should.be.true;


          done();

        }).
        error(function (data, status, headers, config) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        });
    },
    angularHttpPut;

  beforeEach(function () {
    locomocko.shouldMockAngular('mockModule');

    angular.injector(['mockModule']).invoke(function ($http) {
      angularHttpPut = $http.put;
    });
  });

  afterEach(function () {
    locomocko.reset();
  });

  describe('happy paths', function () {

    describe('withHeaders() withAnyData()', function () {
      it('returns the passed config object on success', function (done) {
        // given
        var method = 'PUT',
          url = 'someUrl',
          requestHeaders = {
            'headerKey1': 'headerValue1',
            'headerKey2': 'headerValue2'
          },
          options = {
            headers: requestHeaders,
            data: {'someDataKey': 'someDataValue'}
          };

        locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData({
          "someResponseDataKey": "someResponseDataValue"
        }).withStatusCode(200);

        // when and then
        angularHttpPut(url, options).
          success(function (data, status, headers, config) {
            config.should.eql(options);
            done();

          }).
          error(function (data, status, headers, config) {
            // fail if execution comes to this point
            false.should.be.true;
          });
      });

      it('returns the passed config object on error', function (done) {
        // given
        var method = 'PUT',
          url = 'someUrl',
          requestHeaders = {
            'headerKey1': 'headerValue1',
            'headerKey2': 'headerValue2'
          },
          options = {
            headers: requestHeaders,
            data: {'someDataKey': 'someDataValue'}
          };

        locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData({
          "someResponseDataKey": "someResponseDataValue"
        }).withStatusCode(404);

        // when and then
        angularHttpPut(url, options).
          success(function (data, status, headers, config) {
            // fail if execution comes to this point
            false.should.be.true;
          }).
          error(function (data, status, headers, config) {
            config.should.eql(options);
            done();
          });
      });
    });

    describe('single calls', function () {

      describe('simple cases', function () {
        it('mocks angular.$http() PUT as expected', function (done) {
          assertHttpServiceMocked('PUT', done);
        });

        it('mocks angular.$http() PUT as expected thenRespond().withHeaders()', function (done) {
          mockHttpServiceResponseHeaders('PUT', done);
        });
      });

      describe('withHeaders() withAnyData()', function () {
        it('mocks angular.$http() PUT withHeaders() withAnyData() as expected', function (done) {
          assertHttpServiceMockedWithRequestHeadersWithAnyData('PUT', done);
        });
      });

      describe('withHeaders() withData()', function () {
        it('mocks angular.$http() PUT withHeaders() withData() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withHeaders() withoutData()', function () {
        it('mocks angular.$http() PUT withHeaders() withoutData() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withAnyData()', function () {
        it('mocks angular.$http() PUT withoutHeaders() withAnyData() as expected', function (done) {
          assertHttpServiceMockedWithoutHeadersWithAnyData('PUT', done);
        });
      });

      describe('withoutHeaders() withData()', function () {
        it('mocks angular.$http() PUT withoutHeaders() withData() as expected', function (done) {
          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, method, requestData, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withoutData()', function () {
        it('mocks angular.$http() PUT withoutHeaders() withoutData() as expected', function (done) {
          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withAnyData()', function () {
        it('mocks angular.$http() PUT withAnyHeaders() withAnyData() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withData()', function () {
        it('mocks angular.$http() PUT withAnyHeaders() withData() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withoutData()', function () {
        it('mocks angular.$http() PUT withAnyHeaders() withoutData() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withHeaders()', function () {
        it('mocks angular.$http() PUT withAnyData() withHeaders() as expected', function (done) {
          assertHttpServiceMockedWithAnyDataWithRequestHeaders('PUT', done);
        });
      });

      describe('withData() withHeaders()', function () {
        it('mocks angular.$http() PUT withData() withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withHeaders()', function () {
        it('mocks angular.$http() PUT withoutData() withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withoutHeaders()', function () {
        it('mocks angular.$http() PUT withAnyData() withoutHeaders() as expected', function (done) {
          assertHttpServiceMockedWithAnyDataWithoutHeaders('PUT', done);
        });
      });

      describe('withData() withoutHeaders()', function () {
        it('mocks angular.$http() PUT withData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, method, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withoutHeaders()', function () {
        it('mocks angular.$http() PUT withoutData() withoutHeaders() as expected', function (done) {
          // given
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withAnyHeaders()', function () {
        it('mocks angular.$http() PUT withAnyData() withAnyHeaders() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withData() withAnyHeaders()', function () {
        it('mocks angular.$http() PUT withData() withAnyHeaders() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withAnyHeaders()', function () {
        it('mocks angular.$http() PUT withoutData() withAnyHeaders() as expected', function (done) {
          var method = 'PUT';

          // given
          var expectedUrl = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withAnyHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('thenRespond().withHeaders().withData().withStatusCode()', function () {
        it('mocks angular.$http() PUT thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {

              // fail if execution comes to this point
              false.should.be.true;

              done();

            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            });

        });
      });

      describe('thenRespond().withData().withHeaders().withStatusCode()', function () {
        it('mocks angular.$http() PUT thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();

            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            });

        });
      });

      describe('thenRespond().withHeaders().withStatusCode().withData()', function () {
        it('mocks angular.$http() PUT thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {

              // fail if execution comes to this point
              false.should.be.true;

              done();

            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();

            });

        });
      });

      describe('thenRespond().withData().withStatusCode().withHeaders()', function () {
        it('mocks angular.$http() PUT thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {

              // fail if execution comes to this point
              false.should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            });

        });
      });

      describe('thenRespond().withStatusCode().withHeaders().withData()', function () {
        it('mocks angular.$http() PUT thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 404,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {

              // fail if execution comes to this point
              false.should.be.true;

              done();

            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            });

        });
      });

      describe('thenRespond().withStatusCode().withData().withHeaders()', function () {
        it('mocks angular.$http() PUT thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var method = 'PUT',
            url = 'someUrl',
            expectedStatusCode = 503,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          angularHttpPut(url).
            success(function (data, status, headers, config) {

              // fail if execution comes to this point
              false.should.be.true;

              done();

            }).
            error(function (data, status, headers, config) {
              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            });
        });
      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same PUT URL without data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('PUT').withoutData().thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('PUT').withoutData().thenRespond().withData(expectedResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, 'PUT', NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('uses the last mock setup when called multiple times for the same PUT URL with data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          requestData = {"requestKey": "requestValue"},
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod('PUT').withData(requestData).thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('PUT').withData(requestData).thenRespond().withData(expectedResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, 'PUT', requestData, expectedResponseData, done);
      });

      it('mocks angular.$http() for the same PUT URL but with different request payloads as expected', function (done) {
        var method = 'PUT',
          expectedUrl = 'someUrl',
          firstRequestData = {
            "firstRequestDataKey": "firstRequestDataValue"
          },
          expectedFirstResponseData = {
            "firstResponseDataKey": "firstResponseDataValue"
          },
          secondRequestData = {
            "secondRequestDataKey": "secondRequestDataValue"
          },
          expectedSecondResponseData = {
            "secondResponseDataKey": "secondResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, secondRequestData, expectedSecondResponseData, done);
      });

      it('mocks angular.$http() for a mixture of withData(), withAnyData() and  withoutData() on the same URL as expected', function (done) {
        // given
        var method = 'PUT',
          expectedUrl = 'someUrl',
          firstRequestData = {
            "someFirstRequestDataKey": "someFirstRequestDataValue"
          },
          expectedFirstResponseData = {
            "someFirstResponseDataKey": "someFirstResponseDataValue"
          },
          expectedSecondResponseData = {
            "someSecondResponseDataKey": "someSecondResponseDataValue"
          },
          expectedThirdResponseData = {
            "someThirdResponseDataKey": "someThirdResponseDataValue"
          },
          fourthRequestData = {
            "someFourthRequestDataKey": "someFourthRequestDataValue"
          },
          expectedFourthResponseData = {
            "someFourthResponseDataKey": "someFourthResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedSecondResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData(expectedThirdResponseData);
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(fourthRequestData).thenRespond().withData(expectedFourthResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, firstRequestData, expectedFirstResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, {"anyKey": "anyValue"}, expectedSecondResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, NO_REQUEST_DATA, expectedThirdResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, method, fourthRequestData, expectedFourthResponseData, done);
      });

      describe('different withHeaders(), same with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for different withHeaders() but same withData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withData(requestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withData(requestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, requestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, requestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for different withHeaders() but same withAnyData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withAnyData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, ["anyData1"], expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, {"randomNumber": Math.random()}, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for different withHeaders() but same withoutData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            firstRequestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestHeaders = {
              "secondRequestHeaderKey": "secondRequestHeaderValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(firstRequestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(secondRequestHeaders).withoutData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, firstRequestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, secondRequestHeaders, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), different withData()', function () {
        it('mocks angular.$http() for same withHeaders() but different withData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "firstRequestHeaderKey": "firstRequestHeaderValue"
            },
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for same withAnyHeaders() but different withData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"blah": "bloh"}, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"notBlah": "notBloh"}, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for same withoutHeaders() but different withData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            firstRequestData = {
              "firstRequestDataKey": "firstRequestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            secondRequestData = {
              "secondRequestDataKey": "secondRequestDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(firstRequestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(secondRequestData).thenRespond().withData(expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, secondRequestData, expectedSecondResponseData, done);
        });
      });

      describe('mixture of with{{Any/out}}Headers(), same with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, requestData, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withAnyData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withAnyData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData1": "anyData1"}, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, {"anyData3": "anyData3"}, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withoutData()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            thirdRequestHeaders = {
              "thirdRequestHeaderKey": "thirdRequestHeaderValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(thirdRequestHeaders).withoutData().thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyKey": "anyValue"}, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, thirdRequestHeaders, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), mixture of with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for same withHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, {"anyKey": "anyValue"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, requestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for same withAnyHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyHeader1": "anyHeader1"}, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyHeader2": "anyHeader2"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, {"anyHeader3": "anyHeader3"}, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for same withoutHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var method = 'PUT',
            expectedUrl = 'someUrl',
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedFirstResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedSecondResponseData);
          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedThirdResponseData, done);
        });
      });

      describe('mixture of whenUrl().withData().withHeaders() combined with mixture of thenRespond().withData().withHeaders()', function () {
        it('mocks angular.$http()', function (done) {
          var method = 'PUT',
            url = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedSecondResponseHeaders = {
              "secondResponseHeadersKey": "secondResponseHeadersValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            },
            expectedThirdResponseHeaders = {
              "thirdResponseHeadersKey": "thirdResponseHeadersValue"
            },
            assertOnSuccess = function (expectedResponseHeaders, expectedResponseData, done) {
              return function (data, status, headers, config) {
                var key;

                status.should.equal(200);

                JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                for (key in expectedResponseHeaders) {
                  if (expectedResponseHeaders.hasOwnProperty(key)) {
                    headers(key).should.equal(expectedResponseHeaders[key]);
                  }
                }

                _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

                if (_.isFunction(done)) done();
              }
            };

          locomocko.whenUrl(url).withMethod(method).withAnyHeaders().withoutData().thenRespond().withHeaders(expectedFirstResponseHeaders).withData(expectedFirstResponseData);
          locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withHeaders(expectedSecondResponseHeaders).withData(expectedSecondResponseData);
          locomocko.whenUrl(url).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withHeaders(expectedThirdResponseHeaders).withData(expectedThirdResponseData);

          // when and then
          angularHttpPut(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpPut(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpPut(url, {
            headers: requestHeaders,
            data: {'any': 'data'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedSecondResponseHeaders, expectedSecondResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpPut(url, {
            data: requestData
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedThirdResponseHeaders, expectedThirdResponseData, done)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });

        });
      });

      describe('mixture of whenUrl().withHeaders().withData() combined with mixture of thenRespond().withHeaders().withData()', function () {
        it('mocks angular.$http()', function (done) {
          var method = 'PUT',
            url = 'someUrl',
            requestHeaders = {
              "requestHeaderKey": "requestHeaderValue"
            },
            requestData = {
              "requestDataKey": "requestDataValue"
            },
            expectedFirstResponseData = {
              "firstResponseDataKey": "firstResponseDataValue"
            },
            expectedFirstResponseHeaders = {
              "firstResponseHeadersKey": "firstResponseHeadersValue"
            },
            expectedSecondResponseData = {
              "secondResponseDataKey": "secondResponseDataValue"
            },
            expectedSecondResponseHeaders = {
              "secondResponseHeadersKey": "secondResponseHeadersValue"
            },
            expectedThirdResponseData = {
              "thirdResponseDataKey": "thirdResponseDataValue"
            },
            expectedThirdResponseHeaders = {
              "thirdResponseHeadersKey": "thirdResponseHeadersValue"
            },
            assertOnSuccess = function (expectedResponseHeaders, expectedResponseData, done) {
              return function (data, status, headers, config) {
                var key;

                status.should.equal(200);

                JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                for (key in expectedResponseHeaders) {
                  if (expectedResponseHeaders.hasOwnProperty(key)) {
                    headers(key).should.equal(expectedResponseHeaders[key]);
                  }
                }

                _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

                if (_.isFunction(done)) done();

              }
            };

          locomocko.whenUrl(url).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedFirstResponseData).withHeaders(expectedFirstResponseHeaders);
          locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData).withHeaders(expectedSecondResponseHeaders);
          locomocko.whenUrl(url).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData).withHeaders(expectedThirdResponseHeaders);

          // when and then
          angularHttpPut(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpPut(url, {
            headers: requestHeaders,
            data: {'any': 'data'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedSecondResponseHeaders, expectedSecondResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpPut(url, {
            data: requestData
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedThirdResponseHeaders, expectedThirdResponseData, done)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });

        });
      });

    });
  });

});
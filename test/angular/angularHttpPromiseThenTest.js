/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('angular $http().then()', function () {

  var NO_REQUEST_HEADERS = {},
    NO_REQUEST_DATA = 'NO_REQUEST_DATA',
    assertHttpServiceMockedWithPromiseThen = function (method, done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalledWithPromiseThen(expectedUrl, method, null, expectedResponseData, done);
    },
    assertHttpServiceCalledWithPromiseThen = function (expectedUrl, method, requestData, expectedResponseData, done) {
      var options = {
        url: expectedUrl,
        method: method
      };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      angularHttp(options).
        then(function (response) {
          response.status.should.equal(200);
          JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done)) done();
        },
        function (response) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        });
    },
    assertHttpServiceMockedWithRequestHeadersWithAnyDataWithPromiseThen = function (method, done) {
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
      assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithRequestHeadersWithPromiseThen = function (method, done) {
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
      assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceCalledWithRequestHeadersWithPromiseThen = function (expectedUrl, method, requestHeaders, requestData, expectedResponseData, done) {
      var options = {
        url: expectedUrl,
        method: method,
        headers: requestHeaders
      };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      angularHttp(options).
        then(function (response) {
          response.status.should.equal(200);
          JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done))  done();

        }, function (response) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        });
    },
    assertHttpServiceMockedWithoutHeadersWithAnyDataWithPromiseThen = function (method, done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalledWithPromiseThen(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithoutHeadersWithPromiseThen = function (method, done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withoutHeaders().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalledWithPromiseThen(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
    },
    angularHttp;

  beforeEach(function () {
    locomocko.shouldMockAngular('mockModule');

    angular.injector(['mockModule']).invoke(function ($http) {
      angularHttp = $http;
    });
  });

  afterEach(function () {
    locomocko.reset();
  });

  describe('happy paths', function () {

    describe('config object', function () {
      describe('promise.then()', function () {

        it('returns the passed config object on success', function (done) {
          // given
          var method = 'GET',
            url = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            options = {
              url: url,
              method: method,
              headers: requestHeaders,
              data: {'someDataKey': 'someDataValue'}
            };

          locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData({
            "someResponseDataKey": "someResponseDataValue"
          }).withStatusCode(200);

          // when and then
          angularHttp(options).
            then(function (response) {
              response.config.should.eql(options);
              done();
            }, function (response) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });
        });

        it('returns the passed config object on error', function (done) {
          // given
          var method = 'GET',
            url = 'someUrl',
            requestHeaders = {
              'headerKey1': 'headerValue1',
              'headerKey2': 'headerValue2'
            },
            options = {
              url: url,
              method: method,
              headers: requestHeaders,
              data: {'someDataKey': 'someDataValue'}
            };

          locomocko.whenUrl(url).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData({
            "someResponseDataKey": "someResponseDataValue"
          }).withStatusCode(404);

          // when and then
          angularHttp(options).
            then(function (response) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            }, function (response) {
              response.config.should.eql(options);
              done();
            });
        });
      });
    });

    describe('single calls', function () {

      describe('simple cases', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET as expected', function (done) {
            assertHttpServiceMockedWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST as expected', function (done) {
            assertHttpServiceMockedWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT as expected', function (done) {
            assertHttpServiceMockedWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE as expected', function (done) {
            assertHttpServiceMockedWithPromiseThen('DELETE', done);
          });

          it('mocks angular.$http() GET as expected thenRespond().withHeaders()', function (done) {
            // given
            assertHttpServiceMockedWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST as expected thenRespond().withHeaders()', function (done) {
            assertHttpServiceMockedWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT as expected thenRespond().withHeaders()', function (done) {
            assertHttpServiceMockedWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE as expected thenRespond().withHeaders()', function (done) {
            assertHttpServiceMockedWithPromiseThen('DELETE', done);
          });
        });
      });

      describe('withHeaders() withAnyData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithRequestHeadersWithAnyDataWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST withHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithRequestHeadersWithAnyDataWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT withHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithRequestHeadersWithAnyDataWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE withHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithRequestHeadersWithAnyDataWithPromiseThen('DELETE', done);
          });
        });
      });

      describe('withHeaders() withData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withHeaders() withData() as expected', function (done) {

            // given
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withHeaders() withoutData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withHeaders() withoutData() as expected', function (done) {

            // given
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withoutHeaders() withAnyData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithoutHeadersWithAnyDataWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST withoutHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithoutHeadersWithAnyDataWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT withoutHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithoutHeadersWithAnyDataWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE withoutHeaders() withAnyData() as expected', function (done) {
            assertHttpServiceMockedWithoutHeadersWithAnyDataWithPromiseThen('DELETE', done);
          });
        });
      });

      describe('withoutHeaders() withData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutHeaders() withData() as expected', function (done) {
            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              requestData = {"requestDataKey": "requestDataValue"},
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

            // when and then
            assertHttpServiceCalledWithPromiseThen(expectedUrl, method, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withoutHeaders() withoutData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutHeaders() withoutData() as expected', function (done) {
            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedResponseData);

            // when and then
            assertHttpServiceCalledWithPromiseThen(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withAnyHeaders() withAnyData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyHeaders() withAnyData() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withAnyHeaders() withData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyHeaders() withData() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withAnyHeaders() withoutData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyHeaders() withoutData() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withAnyData() withHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyData() withHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithRequestHeadersWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST withAnyData() withHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithRequestHeadersWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT withAnyData() withHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithRequestHeadersWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE withAnyData() withHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithRequestHeadersWithPromiseThen('DELETE', done);
          });
        });
      });

      describe('withData() withHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withData() withHeaders() as expected', function (done) {

            // given
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withoutData() withHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutData() withHeaders() as expected', function (done) {

            // given
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withAnyData() withoutHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyData() withoutHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithoutHeadersWithPromiseThen('GET', done);
          });

          it('mocks angular.$http() POST withAnyData() withoutHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithoutHeadersWithPromiseThen('POST', done);
          });

          it('mocks angular.$http() PUT withAnyData() withoutHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithoutHeadersWithPromiseThen('PUT', done);
          });

          it('mocks angular.$http() DELETE withAnyData() withoutHeaders() as expected', function (done) {
            assertHttpServiceMockedWithAnyDataWithoutHeadersWithPromiseThen('DELETE', done);
          });
        });
      });

      describe('withData() withoutHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withData() withoutHeaders() as expected', function (done) {
            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              requestData = {"requestDataKey": "requestDataValue"},
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withoutHeaders().thenRespond().withData(expectedResponseData);

            // when and then
            assertHttpServiceCalledWithPromiseThen(expectedUrl, method, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withoutData() withoutHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutData() withoutHeaders() as expected', function (done) {
            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withoutHeaders().thenRespond().withData(expectedResponseData);

            // when and then
            assertHttpServiceCalledWithPromiseThen(expectedUrl, method, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withAnyData() withAnyHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withAnyData() withAnyHeaders() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('withData() withAnyHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withData() withAnyHeaders() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, requestData, expectedResponseData, done);
          });
        });
      });

      describe('withoutData() withAnyHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET withoutData() withAnyHeaders() as expected', function (done) {
            var method = 'GET';

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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
          });
        });
      });

      describe('thenRespond().withHeaders().withData().withStatusCode()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 301,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };
            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                if (_.isFunction(done)) done();
              }, function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                if (_.isFunction(done)) done();
              });
          });

          it('mocks angular.$http() POST thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 500,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() PUT thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() DELETE thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                if (_.isFunction(done)) done();
              });
          });
        });
      });

      describe('thenRespond().withData().withHeaders().withStatusCode()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });
          });

          it('mocks angular.$http() POST thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();

              });
          });

          it('mocks angular.$http() PUT thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 503,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });

          });

          it('mocks angular.$http() DELETE thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 201,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

          });

        });
      });

      describe('thenRespond().withHeaders().withStatusCode().withData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 301,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() POST thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 500,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });

          });

          it('mocks angular.$http() PUT thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();

              });

          });

          it('mocks angular.$http() DELETE thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

          });
        });
      });

      describe('thenRespond().withData().withStatusCode().withHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });
          });

          it('mocks angular.$http() POST thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();

              });

          });

          it('mocks angular.$http() PUT thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 503,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });

          });

          it('mocks angular.$http() DELETE thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 201,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });
          });
        });
      });

      describe('thenRespond().withStatusCode().withHeaders().withData()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 301,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });

          });

          it('mocks angular.$http() POST thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 500,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() PUT thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });

          });

          it('mocks angular.$http() DELETE thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

          });
        });
      });

      describe('thenRespond().withStatusCode().withData().withHeaders()', function () {
        describe('promise.then()', function () {
          it('mocks angular.$http() GET thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

            // given
            var method = 'GET',
              expectedUrl = 'someUrl',
              expectedStatusCode = 200,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });
          });

          it('mocks angular.$http() POST thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

            // given
            var method = 'POST',
              expectedUrl = 'someUrl',
              expectedStatusCode = 404,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();
              }, function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() PUT thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

            // given
            var method = 'PUT',
              expectedUrl = 'someUrl',
              expectedStatusCode = 503,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                // fail if execution comes to this point
                false.should.be.true;

                done();

              }, function (response) {
                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              });
          });

          it('mocks angular.$http() DELETE thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

            // given
            var method = 'DELETE',
              expectedUrl = 'someUrl',
              expectedStatusCode = 201,
              expectedResponseHeaders = {
                "someResponseHeaderKey1": "someResponseHeaderValue1",
                "someResponseHeaderKey2": "someResponseHeaderValue2"
              },
              expectedResponseData = {
                "someResponseDataKey": "someResponseDataValue"
              };

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method
            }).
              then(function (response) {

                response.status.should.equal(expectedStatusCode);

                JSON.stringify(response.data).should.equal(JSON.stringify(expectedResponseData));

                JSON.stringify(response.headers()).should.equal(JSON.stringify(expectedResponseHeaders));
                response.headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
                response.headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

                _.isUndefined(response.headers('thisKeyDoesNotExist')).should.be.true;

                done();
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });
          });
        });
      });
    });

    describe('combinations', function () {
      describe('promise.then()', function () {

        it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
          // given
          var expectedUrl = 'someUrl',
            expectedResponseData = {
              "lastResponseDataKey": "lastResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
          locomocko.whenUrl(expectedUrl).withMethod('GET').withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'GET', NO_REQUEST_DATA, expectedResponseData, done);
        });

        it('uses the last mock setup when called multiple times for the same GET URL with data', function (done) {
          // given
          var expectedUrl = 'someUrl',
            requestData = {"requestKey": "requestValue"},
            expectedResponseData = {
              "lastResponseDataKey": "lastResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
          locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'GET', requestData, expectedResponseData, done);
        });

        it('mocks angular.$http() for the same GET URL but with different request payloads as expected', function (done) {
          var method = 'GET',
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
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, secondRequestData, expectedSecondResponseData, done);
        });

        it('separately mocks angular.$http() GET, POST, PUT and DELETE on the same URL as expected', function (done) {
          // given
          var expectedUrl = 'someUrl',
            expectedGetResponseData = {
              "someGetResponseDataKey": "someGetResponseDataValue"
            },
            expectedPostResponseData = {
              "somePostResponseDataKey": "somePostResponseDataValue"
            },
            expectedPutResponseData = {
              "somePutResponseDataKey": "somePutResponseDataValue"
            },
            expectedDeleteResponseData = {
              "someDeleteResponseDataKey": "someDeleteResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod('GET').withAnyData().thenRespond().withData(expectedGetResponseData);
          locomocko.whenUrl(expectedUrl).withMethod('POST').withAnyData().thenRespond().withData(expectedPostResponseData);
          locomocko.whenUrl(expectedUrl).withMethod('PUT').withAnyData().thenRespond().withData(expectedPutResponseData);
          locomocko.whenUrl(expectedUrl).withMethod('DELETE').withAnyData().thenRespond().withData(expectedDeleteResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'GET', null, expectedGetResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'POST', null, expectedPostResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'PUT', null, expectedPutResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, 'DELETE', null, expectedDeleteResponseData, done);
        });

        it('mocks angular.$http() for a mixture of methods and URL as expected', function (done) {
          // given
          var expectedFirstUrl = 'firstUrl',
            expectedFirstUrlGetResponseData = {
              "firstUrlGetResponseDataKey": "firstUrlGetResponseDataValue"
            },
            expectedFirstUrlDeleteResponseData = {
              "firstUrlDeleteResponseDataKey": "firstUrlDeleteResponseDataValue"
            },
            expectedSecondUrl = 'secondUrl',
            expectedSecondUrlPostResponseData = {
              "secondUrlPostResponseDataKey": "secondUrlPostResponseDataValue"
            },
            expectedThirdUrl = 'thirdUrl',
            expectedThirdUrlPutResponseData = {
              "thirdUrlPutResponseDataKey": "thirdUrlPutResponseDataValue"
            };

          locomocko.whenUrl(expectedFirstUrl).withMethod('GET').withAnyData().thenRespond().withData(expectedFirstUrlGetResponseData);
          locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').withAnyData().thenRespond().withData(expectedFirstUrlDeleteResponseData);
          locomocko.whenUrl(expectedSecondUrl).withMethod('POST').withAnyData().thenRespond().withData(expectedSecondUrlPostResponseData);
          locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').withAnyData().thenRespond().withData(expectedThirdUrlPutResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedFirstUrl, 'GET', null, expectedFirstUrlGetResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedFirstUrl, 'DELETE', null, expectedFirstUrlDeleteResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedSecondUrl, 'POST', null, expectedSecondUrlPostResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedThirdUrl, 'PUT', null, expectedThirdUrlPutResponseData, done);
        });

        it('mocks angular.$http() for a mixture of withData(), withAnyData() and  withoutData() on the same URL as expected', function (done) {
          // given
          var method = 'GET',
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
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, {"anyKey": "anyValue"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, NO_REQUEST_DATA, expectedThirdResponseData);

          // when and then
          assertHttpServiceCalledWithPromiseThen(expectedUrl, method, fourthRequestData, expectedFourthResponseData, done);
        });

        describe('different withHeaders(), same with{{Any/out}}Data()', function () {
          it('mocks angular.$http() for different withHeaders() but same withData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, firstRequestHeaders, requestData, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, secondRequestHeaders, requestData, expectedSecondResponseData, done);
          });

          it('mocks angular.$http() for different withHeaders() but same withAnyData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, firstRequestHeaders, ["anyData1"], expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, secondRequestHeaders, {"randomNumber": Math.random()}, expectedSecondResponseData, done);
          });

          it('mocks angular.$http() for different withHeaders() but same withoutData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, firstRequestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, secondRequestHeaders, NO_REQUEST_DATA, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedThirdResponseData, done);
          });
        });

        describe('same with{{Any/out}}Headers(), different withData()', function () {
          it('mocks angular.$http() for same withHeaders() but different withData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, firstRequestData, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, secondRequestData, expectedSecondResponseData, done);
          });

          it('mocks angular.$http() for same withAnyHeaders() but different withData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"blah": "bloh"}, firstRequestData, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"notBlah": "notBloh"}, secondRequestData, expectedSecondResponseData, done);
          });

          it('mocks angular.$http() for same withoutHeaders() but different withData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, firstRequestData, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, secondRequestData, expectedSecondResponseData, done);
          });
        });

        describe('mixture of with{{Any/out}}Headers(), same with{{Any/out}}Data()', function () {
          it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyKey": "anyValue"}, requestData, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, thirdRequestHeaders, requestData, expectedThirdResponseData, done);
          });

          it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withAnyData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData1": "anyData1"}, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyKey": "anyValue"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, thirdRequestHeaders, {"anyData3": "anyData3"}, expectedThirdResponseData, done);
          });

          it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withoutData()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyKey": "anyValue"}, NO_REQUEST_DATA, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, thirdRequestHeaders, NO_REQUEST_DATA, expectedThirdResponseData, done);
          });
        });

        describe('same with{{Any/out}}Headers(), mixture of with{{Any/out}}Data()', function () {
          it('mocks angular.$http() for same withHeaders() but mixture of with{{Any/out}}Data()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, {"anyKey": "anyValue"}, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, requestHeaders, requestData, expectedThirdResponseData, done);
          });

          it('mocks angular.$http() for same withAnyHeaders() but mixture of with{{Any/out}}Data()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyHeader1": "anyHeader1"}, NO_REQUEST_DATA, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyHeader2": "anyHeader2"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, {"anyHeader3": "anyHeader3"}, requestData, expectedThirdResponseData, done);
          });

          it('mocks angular.$http() for same withoutHeaders() but mixture of with{{Any/out}}Data()', function (done) {
            var method = 'GET',
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
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, {"anyData2": "anyData2"}, expectedSecondResponseData);

            // when and then
            assertHttpServiceCalledWithRequestHeadersWithPromiseThen(expectedUrl, method, NO_REQUEST_HEADERS, requestData, expectedThirdResponseData, done);
          });
        });

        describe('mixture of whenUrl().withData().withHeaders() combined with mixture of thenRespond().withData().withHeaders()', function () {
          it('mocks angular.$http()', function (done) {
            var method = 'GET',
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

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withHeaders(expectedFirstResponseHeaders).withData(expectedFirstResponseData);
            locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withHeaders(expectedSecondResponseHeaders).withData(expectedSecondResponseData);
            locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withHeaders(expectedThirdResponseHeaders).withData(expectedThirdResponseData);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method,
              headers: {'any': 'headers'}
            }).
              then(function (response) {
                assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

            angularHttp({
              url: expectedUrl,
              method: method,
              headers: {'any': 'headers'}
            }).
              then(function (response) {
                assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

            angularHttp({
              url: expectedUrl,
              method: method,
              headers: requestHeaders,
              data: {'any': 'data'}
            }).
              then(function (response) {
                assertOnSuccess(expectedSecondResponseHeaders, expectedSecondResponseData)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

            angularHttp({
              url: expectedUrl,
              method: method,
              data: requestData
            }).
              then(function (response) {
                assertOnSuccess(expectedThirdResponseHeaders, expectedThirdResponseData, done)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

          });
        });

        describe('mixture of whenUrl().withHeaders().withData() combined with mixture of thenRespond().withHeaders().withData()', function () {
          it('mocks angular.$http()', function (done) {
            var method = 'GET',
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

            locomocko.whenUrl(expectedUrl).withMethod(method).withAnyHeaders().withoutData().thenRespond().withData(expectedFirstResponseData).withHeaders(expectedFirstResponseHeaders);
            locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withAnyData().thenRespond().withData(expectedSecondResponseData).withHeaders(expectedSecondResponseHeaders);
            locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedThirdResponseData).withHeaders(expectedThirdResponseHeaders);

            // when and then
            angularHttp({
              url: expectedUrl,
              method: method,
              headers: {'any': 'headers'}
            }).
              then(function (response) {
                assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

            angularHttp({
              url: expectedUrl,
              method: method,
              headers: requestHeaders,
              data: {'any': 'data'}
            }).
              then(function (response) {
                assertOnSuccess(expectedSecondResponseHeaders, expectedSecondResponseData)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

            angularHttp({
              url: expectedUrl,
              method: method,
              data: requestData
            }).
              then(function (response) {
                assertOnSuccess(expectedThirdResponseHeaders, expectedThirdResponseData, done)(response.data, response.status, response.headers, response.config);
              }, function (response) {
                // fail if execution comes to this point
                false.should.be.true;

                done();
              });

          });
        });
      });
    });
  });
});
/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('angular $http.delete()', function () {

  var method = 'DELETE',
    NO_REQUEST_HEADERS = {},
    NO_REQUEST_DATA = 'NO_REQUEST_DATA',
    assertHttpServiceMocked = function (done) {
      // given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, null, expectedResponseData, done);
    },
    assertHttpServiceCalled = function (expectedUrl, requestData, expectedResponseData, done) {
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
        angularHttpDelete(expectedUrl).success(success).error(error);
      } else {
        angularHttpDelete(expectedUrl, {data: requestData}).success(success).error(error);
      }
    },
    assertHttpServiceMockedWithRequestHeadersWithAnyData = function (done) {
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
      assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithRequestHeaders = function (done) {
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
      assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceCalledWithRequestHeaders = function (expectedUrl, requestHeaders, requestData, expectedResponseData, done) {
      var options = {
        headers: requestHeaders
      };

      if (requestData !== NO_REQUEST_DATA) {
        options.data = requestData;
      }

      angularHttpDelete(expectedUrl, options).
        success(function (data, status, headers, config) {
          status.should.equal(200);
          JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

          if (_.isFunction(done))  done();

        }).
        error(function (data, status, headers, config) {
          // fail if execution comes to this point
          false.should.be.true;

          if (_.isFunction(done)) done();
        });
    },
    assertHttpServiceMockedWithoutHeadersWithAnyData = function (done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withAnyData().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
    },
    assertHttpServiceMockedWithAnyDataWithoutHeaders = function (done) {
// given
      var expectedUrl = 'someUrl',
        expectedResponseData = {
          "someResponseDataKey": "someResponseDataValue"
        };

      locomocko.whenUrl(expectedUrl).withMethod(method).withAnyData().withoutHeaders().thenRespond().withData(expectedResponseData);

      // when and then
      assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
    },
    mockHttpServiceResponseHeaders = function (done) {
      var url = 'someUrl',
        expectedResponseHeaders = {
          "someResponseHeaderKey1": "someResponseHeaderValue1",
          "someResponseHeaderKey2": "someResponseHeaderValue2"
        };
      locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders);

      // when and then
      angularHttpDelete(url).
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
    angularHttpDelete;

  beforeEach(function () {
    locomocko.shouldMockAngular('mockModule');

    angular.injector(['mockModule']).invoke(function ($http) {
      angularHttpDelete = $http.delete;
    });
  });

  afterEach(function () {
    locomocko.reset();
  });

  describe('happy paths', function () {

    describe('withHeaders() withAnyData()', function () {
      it('returns the passed config object on success', function (done) {
        // given
        var url = 'someUrl',
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
        angularHttpDelete(url, options).
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
        var url = 'someUrl',
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
        angularHttpDelete(url, options).
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
        it('mocks angular.$http() DELETE as expected', function (done) {
          assertHttpServiceMocked(done);
        });

        it('mocks angular.$http() DELETE as expected thenRespond().withHeaders()', function (done) {
          mockHttpServiceResponseHeaders(done);
        });
      });

      describe('withHeaders() withAnyData()', function () {
        it('mocks angular.$http() DELETE withHeaders() withAnyData() as expected', function (done) {
          assertHttpServiceMockedWithRequestHeadersWithAnyData(done);
        });
      });

      describe('withHeaders() withData()', function () {
        it('mocks angular.$http() DELETE withHeaders() withData() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withHeaders() withoutData()', function () {
        it('mocks angular.$http() DELETE withHeaders() withoutData() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withHeaders(requestHeaders).withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withAnyData()', function () {
        it('mocks angular.$http() DELETE withoutHeaders() withAnyData() as expected', function (done) {
          assertHttpServiceMockedWithoutHeadersWithAnyData(done);
        });
      });

      describe('withoutHeaders() withData()', function () {
        it('mocks angular.$http() DELETE withoutHeaders() withData() as expected', function (done) {
          // given
          var expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withData(requestData).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('withoutHeaders() withoutData()', function () {
        it('mocks angular.$http() DELETE withoutHeaders() withoutData() as expected', function (done) {
          // given
          var expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutHeaders().withoutData().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withAnyData()', function () {
        it('mocks angular.$http() DELETE withAnyHeaders() withAnyData() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withData()', function () {
        it('mocks angular.$http() DELETE withAnyHeaders() withData() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withAnyHeaders() withoutData()', function () {
        it('mocks angular.$http() DELETE withAnyHeaders() withoutData() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withHeaders()', function () {
        it('mocks angular.$http() DELETE withAnyData() withHeaders() as expected', function (done) {
          assertHttpServiceMockedWithAnyDataWithRequestHeaders(done);
        });
      });

      describe('withData() withHeaders()', function () {
        it('mocks angular.$http() DELETE withData() withHeaders() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withHeaders()', function () {
        it('mocks angular.$http() DELETE withoutData() withHeaders() as expected', function (done) {

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

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withHeaders(requestHeaders).thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withoutHeaders()', function () {
        it('mocks angular.$http() DELETE withAnyData() withoutHeaders() as expected', function (done) {
          assertHttpServiceMockedWithAnyDataWithoutHeaders(done);
        });

      });

      describe('withData() withoutHeaders()', function () {
        it('mocks angular.$http() DELETE withData() withoutHeaders() as expected', function (done) {
          // given
          var expectedUrl = 'someUrl',
            requestData = {"requestDataKey": "requestDataValue"},
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withoutHeaders()', function () {
        it('mocks angular.$http() DELETE withoutData() withoutHeaders() as expected', function (done) {
          // given
          var expectedUrl = 'someUrl',
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().withoutHeaders().thenRespond().withData(expectedResponseData);

          // when and then
          assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withAnyData() withAnyHeaders()', function () {
        it('mocks angular.$http() DELETE withAnyData() withAnyHeaders() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('withData() withAnyHeaders()', function () {
        it('mocks angular.$http() DELETE withData() withAnyHeaders() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, requestData, expectedResponseData, done);
        });
      });

      describe('withoutData() withAnyHeaders()', function () {
        it('mocks angular.$http() DELETE withoutData() withAnyHeaders() as expected', function (done) {
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedResponseData, done);
        });
      });

      describe('thenRespond().withHeaders().withData().withStatusCode()', function () {
        it('mocks angular.$http() DELETE thenRespond().withHeaders().withData().withStatusCode() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedStatusCode);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              if (_.isFunction(done)) done();
            });
        });
      });

      describe('thenRespond().withData().withHeaders().withStatusCode()', function () {
        it('mocks angular.$http() DELETE thenRespond().withData().withHeaders().withStatusCode() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });

        });

      });

      describe('thenRespond().withHeaders().withStatusCode().withData()', function () {
        it('mocks angular.$http() DELETE thenRespond().withHeaders().withStatusCode().withData() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withHeaders(expectedResponseHeaders).withStatusCode(expectedStatusCode).withData(expectedResponseData);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });

        });

      });

      describe('thenRespond().withData().withStatusCode().withHeaders()', function () {
        it('mocks angular.$http() DELETE thenRespond().withData().withStatusCode().withHeaders() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData(expectedResponseData).withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });
        });

      });

      describe('thenRespond().withStatusCode().withHeaders().withData()', function () {
        it('mocks angular.$http() DELETE thenRespond().withStatusCode().withHeaders().withData() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 200,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withHeaders(expectedResponseHeaders).withData(expectedResponseData);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });

        });

      });

      describe('thenRespond().withStatusCode().withData().withHeaders()', function () {
        it('mocks angular.$http() DELETE thenRespond().withStatusCode().withData().withHeaders() as expected', function (done) {

          // given
          var url = 'someUrl',
            expectedStatusCode = 201,
            expectedResponseHeaders = {
              "someResponseHeaderKey1": "someResponseHeaderValue1",
              "someResponseHeaderKey2": "someResponseHeaderValue2"
            },
            expectedResponseData = {
              "someResponseDataKey": "someResponseDataValue"
            };

          locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withStatusCode(expectedStatusCode).withData(expectedResponseData).withHeaders(expectedResponseHeaders);

          // when and then
          angularHttpDelete(url).
            success(function (data, status, headers, config) {

              status.should.equal(expectedStatusCode);

              JSON.stringify(data).should.equal(JSON.stringify(expectedResponseData));

              JSON.stringify(headers()).should.equal(JSON.stringify(expectedResponseHeaders));
              headers('someResponseHeaderKey1').should.equal('someResponseHeaderValue1');
              headers('someResponseHeaderKey2').should.equal('someResponseHeaderValue2');

              _.isUndefined(headers('thisKeyDoesNotExist')).should.be.true;

              done();
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });
        });

      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same DELETE URL without data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withoutData().thenRespond().withData(expectedResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedResponseData, done);
      });

      it('uses the last mock setup when called multiple times for the same DELETE URL with data', function (done) {
        // given
        var expectedUrl = 'someUrl',
          requestData = {"requestKey": "requestValue"},
          expectedResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond().withData({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod(method).withData(requestData).thenRespond().withData(expectedResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, requestData, expectedResponseData, done);
      });

      it('mocks angular.$http() for the same DELETE URL but with different request payloads as expected', function (done) {
        var expectedUrl = 'someUrl',
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
        assertHttpServiceCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, secondRequestData, expectedSecondResponseData, done);
      });

      it('mocks angular.$http() for a mixture of withData(), withAnyData() and  withoutData() on the same URL as expected', function (done) {
        // given
        var expectedUrl = 'someUrl',
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
        assertHttpServiceCalled(expectedUrl, firstRequestData, expectedFirstResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, {"anyKey": "anyValue"}, expectedSecondResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, NO_REQUEST_DATA, expectedThirdResponseData);

        // when and then
        assertHttpServiceCalled(expectedUrl, fourthRequestData, expectedFourthResponseData, done);
      });

      describe('different withHeaders(), same with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for different withHeaders() but same withData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, firstRequestHeaders, requestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, secondRequestHeaders, requestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for different withHeaders() but same withAnyData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, firstRequestHeaders, ["anyData1"], expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, secondRequestHeaders, {"randomNumber": Math.random()}, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for different withHeaders() but same withoutData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, firstRequestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, secondRequestHeaders, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), different withData()', function () {
        it('mocks angular.$http() for same withHeaders() but different withData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for same withAnyHeaders() but different withData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"blah": "bloh"}, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"notBlah": "notBloh"}, secondRequestData, expectedSecondResponseData, done);
        });

        it('mocks angular.$http() for same withoutHeaders() but different withData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, firstRequestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, secondRequestData, expectedSecondResponseData, done);
        });
      });

      describe('mixture of with{{Any/out}}Headers(), same with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, requestData, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyKey": "anyValue"}, requestData, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, thirdRequestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withAnyData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, {"anyData1": "anyData1"}, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyKey": "anyValue"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, thirdRequestHeaders, {"anyData3": "anyData3"}, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for mixture of with{{Any/out}}Headers() but same withoutData()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyKey": "anyValue"}, NO_REQUEST_DATA, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, thirdRequestHeaders, NO_REQUEST_DATA, expectedThirdResponseData, done);
        });
      });

      describe('same with{{Any/out}}Headers(), mixture of with{{Any/out}}Data()', function () {
        it('mocks angular.$http() for same withHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, {"anyKey": "anyValue"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, requestHeaders, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for same withAnyHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyHeader1": "anyHeader1"}, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyHeader2": "anyHeader2"}, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, {"anyHeader3": "anyHeader3"}, requestData, expectedThirdResponseData, done);
        });

        it('mocks angular.$http() for same withoutHeaders() but mixture of with{{Any/out}}Data()', function (done) {
          var expectedUrl = 'someUrl',
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
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, NO_REQUEST_DATA, expectedFirstResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, {"anyData2": "anyData2"}, expectedSecondResponseData);

          // when and then
          assertHttpServiceCalledWithRequestHeaders(expectedUrl, NO_REQUEST_HEADERS, requestData, expectedThirdResponseData, done);
        });
      });

      describe('mixture of whenUrl().withData().withHeaders() combined with mixture of thenRespond().withData().withHeaders()', function () {
        it('mocks angular.$http()', function (done) {
          var url = 'someUrl',
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
          angularHttpDelete(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpDelete(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpDelete(url, {
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

          angularHttpDelete(url, {
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
          var url = 'someUrl',
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
          angularHttpDelete(url, {
            headers: {'any': 'headers'}
          }).
            success(function (data, status, headers, config) {
              assertOnSuccess(expectedFirstResponseHeaders, expectedFirstResponseData)(data, status, headers, config);
            }).
            error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;
            });

          angularHttpDelete(url, {
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

          angularHttpDelete(url, {
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
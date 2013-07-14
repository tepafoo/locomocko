/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

function _angularHttpMethodTransformTest(method) {

  var angularMethod = method.toLocaleLowerCase();

  // special case for JSONP :S
  method = method.toLowerCase() === 'jsonp' ? 'GET' : method;

  return function () {
    describe('transforms', function () {

      var angularHttpMethod;

      beforeEach(function () {
        locomocko.shouldMockAngular('mockModule');

        angular.injector(['mockModule']).invoke(function ($http) {
          angularHttpMethod = $http[angularMethod];
        });
      });

      afterEach(function () {
        locomocko.reset();
      });

      describe('transforms', function () {
        it('should call the passed response transform with the correct arguments', function (done) {
          var url = 'someUrl',
            expectedResponseHeaders = {
              "response": "headers"
            },
            expectedResponseData = {
              "response": "data"
            },
            expectedResponseStatusCode = 200;

          locomocko.whenUrl(url).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedResponseStatusCode);

          angularHttpMethod(url, {
            data: {'some': 'data'},
            transformResponse: function (data, headersGetter) {
              var key;

              data.should.eql(expectedResponseData);

              JSON.stringify(headersGetter()).should.equal(JSON.stringify(expectedResponseHeaders));
              for (key in expectedResponseHeaders) {
                if (expectedResponseHeaders.hasOwnProperty(key)) {
                  headersGetter(key).should.equal(expectedResponseHeaders[key]);
                }
              }

              _.isUndefined(headersGetter('thisKeyDoesNotExist')).should.be.true;

              done();

            }
          });
        });

        it('should call the passed array of response transforms with the correct arguments', function (done) {
          var url = 'someUrl',
            expectedResponseHeaders = {
              "response": "headers"
            },
            expectedResponseData = {
              "response": "data"
            },
            expectedResponseStatusCode = 200,
            callCount = 0,
            transformResponse = function (data, headersGetter) {
              var key;

              data.should.eql(expectedResponseData);

              JSON.stringify(headersGetter()).should.equal(JSON.stringify(expectedResponseHeaders));
              for (key in expectedResponseHeaders) {
                if (expectedResponseHeaders.hasOwnProperty(key)) {
                  headersGetter(key).should.equal(expectedResponseHeaders[key]);
                }
              }

              _.isUndefined(headersGetter('thisKeyDoesNotExist')).should.be.true;

              callCount++;

              return data;
            },
            transformResponseArray = [transformResponse, transformResponse, function (data, headersGetter) {
              transformResponse(data, headersGetter);

              callCount.should.equal(3);

              done();

            }];

          locomocko.whenUrl(url).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedResponseStatusCode);

          angularHttpMethod(url, {
            data: {'some': 'data'},
            transformResponse: transformResponseArray
          });
        });

        it('should use the result from the response transform', function (done) {
          var url = 'someUrl',
            expectedResponseHeaders = {
              "response": "headers"
            },
            expectedResponseData = {
              "response": "data"
            },
            expectedResponseStatusCode = 200,
            expectedTransformedData = 'i have been transformed';

          locomocko.whenUrl(url).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedResponseStatusCode);

          angularHttpMethod(url, {
            data: {'some': 'data'},
            transformResponse: function (data, headersGetter) {
              return  expectedTransformedData;
            }
          })
            .success(function (data, status, headers, config) {
              data.should.equal(expectedTransformedData);

              done();
            }).error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });
        });

        it('should use the result from the array of response transforms', function (done) {
          var url = 'someUrl',
            expectedResponseHeaders = {
              "response": "headers"
            },
            expectedResponseData = 'someResponseData',
            expectedResponseStatusCode = 200,
            callCount = 0,
            transformResponse = function (data, headersGetter) {
              return data + callCount++;
            },
            transformResponseArray = [transformResponse, transformResponse, transformResponse];

          locomocko.whenUrl(url).withMethod(method).withAnyData().withAnyHeaders().thenRespond().withHeaders(expectedResponseHeaders).withData(expectedResponseData).withStatusCode(expectedResponseStatusCode);

          angularHttpMethod(url, {
            data: {'some': 'data'},
            transformResponse: transformResponseArray
          })
            .success(function (data, status, headers, config) {

              data.should.equal(expectedResponseData + '012');

              done();
            }).error(function (data, status, headers, config) {
              // fail if execution comes to this point
              false.should.be.true;

              done();
            });
        });
      });
    });
  };
}
/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

//
//
// common assertion methods
//
//
var assertResponseIsSuccess = function (textStatus, jqXHR) {
    textStatus.should.equal('success');
    _.isObject(jqXHR).should.be.true;
    jqXHR.readyState.should.equal(4);
    jqXHR.status.should.equal(200);
    jqXHR.statusText.should.equal('OK');
  },
  assertResponseData = function (jqXHR, expectedResponseData, actualResponseData) {
    jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

    JSON.stringify(actualResponseData).should.equal(JSON.stringify(expectedResponseData));
  },
  assertJQueryMocked = function (method, done, whenAndThen) {
    // given
    var expectedUrl = 'someUrl',
      expectedResponseData = {
        "someResponseDataKey": "someResponseDataValue"
      };

    locomocko.whenUrl(expectedUrl).withMethod(method).thenRespond(expectedResponseData);

    // when and then
    whenAndThen(expectedUrl, method, null, expectedResponseData, done);
  },
  assertJQueryMethodMockedWhenMockCalledMultipleTimesWithoutData = function (assertJQueryMethodUnderTestCalled, done) {
// given
    var expectedUrl = 'someUrl',
      expectedResponseData = {
        "lastResponseDataKey": "lastResponseDataValue"
      };

    locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
    locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedResponseData);

    // when and then
    assertJQueryMethodUnderTestCalled(expectedUrl, 'GET', null, expectedResponseData, done);
  },
  assertJQueryMethodMockedWhenMockCalledMultipleTimesWithData = function (assertJQueryMethodUnderTestCalled, done) {
    // given
    var expectedUrl = 'someUrl',
      requestData = {"requestKey": "requestValue"},
      expectedResponseData = {
        "lastResponseDataKey": "lastResponseDataValue"
      };

    locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
    locomocko.whenUrl(expectedUrl).withMethod('GET').withData(requestData).thenRespond(expectedResponseData);

    // when and then
    assertJQueryMethodUnderTestCalled(expectedUrl, 'GET', requestData, expectedResponseData, done);
  },
  assertJQueryMethodMockedForMultipleUrls = function (assertJQueryMethodCalled, done) {
// given
    var method = 'GET',
      expectedFirstUrl = 'firstUrl',
      expectedFirstUrlGetResponseData = {
        "firstUrlGetResponseDataKey": "firstUrlGetResponseDataValue"
      },
      expectedSecondUrl = 'secondUrl',
      expectedSecondUrlGetResponseData = {
        "secondUrlGetResponseDataKey": "secondUrlGetResponseDataValue"
      },
      expectedThirdUrl = 'thirdUrl',
      expectedThirdUrlGetResponseData = {
        "thirdUrlGetResponseDataKey": "thirdUrlGetResponseDataValue"
      };

    locomocko.whenUrl(expectedFirstUrl).withMethod(method).thenRespond(expectedFirstUrlGetResponseData);
    locomocko.whenUrl(expectedSecondUrl).withMethod(method).thenRespond(expectedSecondUrlGetResponseData);
    locomocko.whenUrl(expectedThirdUrl).withMethod(method).thenRespond(expectedThirdUrlGetResponseData);

    // when and then
    assertJQueryMethodCalled(expectedFirstUrl, method, null, expectedFirstUrlGetResponseData, done);

    // when and then
    assertJQueryMethodCalled(expectedSecondUrl, method, null, expectedSecondUrlGetResponseData, done);

    // when and then
    assertJQueryMethodCalled(expectedThirdUrl, method, null, expectedThirdUrlGetResponseData, done);
  },
  assertJQueryMethodMockedForSameUrlWithMultipleRequestData = function (method, jQueryMethod, done) {
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

    locomocko.whenUrl(expectedUrl).withMethod(method).withData(firstRequestData).thenRespond(expectedFirstResponseData);
    locomocko.whenUrl(expectedUrl).withMethod(method).withData(secondRequestData).thenRespond(expectedSecondResponseData);

    // when and then
    jQueryMethod(expectedUrl, method, firstRequestData, expectedFirstResponseData, done);

    // when and then
    jQueryMethod(expectedUrl, method, secondRequestData, expectedSecondResponseData, done);
  },

//
//
// jQuery.ajax()
//
//
  assertJQueryAjaxMocked = function (method, done) {
    assertJQueryMocked(method, done, assertJQueryAjaxCalled);
  },
  assertJQueryAjaxCalled = function (expectedUrl, method, requestData, expectedResponseData, done) {
    $.ajax({
      url: expectedUrl,
      type: method,
      data: requestData,
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        assertResponseIsSuccess(textStatus, jqXHR);
        assertResponseData(jqXHR, expectedResponseData, data);
        done();
      }
    });
  },
//
//
// jQuery.get()
//
//
  assertJQueryGetMocked = function (done) {
    assertJQueryMocked('GET', done, assertJQueryGetCalled);
  },
  assertJQueryGetCalled = function (expectedUrl, method, requestData, expectedResponseData, done) {
    $.get(expectedUrl, requestData, function (data, textStatus, jqXHR) {
      assertResponseIsSuccess(textStatus, jqXHR);
      assertResponseData(jqXHR, expectedResponseData, data);
      done();
    }, 'json');
  },
//
//
// jQuery.getJSON()
//
//
  assertJQueryGetJSONMocked = function (done) {
    assertJQueryMocked('GET', done, assertJQueryGetJSONCalled);
  },
  assertJQueryGetJSONCalled = function (expectedUrl, method, requestData, expectedResponseData, done) {
    $.getJSON(expectedUrl, requestData, function (data, textStatus, jqXHR) {
      assertResponseIsSuccess(textStatus, jqXHR);
      assertResponseData(jqXHR, expectedResponseData, data);
      done();
    });
  };

beforeEach(function(){
  locomocko.shouldMock('jQuery');
});

afterEach(function(){
  locomocko.reset();
});

describe('locomocko', function () {

  describe('jQuery.ajax() happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.ajax() GET as expected', function (done) {
        assertJQueryAjaxMocked('GET', done);
      });

      it('mocks jQuery.ajax() POST as expected', function (done) {
        assertJQueryAjaxMocked('POST', done);
      });

      it('mocks jQuery.ajax() PUT as expected', function (done) {
        assertJQueryAjaxMocked('PUT', done);
      });

      it('mocks jQuery.ajax() DELETE as expected', function (done) {
        assertJQueryAjaxMocked('DELETE', done);
      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithoutData(assertJQueryAjaxCalled, done);
      });

      it('uses the last mock setup when called multiple times for the same GET URL with data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithData(assertJQueryAjaxCalled, done);
      });

      it('mocks jQuery.ajax() for the same GET URL but with different request payloads as expected', function (done) {
        assertJQueryMethodMockedForSameUrlWithMultipleRequestData('GET', assertJQueryAjaxCalled, done);
      });

      it('separately mocks jQuery.ajax() GET, POST, PUT and DELETE on the same URL as expected', function (done) {
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

        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedGetResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('POST').thenRespond(expectedPostResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('PUT').thenRespond(expectedPutResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('DELETE').thenRespond(expectedDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', null, expectedGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'POST', null, expectedPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'PUT', null, expectedPutResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'DELETE', null, expectedDeleteResponseData, done);
      });

      it('mocks jQuery.ajax() for a mixture of methods and URL as expected', function (done) {
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

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').thenRespond(expectedFirstUrlDeleteResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('POST').thenRespond(expectedSecondUrlPostResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').thenRespond(expectedThirdUrlPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'GET', null, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'DELETE', null, expectedFirstUrlDeleteResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedSecondUrl, 'POST', null, expectedSecondUrlPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedThirdUrl, 'PUT', null, expectedThirdUrlPutResponseData, done);
      });
    });
  });

  describe('jQuery.get() happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.get() as expected', function (done) {
        assertJQueryGetMocked(done);
      });
    });

    describe('combinations', function () {
      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithoutData(assertJQueryGetCalled, done);
      });

      it('uses the last mock setup when called multiple times for the same GET URL with data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithData(assertJQueryGetCalled, done);
      });

      it('mocks jQuery.get() for the same GET URL but with different request payloads as expected', function (done) {
        assertJQueryMethodMockedForSameUrlWithMultipleRequestData('GET', assertJQueryGetCalled, done);
      });

      it('mocks jQuery.get() for multiple URLs as expected', function (done) {
        assertJQueryMethodMockedForMultipleUrls(assertJQueryGetCalled, done);
      });
    });
  });

  describe('jQuery.getJSON() happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.getJSON() as expected', function (done) {
        assertJQueryGetJSONMocked(done);
      });
    });

    describe('combinations', function () {
      it('uses the last mock setup when called multiple times for the same GET URL without data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithoutData(assertJQueryGetJSONCalled, done);
      });

      it('uses the last jQuery.getJSON() mock setup when called multiple times for the same GET URL with data', function (done) {
        assertJQueryMethodMockedWhenMockCalledMultipleTimesWithData(assertJQueryGetJSONCalled, done);
      });

      it('mocks jQuery.getJSON() for the same GET URL but with different request payloads as expected', function (done) {
        assertJQueryMethodMockedForSameUrlWithMultipleRequestData('GET', assertJQueryGetJSONCalled, done);
      });

      it('mocks jQuery.getJSON() for multiple URLs as expected', function (done) {
        assertJQueryMethodMockedForMultipleUrls(assertJQueryGetJSONCalled, done);
      });
    });
  });
});
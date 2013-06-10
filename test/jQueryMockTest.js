/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

var assertResponseIsSuccess = function (textStatus, jqXHR) {
    textStatus.should.equal('success');
    _.isObject(jqXHR).should.be.true;
    jqXHR.readyState.should.equal(4);
    jqXHR.status.should.equal(200);
    jqXHR.statusText.should.equal('OK');
  },
  assertResponseData = function (jqXHR, expectedResponseData, actualResponseData) {
    jqXHR.responseText.should.equal(JSON.stringify(expectedResponseData));

    actualResponseData.should.equal(expectedResponseData);
  },
  assertJQueryMocked = function (method, done, whenAndThen) {
    // given
    var expectedUrl = 'someUrl',
      expectedResponseData = {
        "someResponseDataKey": "someResponseDataValue"
      };

    locomocko.shouldMock('jQuery');
    locomocko.whenUrl(expectedUrl).withMethod(method).thenRespond(expectedResponseData);

    // when and then
    whenAndThen(expectedUrl, method, expectedResponseData, done);
  },
  assertJQueryAjaxMocked = function (method, done) {
    assertJQueryMocked(method, done, assertJQueryAjaxCalled);
  },
  assertJQueryAjaxCalled = function (expectedUrl, method, expectedResponseData, done) {
    $.ajax({
      url: expectedUrl,
      type: method,
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        assertResponseIsSuccess(textStatus, jqXHR);
        assertResponseData(jqXHR, expectedResponseData, data);
        done();
      }
    });
  },
  assertJQueryGetMocked = function (done) {
    assertJQueryMocked('GET', done, assertJQueryGetCalled);
  },
  assertJQueryGetCalled = function (expectedUrl, method, expectedResponseData, done) {
    $.get(expectedUrl, function (data, textStatus, jqXHR) {
      assertResponseIsSuccess(textStatus, jqXHR);
      assertResponseData(jqXHR, expectedResponseData, data);
      done();
    }, 'json');
  },
  assertJQueryGetJSONMocked = function (done) {
    assertJQueryMocked('GET', done, assertJQueryGetJSONCalled);
  },
  assertJQueryGetJSONCalled = function (expectedUrl, method, expectedResponseData, done) {
    $.getJSON(expectedUrl, function (data, textStatus, jqXHR) {
      assertResponseIsSuccess(textStatus, jqXHR);
      assertResponseData(jqXHR, expectedResponseData, data);
      done();
    });
  };

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

      it('uses the last mock setup when called multiple times for the same GET URL', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedGetResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', expectedGetResponseData, done);
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

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedGetResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('POST').thenRespond(expectedPostResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('PUT').thenRespond(expectedPutResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('DELETE').thenRespond(expectedDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', expectedGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'POST', expectedPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'PUT', expectedPutResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'DELETE', expectedDeleteResponseData, done);
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

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').thenRespond(expectedFirstUrlDeleteResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('POST').thenRespond(expectedSecondUrlPostResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').thenRespond(expectedThirdUrlPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'GET', expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'DELETE', expectedFirstUrlDeleteResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedSecondUrl, 'POST', expectedSecondUrlPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedThirdUrl, 'PUT', expectedThirdUrlPutResponseData, done);
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
      it('uses the last mock setup when called multiple times for the same GET URL', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedGetResponseData);

        // when and then
        assertJQueryGetCalled(expectedUrl, null, expectedGetResponseData, done);
      });

      it('mocks jQuery.get() for multiple URL as expected', function (done) {
        // given
        var expectedFirstUrl = 'firstUrl',
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

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('GET').thenRespond(expectedSecondUrlGetResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('GET').thenRespond(expectedThirdUrlGetResponseData);

        // when and then
        assertJQueryGetCalled(expectedFirstUrl, null, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedSecondUrl, null, expectedSecondUrlGetResponseData, done);

        // when and then
        assertJQueryGetCalled(expectedThirdUrl, null, expectedThirdUrlGetResponseData, done);
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
      it('uses the last mock setup when called multiple times for the same GET URL', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').thenRespond(expectedGetResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedUrl, null, expectedGetResponseData, done);
      });

      it('mocks jQuery.get() for multiple URL as expected', function (done) {
        // given
        var expectedFirstUrl = 'firstUrl',
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

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('GET').thenRespond(expectedSecondUrlGetResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('GET').thenRespond(expectedThirdUrlGetResponseData);

        // when and then
        assertJQueryGetJSONCalled(expectedFirstUrl, null, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryGetJSONCalled(expectedSecondUrl, null, expectedSecondUrlGetResponseData, done);

        // when and then
        assertJQueryGetJSONCalled(expectedThirdUrl, null, expectedThirdUrlGetResponseData, done);
      });
    });
  });
});
/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

var whenJqueryAjaxIsCalled = function (url, method, data, callback) {
    $.ajax({
      url: url,
      method: method,
      dataType: 'json',
      data: data,
      success: function (data, textStatus, jqXHR) {
        callback(textStatus, jqXHR, data);
      }
    });
  },
  assertResponseIsSuccess = function (textStatus, jqXHR) {
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
  assertJQueryAjaxIsMockedForGivenMethod = function (method, done) {

    // given
    var expectedUrl = 'someUrl',
      expectedRequestData = {"someRequestDataKey": "someRequestDataValue"},
      expectedResponseData = {
        "someResponseDataKey": "someResponseDataValue"
      };

    locomocko.shouldMock('jQuery');
    locomocko.whenUrl(expectedUrl).withMethod(method).withData(expectedRequestData).thenRespond(expectedResponseData);

    // when and then
    assertJQueryAjaxCalled(expectedUrl, method, expectedRequestData, expectedResponseData, done);
  },
  assertJQueryAjaxCalled = function (expectedFirstUrl, method, expectedFirstUrlGetRequestData, expectedFirstUrlGetResponseData, done) {
    whenJqueryAjaxIsCalled(expectedFirstUrl, method, expectedFirstUrlGetRequestData,
      function (textStatus, jqXHR, data) {
        assertResponseIsSuccess(textStatus, jqXHR);
        assertResponseData(jqXHR, expectedFirstUrlGetResponseData, data);
        done();
      }
    );
  };

describe('locomocko', function () {

  describe('happy paths', function () {
    describe('single calls', function () {
      it('mocks jQuery.ajax() GET as expected', function (done) {
        assertJQueryAjaxIsMockedForGivenMethod('GET', done);
      });

      it('mocks jQuery.ajax() POST as expected', function (done) {
        assertJQueryAjaxIsMockedForGivenMethod('POST', done);
      });

      it('mocks jQuery.ajax() PUT as expected', function (done) {
        assertJQueryAjaxIsMockedForGivenMethod('PUT', done);
      });

      it('mocks jQuery.ajax() DELETE as expected', function (done) {
        assertJQueryAjaxIsMockedForGivenMethod('DELETE', done);
      });
    });

    describe('combinations', function () {

      it('uses the last mock setup when called multiple times for the same GET URL', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetRequestData = {"lastRequestDataKey": "lastRequestDataValue"},
          expectedGetResponseData = {
            "lastResponseDataKey": "lastResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').withData({"notExpectedRequestKey": "notExpectedRequestValue"}).thenRespond({"notExpectedResponseKey": "notExpectedResponseValue"});
        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(expectedGetRequestData).thenRespond(expectedGetResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', expectedGetRequestData, expectedGetResponseData, done);
      });

      it('separately mocks jQuery.ajax() GET, POST, PUT and DELETE on the same URL as expected', function (done) {
        // given
        var expectedUrl = 'someUrl',
          expectedGetRequestData = {"someGetRequestDataKey": "someGetRequestDataValue"},
          expectedGetResponseData = {
            "someGetResponseDataKey": "someGetResponseDataValue"
          },
          expectedPostRequestData = {"somePostRequestDataKey": "somePostRequestDataValue"},
          expectedPostResponseData = {
            "somePostResponseDataKey": "somePostResponseDataValue"
          },
          expectedPutRequestData = {"somePutRequestDataKey": "somePutRequestDataValue"},
          expectedPutResponseData = {
            "somePutResponseDataKey": "somePutResponseDataValue"
          },
          expectedDeleteRequestData = {"someDeleteRequestDataKey": "someDeleteRequestDataValue"},
          expectedDeleteResponseData = {
            "someDeleteResponseDataKey": "someDeleteResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedUrl).withMethod('GET').withData(expectedGetRequestData).thenRespond(expectedGetResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('POST').withData(expectedPostRequestData).thenRespond(expectedPostResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('PUT').withData(expectedPutRequestData).thenRespond(expectedPutResponseData);
        locomocko.whenUrl(expectedUrl).withMethod('DELETE').withData(expectedDeleteRequestData).thenRespond(expectedDeleteResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'GET', expectedGetRequestData, expectedGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'POST', expectedPostRequestData, expectedPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'PUT', expectedPutRequestData, expectedPutResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedUrl, 'DELETE', expectedDeleteRequestData, expectedDeleteResponseData, done);
      });

      it('mocks jQuery.ajax() for a mixture of methods and URL as expected', function (done) {
        // given
        var expectedFirstUrl = 'firstUrl',
          expectedFirstUrlGetRequestData = {"firstUrlGetRequestDataKey": "firstUrlGetRequestDataValue"},
          expectedFirstUrlGetResponseData = {
            "firstUrlGetResponseDataKey": "firstUrlGetResponseDataValue"
          },
          expectedFirstUrlDeleteRequestData = {"firstUrlDeleteRequestDataKey": "firstUrlDeleteRequestDataValue"},
          expectedFirstUrlDeleteResponseData = {
            "firstUrlDeleteResponseDataKey": "firstUrlDeleteResponseDataValue"
          },
          expectedSecondUrl = 'secondUrl',
          expectedSecondUrlPostRequestData = {"secondUrlPostRequestDataKey": "secondUrlPostRequestDataValue"},
          expectedSecondUrlPostResponseData = {
            "secondUrlPostResponseDataKey": "secondUrlPostResponseDataValue"
          },
          expectedThirdUrl = 'thirdUrl',
          expectedThirdUrlPutRequestData = {"thirdUrlPutRequestDataKey": "thirdUrlPutRequestDataValue"},
          expectedThirdUrlPutResponseData = {
            "thirdUrlPutResponseDataKey": "thirdUrlPutResponseDataValue"
          };

        locomocko.shouldMock('jQuery');

        locomocko.whenUrl(expectedFirstUrl).withMethod('GET').withData(expectedFirstUrlGetRequestData).thenRespond(expectedFirstUrlGetResponseData);
        locomocko.whenUrl(expectedFirstUrl).withMethod('DELETE').withData(expectedFirstUrlDeleteRequestData).thenRespond(expectedFirstUrlDeleteResponseData);
        locomocko.whenUrl(expectedSecondUrl).withMethod('POST').withData(expectedSecondUrlPostRequestData).thenRespond(expectedSecondUrlPostResponseData);
        locomocko.whenUrl(expectedThirdUrl).withMethod('PUT').withData(expectedThirdUrlPutRequestData).thenRespond(expectedThirdUrlPutResponseData);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'GET', expectedFirstUrlGetRequestData, expectedFirstUrlGetResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedFirstUrl, 'DELETE', expectedFirstUrlDeleteRequestData, expectedFirstUrlDeleteResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedSecondUrl, 'POST', expectedSecondUrlPostRequestData, expectedSecondUrlPostResponseData, done);

        // when and then
        assertJQueryAjaxCalled(expectedThirdUrl, 'PUT', expectedThirdUrlPutRequestData, expectedThirdUrlPutResponseData, done);
      });
    });
  });
});
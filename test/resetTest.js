/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('locomocko', function () {

  beforeEach(function () {
    locomocko.reset();
  });

  it('stops mocking $.ajax() on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      callCount = 0;

    $.ajax = function () {
      callCount++;
    };

    locomocko.shouldMock('jQuery');

    locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData({});

    $.ajax({
      url: url,
      type: method,
      success: function () {
      }
    });

    locomocko.reset();

    //when
    $.ajax();

    //then
    callCount.should.equal(1);

  });

  it('removes all mocked endpoints on $.ajax() on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      requestData = {},
      errorMessage = 'endpoint test has failed!';

    $.ajax = function () {
      // fail if this function is ever called
      false.should.be.true;
    };

    locomocko.shouldMock('jQuery');

    locomocko.whenUrl(url).withMethod(method).withData(requestData).thenRespond().withData({});

    locomocko.reset();

    locomocko.shouldMock('jQuery');

    try {
      //when
      $.ajax({
        url: url,
        type: method,
        data: requestData,
        success: function () {
          // fail if execution comes to this point
          throw new Error(errorMessage);
        }
      });
    } catch (e) {
      e.message.should.not.equal(errorMessage);
    }

  });

  it('does not modify angular.$http() on jQuery mock reset()', function (done) {
    var expectedAngularHttp = 'ANGULAR HTTP FUNCTION';
    //given
    //prepare angular
    angular.module('ng', [], function ($provide) {
      $provide.provider('$http', {
        $get: function () {
          return  expectedAngularHttp;
        }
      });
    });

    locomocko.shouldMock('jQuery');

    //when
    locomocko.reset();

    //then
    angular.injector(['ng']).invoke(function ($http) {
      $http.should.equal(expectedAngularHttp);

      done();
    });

  });

  it('stops mocking angular.$http() on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      callCount = 0;

    angular.module('ng', [], function ($provide) {
      $provide.provider('$http', {
        $get: function () {
          return function () {
            return {
              success: function (onSuccess) {
                callCount++;
                onSuccess();
                return this;
              },

              error: function (onError) {
                return this;
              }
            }
          }
        }
      });
    });

    locomocko.shouldMock('angular');

    locomocko.whenUrl(url).withMethod(method).withAnyData().thenRespond().withData({});

    angular.injector(['ng']).invoke(function ($http) {
      $http({
        url: url,
        method: method
      }).
        success(function () {
        }).
        error(function () {
        });
    });

    locomocko.reset();

    //when
    angular.injector(['ng']).invoke(function ($http) {
      $http({
        url: url,
        method: method
      }).
        success(function () {
        }).
        error(function () {
        });
    });

    //then
    callCount.should.equal(1);

  });

  it('removes all mocked endpoints on angular.$http() on reset()', function () {
    //given
    var url = 'someUrl',
      method = 'GET',
      requestData = {},
      errorMessage = 'endpoint test has failed!';

    angular.module('ng', [], function ($provide) {
      $provide.provider('$http', {
        $get: function () {
          // fail if this function is ever called
          false.should.be.true;
        }
      });
    });

    locomocko.shouldMock('angular');

    locomocko.whenUrl(url).withMethod(method).withData(requestData).thenRespond().withData({});

    locomocko.reset();

    locomocko.shouldMock('angular');

    try {
      //when
      angular.injector(['ng']).invoke(function ($http) {
        $http({
          url: url,
          method: method,
          data: requestData
        }).
          success(function () {
            throw new Error(errorMessage);
          }).
          error(function () {
            throw new Error(errorMessage);
          });
      });

      // fail if execution comes to this point
      false.should.be.true;
    } catch (e) {
      e.message.should.not.equal(errorMessage);
    }

  });

  it('does not modify jQuery.ajax() on angular mock reset()', function () {
    var expectedJqueryAjax = 'JQUERY AJAX FUNCTION';
    //given
    //prepare jQuery
    $.ajax = expectedJqueryAjax;

    locomocko.shouldMock('angular');

    //when
    locomocko.reset();

    //then
    $.ajax.should.equal(expectedJqueryAjax);

  });
});
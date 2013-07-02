/**
 * This file is part of the locomocko.js application code.
 *
 * (c) Dogan Narinc <tepafoo@gmail.com>
 *
 * For the full copyright and license information, please view
 * the LICENSE file that was distributed with this source code.
 */

describe('locomocko HTTP status test', function () {


  var mockAndAssertOnSuccess = function (expectedCode, expectedText) {
    locomocko.whenUrl('someUrl').withMethod('GET').withAnyData().withAnyHeaders().thenRespond().withStatusCode(expectedCode);

    $.getJSON('someUrl', function (data, textStatus, jqXHR) {
      jqXHR.status.should.equal(expectedCode);
      jqXHR.statusText.should.equal(expectedText);
    });
  };

  beforeEach(function () {
    locomocko.shouldMockJQuery();
  });

  afterEach(function () {
    locomocko.reset();
  });

  it('Returns expected HTTP status text on status code 100', function () {
    mockAndAssertOnSuccess(100, 'Continue');
  });

  it('Returns expected HTTP status text on status code 100', function () {
    mockAndAssertOnSuccess(101, 'Switching Protocols');
  });

  it('Returns expected HTTP status text on status code 102', function () {
    mockAndAssertOnSuccess(102, 'Processing');
  });

  it('Returns expected HTTP status text on status code 200', function () {
    mockAndAssertOnSuccess(200, 'OK');
  });

  it('Returns expected HTTP status text on status code 201', function () {
    mockAndAssertOnSuccess(201, 'Created');
  });

  it('Returns expected HTTP status text on status code 202', function () {
    mockAndAssertOnSuccess(202, 'Accepted');
  });

  it('Returns expected HTTP status text on status code 203', function () {
    mockAndAssertOnSuccess(203, 'Non-Authoritative Information');
  });

  it('Returns expected HTTP status text on status code 204', function () {
    mockAndAssertOnSuccess(204, 'No Content');
  });

  it('Returns expected HTTP status text on status code 205', function () {
    mockAndAssertOnSuccess(205, 'Reset Content');
  });

  it('Returns expected HTTP status text on status code 206', function () {
    mockAndAssertOnSuccess(206, 'Partial Content');
  });

  it('Returns expected HTTP status text on status code 207', function () {
    mockAndAssertOnSuccess(207, 'Multi-Status');
  });

  it('Returns expected HTTP status text on status code 208', function () {
    mockAndAssertOnSuccess(208, 'Already Reported');
  });

  it('Returns expected HTTP status text on status code 226', function () {
    mockAndAssertOnSuccess(226, 'IM Used');
  });

  it('Returns expected HTTP status text on status code 300', function () {
    mockAndAssertOnSuccess(300, 'Multiple Choices');
  });

  it('Returns expected HTTP status text on status code 301', function () {
    mockAndAssertOnSuccess(301, 'Moved Permanently');
  });

  it('Returns expected HTTP status text on status code 302', function () {
    mockAndAssertOnSuccess(302, 'Found');
  });

  it('Returns expected HTTP status text on status code 303', function () {
    mockAndAssertOnSuccess(303, 'See Other');
  });

  it('Returns expected HTTP status text on status code 304', function () {
    mockAndAssertOnSuccess(304, 'Not Modified');
  });

  it('Returns expected HTTP status text on status code 305', function () {
    mockAndAssertOnSuccess(305, 'Use Proxy');
  });

  it('Returns expected HTTP status text on status code 306', function () {
    mockAndAssertOnSuccess(306, 'Switch Proxy');
  });

  it('Returns expected HTTP status text on status code 307', function () {
    mockAndAssertOnSuccess(307, 'Temporary Redirect');
  });

  it('Returns expected HTTP status text on status code 308', function () {
    mockAndAssertOnSuccess(308, 'Permanent Redirect');
  });

  it('Returns expected HTTP status text on status code 400', function () {
    mockAndAssertOnSuccess(400, 'Bad Request');
  });

  it('Returns expected HTTP status text on status code 401', function () {
    mockAndAssertOnSuccess(401, 'Unauthorized');
  });

  it('Returns expected HTTP status text on status code 402', function () {
    mockAndAssertOnSuccess(402, 'Payment Required');
  });

  it('Returns expected HTTP status text on status code 403', function () {
    mockAndAssertOnSuccess(403, 'Forbidden');
  });

  it('Returns expected HTTP status text on status code 404', function () {
    mockAndAssertOnSuccess(404, 'Not Found');
  });

  it('Returns expected HTTP status text on status code 405', function () {
    mockAndAssertOnSuccess(405, 'Method Not Allowed');
  });

  it('Returns expected HTTP status text on status code 406', function () {
    mockAndAssertOnSuccess(406, 'Not Acceptable');
  });

  it('Returns expected HTTP status text on status code 407', function () {
    mockAndAssertOnSuccess(407, 'Proxy Authentication Required');
  });

  it('Returns expected HTTP status text on status code 408', function () {
    mockAndAssertOnSuccess(408, 'Request Timeout');
  });

  it('Returns expected HTTP status text on status code 409', function () {
    mockAndAssertOnSuccess(409, 'Conflict');
  });

  it('Returns expected HTTP status text on status code 410', function () {
    mockAndAssertOnSuccess(410, 'Gone');
  });

  it('Returns expected HTTP status text on status code 411', function () {
    mockAndAssertOnSuccess(411, 'Length Required');
  });

  it('Returns expected HTTP status text on status code 412', function () {
    mockAndAssertOnSuccess(412, 'Precondition Failed');
  });

  it('Returns expected HTTP status text on status code 413', function () {
    mockAndAssertOnSuccess(413, 'Request Entity Too Large');
  });

  it('Returns expected HTTP status text on status code 414', function () {
    mockAndAssertOnSuccess(414, 'Request-URI Too Long');
  });

  it('Returns expected HTTP status text on status code 415', function () {
    mockAndAssertOnSuccess(415, 'Unsupported Media Type');
  });

  it('Returns expected HTTP status text on status code 416', function () {
    mockAndAssertOnSuccess(416, 'Requested Range Not Satisfiable');
  });

  it('Returns expected HTTP status text on status code 417', function () {
    mockAndAssertOnSuccess(417, 'Expectation Failed');
  });

  it('Returns expected HTTP status text on status code 418', function () {
    mockAndAssertOnSuccess(418, "I'm a teapot");
  });

  it('Returns expected HTTP status text on status code 419', function () {
    mockAndAssertOnSuccess(419, 'Authentication Timeout');
  });

  it('Returns expected HTTP status text on status code 422', function () {
    mockAndAssertOnSuccess(422, 'Unprocessable Entity');
  });

  it('Returns expected HTTP status text on status code 423', function () {
    mockAndAssertOnSuccess(423, 'Locked');
  });

  it('Returns expected HTTP status text on status code 424', function () {
    mockAndAssertOnSuccess(424, 'Failed Dependency');
  });

  it('Returns expected HTTP status text on status code 425', function () {
    mockAndAssertOnSuccess(425, 'Unordered Collection');
  });

  it('Returns expected HTTP status text on status code 426', function () {
    mockAndAssertOnSuccess(426, 'Upgrade Required');
  });

  it('Returns expected HTTP status text on status code 428', function () {
    mockAndAssertOnSuccess(428, 'Precondition Required');
  });

  it('Returns expected HTTP status text on status code 429', function () {
    mockAndAssertOnSuccess(429, 'Too Many Requests');
  });

  it('Returns expected HTTP status text on status code 431', function () {
    mockAndAssertOnSuccess(431, 'Request Header Fields Too');
  });

  it('Returns expected HTTP status text on status code 451', function () {
    mockAndAssertOnSuccess(451, 'Unavailable For Legal Reasons');
  });

  it('Returns expected HTTP status text on status code 500', function () {
    mockAndAssertOnSuccess(500, 'Internal Server Error');
  });

  it('Returns expected HTTP status text on status code 501', function () {
    mockAndAssertOnSuccess(501, 'Not Implemented');
  });

  it('Returns expected HTTP status text on status code 502', function () {
    mockAndAssertOnSuccess(502, 'Bad Gateway');
  });

  it('Returns expected HTTP status text on status code 503', function () {
    mockAndAssertOnSuccess(503, 'Service Unavailable');
  });

  it('Returns expected HTTP status text on status code 504', function () {
    mockAndAssertOnSuccess(504, 'Gateway Timeout');
  });

  it('Returns expected HTTP status text on status code 505', function () {
    mockAndAssertOnSuccess(505, 'HTTP Version Not Supported');
  });

  it('Returns expected HTTP status text on status code 506', function () {
    mockAndAssertOnSuccess(506, 'Variant Also Negotiates');
  });

  it('Returns expected HTTP status text on status code 507', function () {
    mockAndAssertOnSuccess(507, 'Insufficient Storage');
  });

  it('Returns expected HTTP status text on status code 508', function () {
    mockAndAssertOnSuccess(508, 'Loop Detected');
  });

  it('Returns expected HTTP status text on status code 510', function () {
    mockAndAssertOnSuccess(510, 'Not Extended');
  });

  it('Returns expected HTTP status text on status code 511', function () {
    mockAndAssertOnSuccess(511, 'Network Authentication Required');
  });

});

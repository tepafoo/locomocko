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

  afterEach(function () {
    locomocko.reset();
  });

  it('should not throw an error on shouldMockJQuery() with jQuery', function () {
    locomocko.shouldMockJQuery();
  });

  it('should not throw an error on shouldMockAngular() with angular', function () {
    locomocko.shouldMockAngular('mockModule');
  });
});
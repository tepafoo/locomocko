'use strict';

locomocko.shouldMockJQuery();
locomocko.whenUrl('phones/phones.json').withMethod('GET').thenRespond().withData([
  {
    "age": 0,
    "id": "motorola-xoom-with-wi-fi",
    "imageUrl": "img/phones/motorola-xoom-with-wi-fi.0.jpg",
    "name": "Motorola XOOM\u2122 with Wi-Fi",
    "snippet": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  },
  {
    "age": 1,
    "id": "motorola-xoom",
    "imageUrl": "img/phones/motorola-xoom.0.jpg",
    "name": "MOTOROLA XOOM\u2122",
    "snippet": "BBBBBBBBBBBBBBBBBBBBBBBBBBBB"
  }
]);
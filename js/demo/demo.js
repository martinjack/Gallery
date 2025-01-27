/*
 * blueimp Gallery Demo JS
 * https://github.com/blueimp/Gallery
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global blueimp, $ */

$(function () {
  'use strict'

  // Load demo images from flickr:
  $.ajax({
    url: 'https://api.flickr.com/services/rest/',
    data: {
      format: 'json',
      method: 'flickr.interestingness.getList',
      // eslint-disable-next-line camelcase
      api_key: '7617adae70159d09ba78cfec73c13be3'
    },
    dataType: 'jsonp',
    jsonp: 'jsoncallback'
  }).done(function (result) {
    var carouselLinks = []
    var linksContainer = $('#links')
    var baseUrl
    // Add the demo images as links with thumbnails to the page:
    $.each(result.photos.photo, function (index, photo) {
      baseUrl =
        'https://farm' +
        photo.farm +
        '.static.flickr.com/' +
        photo.server +
        '/' +
        photo.id +
        '_' +
        photo.secret
      $('<a/>')
        .append($('<img>').prop('src', baseUrl + '_s.jpg'))
        .prop('href', baseUrl + '_b.jpg')
        .prop('title', photo.title)
        .attr('data-gallery', '')
        .appendTo(linksContainer)
      carouselLinks.push({
        href: baseUrl + '_c.jpg',
        title: photo.title
      })
    })
    // Initialize the Gallery as image carousel:
    // eslint-disable-next-line new-cap
    blueimp.Gallery(carouselLinks, {
      container: '#blueimp-image-carousel',
      carousel: true
    })
  })

  // Initialize the Gallery as video carousel:
  // eslint-disable-next-line new-cap
  blueimp.Gallery(
    [
      {
        title: 'Sintel',
        href: 'https://archive.org/download/Sintel/sintel-2048-surround.mp4',
        type: 'video/mp4',
        poster: 'https://i.imgur.com/MUSw4Zu.jpg'
      },
      {
        title: 'Big Buck Bunny',
        href:
          'https://upload.wikimedia.org/wikipedia/commons/c/c0/' +
          'Big_Buck_Bunny_4K.webm',
        type: 'video/webm',
        poster:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/' +
          'Big_Buck_Bunny_4K.webm/4000px--Big_Buck_Bunny_4K.webm.jpg'
      },
      {
        title: 'Elephants Dream',
        href:
          'https://upload.wikimedia.org/wikipedia/commons/8/83/' +
          'Elephants_Dream_%28high_quality%29.ogv',
        type: 'video/ogg',
        poster:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/' +
          'Elephants_Dream_s1_proog.jpg/800px-Elephants_Dream_s1_proog.jpg'
      },
      {
        title: 'LES TWINS - An Industry Ahead',
        type: 'text/html',
        youtube: 'zi4CIXpx7Bg'
      },
      {
        title: 'KN1GHT - Last Moon',
        type: 'text/html',
        vimeo: '73686146',
        poster: 'https://secure-a.vimeocdn.com/ts/448/835/448835699_960.jpg'
      },
      {
        title: 'Audio',
        type: 'audio/mp3',
        href: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3',
        poster: 'https://helpdeskgeek.com/wp-content/pictures/2012/06/audio-not-working.jpeg'
      }
    ],
    {
      container: '#blueimp-video-carousel',
      carousel: true
    }
  )
})

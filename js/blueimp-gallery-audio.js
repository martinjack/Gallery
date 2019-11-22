/*
 * blueimp Gallery Audio Factory JS
 * https://github.com/blueimp/Gallery
 * https://github.com/martinjack/Gallery
 *
 * Copyright 2019, Sebastian Tschan, Evgen Kytonin 
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define */

; (function (factory) {

    'use strict'

    if (typeof define === 'function' && define.amd) {

        // Register as an anonymous AMD module:
        define(['./blueimp-helper', './blueimp-gallery'], factory);

    } else {

        // Browser globals:
        factory(window.blueimp.helper || window.jQuery, window.blueimp.Gallery);

    }

})(function ($, Gallery) {

    'use strict'

    $.extend(Gallery.prototype.options, {

        // The class for audio content elements:
        audioContentClass: 'audio-content',
        // The class for audio when it is loading:
        audioLoadingClass: 'audio-loading',
        // The class for audio when it is playing:
        audioPlayingClass: 'audio-playing',
        // The list object property (or data attribute) for the audio poster URL:
        audioPosterProperty: 'poster',
        // The list object property (or data attribute) for the audio sources array:
        audioSourcesProperty: 'sources',
        // Hidden player, when pause
        audioHidePlayer: true,
        // Show slide controls, when pause
        audioShowSlideWhenPause: true,
        // Title icon stopMediaControl
        stopMediaControlTitle: 'Stop play'

    });

    var handleSlide = Gallery.prototype.handleSlide;

    $.extend(Gallery.prototype, {

        handleSlide: function (index) {

            handleSlide.call(this, index);

            if (this.playingAudio) {

                this.playingAudio.pause();

            }

        },

        audioFactory: function (obj, callback, audioInterface) {
            var that = this;
            var options = this.options;
            var audioContainerNode = this.elementPrototype.cloneNode(false);
            var audioContainer = $(audioContainerNode);
            var errorArgs = [
                {
                    type: 'error',
                    target: audioContainerNode
                }
            ];
            var audio = audioInterface || document.createElement('audio');
            var url = this.getItemProperty(obj, options.urlProperty);
            var type = this.getItemProperty(obj, options.typeProperty);
            var title = this.getItemProperty(obj, options.titleProperty);
            var altText =
                this.getItemProperty(obj, this.options.altTextProperty) || title;
            var posterUrl = this.getItemProperty(obj, options.audioPosterProperty);
            var posterImage
            var sources = this.getItemProperty(obj, options.audioSourcesProperty);
            var source
            var playMediaControl
            var stopMediaControl
            var isLoading
            var hasControls

            audioContainer.addClass(options.audioContentClass);

            if (title) {

                audioContainerNode.title = title;

            }

            if (audio.canPlayType) {

                if (url && type && audio.canPlayType(type)) {

                    audio.src = url;

                } else if (sources) {

                    while (sources.length) {

                        source = sources.shift();

                        url = this.getItemProperty(source, options.urlProperty);

                        type = this.getItemProperty(source, options.typeProperty);

                        if (url && type && audio.canPlayType(type)) {

                            audio.src = url;

                            break;

                        }

                    }

                }

            }

            if (posterUrl) {

                audio.poster = posterUrl;

                posterImage = this.imagePrototype.cloneNode(false);

                $(posterImage).addClass(options.toggleClass);

                posterImage.src = posterUrl;

                posterImage.draggable = false;

                posterImage.alt = altText;

                audioContainerNode.appendChild(posterImage);

            }

            playMediaControl = document.createElement('a');

            playMediaControl.setAttribute('target', '_blank');

            if (!audioInterface) {

                playMediaControl.setAttribute('download', title);

            }

            playMediaControl.href = url;

            stopMediaControl = document.createElement('span');

            if (that.options.stopMediaControlTitle) {

                stopMediaControl.setAttribute('title', that.options.stopMediaControlTitle);

            }

            stopMediaControl.style.display = 'none';

            if (audio.src) {

                audio.controls = true;

                ; (audioInterface || $(audio))
                    .on('error', function () {

                        that.setTimeout(callback, errorArgs);

                    })
                    .on('pause', function () {

                        if (audio.seeking) return;

                        isLoading = false;

                        audioContainer.removeClass(that.options.audioLoadingClass);

                        if (that.options.audioHidePlayer) {

                            audioContainer.removeClass(that.options.audioPlayingClass);

                        }

                        if (hasControls && that.options.audioShowSlideWhenPause) {

                            that.container.addClass(that.options.controlsClass);

                        }

                        delete that.playingAudio;

                        if (that.interval) {

                            that.play()

                        }

                    })
                    .on('playing', function () {

                        isLoading = false;

                        audioContainer
                            .removeClass(that.options.audioLoadingClass)
                            .addClass(that.options.audioPlayingClass);

                        if (that.container.hasClass(that.options.controlsClass)) {

                            hasControls = true;

                            that.container.removeClass(that.options.controlsClass);

                        } else {

                            hasControls = false;

                        }

                    })
                    .on('play', function () {

                        window.clearTimeout(that.timeout);

                        isLoading = true;

                        audioContainer.addClass(that.options.audioLoadingClass)

                        that.playingAudio = audio;

                        stopMediaControl.style.display = 'block';

                    })
                    .on('ended', function () {

                        audioContainer
                            .removeClass(that.options.audioLoadingClass)
                            .removeClass(that.options.audioPlayingClass);

                    });

                $(playMediaControl).on('click', function (event) {

                    that.preventDefault(event);

                    if (isLoading) {

                        audio.pause();

                    } else {

                        audio.play();

                    }

                });

                $(stopMediaControl).on('click', function (event) {

                    that.preventDefault(event);

                    audio.pause();
                    audio.currentTime = 0;

                    audioContainer
                        .removeClass(that.options.audioLoadingClass)
                        .removeClass(that.options.audioPlayingClass);

                    that.container.addClass(that.options.controlsClass);

                    stopMediaControl.style.display = 'none';

                });

                audioContainerNode.appendChild(

                    (audioInterface && audioInterface.element) || audio

                );

            }

            audioContainerNode.appendChild(playMediaControl);

            audioContainerNode.appendChild(stopMediaControl);

            this.setTimeout(callback, [

                {

                    type: 'load',

                    target: audioContainerNode

                }

            ]);

            return audioContainerNode;

        }

    });

    return Gallery;

});
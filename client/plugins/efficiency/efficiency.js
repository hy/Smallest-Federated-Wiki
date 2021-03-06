(function() {
  window.plugins.efficiency = {
    emit: function(div, item) {
      div.addClass('data');
      $('<p />').addClass('readout').appendTo(div).text("0%");
      return $('<p />').html(wiki.resolveLinks(item.text || 'efficiency')).appendTo(div);
    },
    bind: function(div, item) {
      var calculate, calculatePercentage, display, getImageData, lastThumb, locate;
      lastThumb = null;
      div.find('p:first').dblclick(function(e) {
        return wiki.dialog("JSON for " + item.text, $('<pre/>').text("something good"));
      });
      div.find('p:last').dblclick(function() {
        return wiki.textEditor(div, item);
      });
      locate = function() {
        var idx;
        idx = $('.item').index(div);
        return $(".item:lt(" + idx + ")").filter('.image:last');
      };
      calculate = function(div) {
        return calculatePercentage(getImageData(div));
      };
      display = function(value) {
        return div.find('p:first').text("" + (value.toFixed(1)) + "%");
      };
      getImageData = function(div) {
        var c, d, h, imageData, img, w;
        img = new Image;
        img.src = $(div).data('item').url;
        w = img.width;
        h = img.height;
        c = $('<canvas id="myCanvas" width="#{w}" height="#{h}">');
        d = c.get(0).getContext("2d");
        d.drawImage(img, 0, 0);
        imageData = d.getImageData(0, 0, w, h);
        return imageData.data;
      };
      calculatePercentage = function(data) {
        var lumas;
        lumas = window.plugins.efficiency.getGrayLumaFromRGBT(data);
        return window.plugins.efficiency.calculateStrategy_GrayBinary(lumas);
      };
      return display(calculate(locate()));
    },
    getGrayLumaFromRGBT: function(rgbt) {
      var B, G, R, i, lumas, numPix, _i, _ref;
      numPix = rgbt.length / 4;
      lumas = [];
      for (i = _i = 0, _ref = numPix - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        R = rgbt[i * 4 + 0];
        G = rgbt[i * 4 + 1];
        B = rgbt[i * 4 + 2];
        lumas[i] = (0.30 * R) + (0.60 * G) + (0.10 * B);
      }
      return lumas;
    },
    calculateStrategy_GrayBinary: function(lumas) {
      var l, lumaHighCount, lumaLowCount, lumaMax, lumaMid, lumaMin, numLumas, percentage, _i, _len;
      lumaMin = Math.min.apply(Math, lumas);
      lumaMax = Math.max.apply(Math, lumas);
      numLumas = lumas.length;
      lumaMid = (lumaMax - lumaMin) / 2.0 + lumaMin;
      lumaLowCount = 0;
      lumaHighCount = 0;
      for (_i = 0, _len = lumas.length; _i < _len; _i++) {
        l = lumas[_i];
        if (l <= lumaMid) {
          lumaLowCount++;
        } else {
          lumaHighCount++;
        }
      }
      percentage = lumaHighCount / numLumas * 100;
      return percentage;
    },
    calculateStrategy_GrayIterativeClustering: function(lumas) {
      var MAX_TRIES, THRESHOLD_CONVERGENCE_GOAL, high, l, low, lumaAvgHigh, lumaAvgLow, lumaHighCount, lumaHighTotal, lumaLowCount, lumaLowTotal, lumaMax, lumaMin, lumasHigh, lumasLow, numLumas, numPix, numTries, percentage, threshold, thresholdDiff, thresholdInitial, _i, _j, _k, _len, _len1, _len2;
      THRESHOLD_CONVERGENCE_GOAL = 5;
      MAX_TRIES = 10;
      lumaMin = Math.min.apply(Math, lumas);
      lumaMax = Math.max.apply(Math, lumas);
      numLumas = lumas.length;
      numPix = numLumas;
      thresholdInitial = (lumaMax - lumaMin) / 2 + lumaMin;
      threshold = thresholdInitial;
      lumaHighCount = 0;
      numTries = 0;
      while (numTries < MAX_TRIES) {
        numTries++;
        lumasLow = [];
        lumasHigh = [];
        lumaLowCount = 0;
        lumaHighCount = 0;
        for (_i = 0, _len = lumas.length; _i < _len; _i++) {
          l = lumas[_i];
          if (l <= threshold) {
            lumasLow.push(l);
            lumaLowCount++;
          } else {
            if (l !== NaN) {
              lumasHigh.push(l);
              lumaHighCount++;
            }
          }
        }
        lumaLowTotal = 0;
        for (_j = 0, _len1 = lumasLow.length; _j < _len1; _j++) {
          low = lumasLow[_j];
          if (!isNaN(low)) {
            lumaLowTotal += low;
          } else {

          }
        }
        lumaAvgLow = 0;
        if (lumaLowCount > 0) {
          lumaAvgLow = lumaLowTotal / lumaLowCount;
        }
        lumaHighTotal = 0;
        for (_k = 0, _len2 = lumasHigh.length; _k < _len2; _k++) {
          high = lumasHigh[_k];
          if (!isNaN(high)) {
            lumaHighTotal += high;
          } else {

          }
        }
        lumaAvgHigh = 0;
        if (lumaHighCount > 0) {
          lumaAvgHigh = lumaHighTotal / lumaHighCount;
        }
        threshold = (lumaAvgHigh - lumaAvgLow) / 2 + lumaAvgLow;
        thresholdDiff = Math.abs(threshold - thresholdInitial);
        if (thresholdDiff <= THRESHOLD_CONVERGENCE_GOAL || numTries > MAX_TRIES) {
          break;
        } else {
          thresholdInitial = threshold;
        }
      }
      percentage = lumaHighCount / numPix * 100;
      if (percentage > 100.0) {
        percentage = 100;
      }
      return percentage;
    }
  };

}).call(this);

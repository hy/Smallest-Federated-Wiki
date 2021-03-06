(function() {
  var calculate;

  window.plugins.calculator = {
    emit: function(div, item) {
      var field, pre, text;
      item.data = (function() {
        var _results;
        _results = [];
        for (field in wiki.getData()) {
          _results.push(field);
        }
        return _results;
      })();
      wiki.log('calculator', item);
      text = calculate(item).join("\n");
      pre = $('<pre style="font-size: 16px;"/>').text(text);
      return div.append(pre);
    },
    bind: function(div, item) {
      return div.dblclick(function() {
        return wiki.textEditor(div, item);
      });
    }
  };

  calculate = function(item) {
    var col, line, sum, _i, _len, _ref, _results;
    sum = 0;
    _ref = item.text.split("\n");
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      col = line.split(/\s+/);
      col[0] = col[0].replace(/^[A-Z]+$/, function(x) {
        var _ref1;
        if (!((item.data[x] != null) && x !== 'SUM')) {
          _ref1 = [sum, 0], item.data[x] = _ref1[0], sum = _ref1[1];
        }
        return item.data[x].toFixed(2);
      });
      col[0] = col[0].replace(/^\-?[0-9\.]+$/, function(x) {
        sum = sum + (function() {
          switch (col[1]) {
            case 'CR':
            case 'DB':
              return x / -1;
            case '*':
              return x * col[2];
            case '/':
              return x / col[2];
            default:
              return x / 1;
          }
        })();
        return (x / 1).toFixed(2);
      });
      if (line.match(/^\s*$/)) {
        sum = 0;
      }
      _results.push(col.join(' '));
    }
    return _results;
  };

}).call(this);

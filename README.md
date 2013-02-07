[jQuery Group Inputs](http://lusever.github.com/groupinputs/)
=============================================================

Easy data input into several inputs.

Inputs begin to behave as if they share data:
- When one input is filled out the cursor moves to the next
- Left/right arrows move cursor to the previous/next input
- Pasting the text will fill out several inputs and cursor will be left in the end of the pasted text as if it was a single input field.

## Example

```html
<script src="jquery-1.7.2.js"></script>
<script src="jquery.groupinputs.js"></script>
<input type="text" maxlength="4" class="group1" name="">
<input type="text" maxlength="4" class="group1" name="">
<input type="text" maxlength="4" class="group1" name="">
<input type="text" maxlength="4" class="group1" name="">
<script>
    $('.group1').groupinputs();
</script>
```

## Recommendation for numbers fields

### Leave only the digits

`keydown` and `keypress` events don't need to add `preventDefault` in order to keep user defined shortcuts. It’s necessary to clean the box after you enter the symbols as follows:

```javascript
$('.group1').on('input propertychange', function(e) {
    var elem = $(e.target),
        value = elem.val(),
        caret = elem.caret(),
        newValue = value.replace(/[^0-9]/g, ''),
        valueDiff = value.length - newValue.length;

    if (valueDiff) {
        elem
            .val(newValue)
            .caret(caret.start - valueDiff, caret.end - valueDiff);
    }
});
```

The example uses a plugin [jCaret](http://www.jquery-plugin.buss.hk/my-plugins/jquery-caret-plugin).

### Show keypad in iOS

Add an attribute `pattern="[0-9]*"`.

```html
<input type="text" maxlength="4" class="group1" name="" pattern="[0-9]*">
```

## Limitations

Does not work in iOS (method `input.focus()` does not work).

## Release History

* 2013-02-07 - v0.8.3 Support for jQuery 1.9.
* 2013-01-18 - v0.8.2 Change UglifyJS to Google Closure Compler.
* 2012-11-15 - v0.8.1 Fixed change cursor on ctrl and command key.
* 2012-11-13 - v0.8 Add onchange event for non first input.

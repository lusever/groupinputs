/**
 * GroupInputs v. 0.7
 * @author Pavel Kornilov <pk@ostrovok.ru> <lusever@lusever.com>
 */
(function($) {

function caret(node, start, end) {
    var range;
    if (start !== undefined) {
        // see https://bugzilla.mozilla.org/show_bug.cgi?id=265159
        node.focus();
        if (node.setSelectionRange) {
            node.setSelectionRange(start, end);
        // IE, "else" for opera 10
        } else if (document.selection && document.selection.createRange) {
            range = node.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    } else {
        start = 0;
        end = 0;
        if ('selectionStart' in node) {
            start = node.selectionStart;
            end = node.selectionEnd;
        } else if (node.createTextRange) {
            range = document.selection.createRange();
            var dup = range.duplicate();

            if (range.parentElement() === node) {
                /* no need code for textarea
                if (node.type === 'text') {
                    start = -dup.moveStart('character', -100000);
                    end = start + range.text.length;
                
                } else { // textarea
                    var rex = /\r/g;
                    dup.moveToElementText(node);
                    dup.setEndPoint('EndToStart', range);
                    start = dup.text.replace(rex, '').length;
                    dup.setEndPoint('EndToEnd', range);
                    end = dup.text.replace(rex, '').length;
                    dup = document.selection.createRange();
                    dup.moveToElementText(node);
                    dup.moveStart('character', start);
                    while (dup.move('character', -dup.compareEndPoints('StartToStart', range))) {
                        start++;
                    }
                    dup.moveStart('character', end - start);
                    while (dup.move('character', -dup.compareEndPoints('StartToEnd', range))) {
                        end++;
                    }
                }
                */
                start = -dup.moveStart('character', -100000);
                end = start + range.text.length;
            }
        }
        return {
            start: start,
            end: end
        };
    }
}

$.fn.groupinputs = function() {
    // iOS does not support input.focus()
    if (/iPad|iPhone/.test(navigator.platform)) {
        return this;
    }

    var inputs = this,
        inputsData = [],
        totalMaxlength = 0;

    function oninputTimeout(elem, options) {
        // for example, inputs value before paste: [|◊ ] [∆∆  ], need paste: øøøø
        // now state: [øøøø|◊] [∆∆  ]

        var firstValue = elem[0].value,
            caretEnd = elem.caret().end, // in webkit start: 2, end: 6
            left = firstValue.slice(0, caretEnd), // øøøø
            right = firstValue.slice(caretEnd), // ◊
            rightFreeSpace = options.maxlength - right.length, // 3
            isSetFocus = false,
            buffer, newCaretStart;

        for (var i = inputs.length - 1; i > options.index; i--) {
            rightFreeSpace += inputs.eq(i).attr('maxlength') - inputs[i].value.length;
        }

        if (left.length > rightFreeSpace) {
            left = left.slice(0, rightFreeSpace); // øøøø.slice(0, 5)
            newCaretStart = rightFreeSpace;
        } else {
            newCaretStart = caretEnd;
        }

        if (firstValue.length > options.maxlength) {
            elem[0].value = (left + right).slice(0, options.maxlength); // [øø] [∆∆  ]

            // caret remains on input
            if (newCaretStart <= options.maxlength) {
                elem.caret(newCaretStart, newCaretStart);
                isSetFocus = true;
            }

            buffer = (left + right).slice(options.maxlength); // øø◊

            if (buffer.length) {
                newCaretStart -= Math.min(options.maxlength, left.length);
                var maxlength, valLength;
                while (inputs[++i]) {
                    maxlength = +inputs.eq(i).attr('maxlength');
                    buffer += inputs[i].value; // øø◊∆∆
                    inputs[i].value = buffer.slice(0, maxlength);
                    if (buffer.length <= maxlength) {
                        break;
                    }
                    valLength = inputs[i].value.length;
                    if (!isSetFocus) {
                        if (newCaretStart < maxlength) {
                            isSetFocus = true;
                            inputs.eq(i).trigger('focus').caret(newCaretStart, newCaretStart);
                        }
                        newCaretStart -= valLength;
                    }
                    buffer = buffer.slice(maxlength);
                }
            }
            if (!isSetFocus) {
                // setTimeout may be necessary for chrome and safari (https://bugs.webkit.org/show_bug.cgi?id=56271)
                inputs.eq(i).trigger('focus').caret(newCaretStart, newCaretStart);
            }
        }
        elem.attr('maxlength', options.maxlength);
    }

    function handler(e) {
        var eventSelector = e.type,
            options = e.data,
            elem = e.data.elem,
            index = options.index,
            caret = elem.caret();

        switch (e.keyCode) {
            case 8 : eventSelector += '.backspace'; break;
            case 37: eventSelector += '.left'; break;
            case 39: eventSelector += '.right'; break;
            case 46: eventSelector += '.delete'; break;
        }

        switch (eventSelector) {
            case 'keydown.right':
            //case 'keypress.right':
            //case 'keyup.right':
                if (
                    caret.start === this.value.length && // caret is last
                    index !== inputs.length - 1 // input is no last
                ) {
                    inputs.eq(index + 1).focus().caret(0, 0);
                    e.preventDefault(); // no next motion
                }
                break;
            case 'keydown.backspace':
            case 'keydown.left':
                if (
                    caret.start === caret.end &&
                    caret.start === 0 && // caret is first
                    index !== 0 // input is no first
                ) {
                    var toFocus = inputs.eq(index - 1),
                        lengthToFocus = toFocus.val().length;
                    toFocus.focus().caret(lengthToFocus, lengthToFocus);
                    if (eventSelector === 'keydown.left') {
                        e.preventDefault(); // no next motion
                    }
                }
                break;
            case 'keyup':
            case 'keydown': // repeat is FF10, Webkit, IE
            case 'keypress': // repeat is FF10, Opera 11
                if (
                    caret.start === caret.end &&
                    caret.start === this.value.length && // caret is last
                    index !== inputs.length - 1 && // input is no last
                    this.value.length === options.maxlength
                ) {
                    inputs.eq(index + 1).focus().caret(0, 0);
                }
                break;
            case 'paste':
                elem.attr('maxlength', totalMaxlength);
                break;
/*            case 'keypress':
                elem.attr('maxlength', options.maxlength + 1);
                break;*/
            case 'propertychange': // IE8
            case 'input': // webkit set cursor position as [|øøøø◊]
                // after paste
                if (elem.attr('maxlength') != options.maxlength) {
                    // Chrome fix
                    setTimeout(function() {
                        oninputTimeout(elem, options);
                    }, 0);
                }
                break;
        }
    }

    inputs.each(function(i) {
        var elem = inputs.eq(i),
            maxlength = +elem.attr('maxlength');

        totalMaxlength += maxlength;

        elem.on('keydown keypress keyup input paste propertychange', {
            elem: elem,
            index: i,
            maxlength: maxlength
        }, handler);
    });

    return this;
};

})(jQuery);

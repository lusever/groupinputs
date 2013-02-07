/**
 * GroupInputs v. 0.8.3
 * @author Pavel Kornilov <pk@ostrovok.ru> <lusever@lusever.com>
 * https://github.com/lusever/groupinputs
 * MIT Licensed
 */
(function($) {
'use strict';

var isOpera = !!window.opera,
    MAXLENGTH = 'maxlength';

function caret(node, start, end) {
    var range;
    if (start !== undefined) {
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
        inputsMaxlength = [],
        totalMaxlength = 0;

    function afterPaste(elem, options) {
        // for example, inputs value before paste: [00|2 ] [33  ], need paste: 1111
        // now state: [001111|2] [33  ]

        var firstValue = elem[0].value,
            caretEnd = caret(elem[0]).end, // in webkit start: 2, end: 6
            left = firstValue.slice(0, caretEnd), // 001111
            right = firstValue.slice(caretEnd), // 2
            rightFreeSpace = options.maxlength - right.length, // 3
            isSetFocus = false,
            buffer, newCaretStart, i;

        for (i = inputs.length - 1; i > options.index; i--) {
            rightFreeSpace += inputsMaxlength[i] - inputs[i].value.length;
        }

        if (left.length > rightFreeSpace) {
            left = left.slice(0, rightFreeSpace); // 001111.slice(0, 5)
            newCaretStart = rightFreeSpace;
        } else {
            newCaretStart = caretEnd;
        }

        if (firstValue.length > options.maxlength) {
            elem[0].value = (left + right).slice(0, options.maxlength); // [0011] [33  ]

            // caret remains on input
            if (newCaretStart <= options.maxlength) {
                caret(elem[0], newCaretStart, newCaretStart);
                isSetFocus = true;
            }

            buffer = (left + right).slice(options.maxlength); // 112

            if (buffer.length) {
                newCaretStart -= Math.min(options.maxlength, left.length);
                var maxlength, valLength;
                while (inputs[++i]) {
                    maxlength = inputsMaxlength[i];
                    buffer += inputs[i].value; // 11233

                    inputs.eq(i)
                        .val(buffer.slice(0, maxlength))
                        .change();

                    if (buffer.length <= maxlength) {
                        break;
                    }

                    valLength = inputs[i].value.length;

                    if (!isSetFocus) {
                        if (newCaretStart < maxlength) {
                            isSetFocus = true;
                            inputs.eq(i).focus();
                            caret(inputs[i], newCaretStart, newCaretStart);
                        }
                        newCaretStart -= valLength;
                    }
                    buffer = buffer.slice(maxlength);
                }
            }
            if (!isSetFocus) {
                // setTimeout may be necessary for chrome and safari (https://bugs.webkit.org/show_bug.cgi?id=56271)
                inputs.eq(i).focus();
                caret(inputs[i], newCaretStart, newCaretStart);
            }
        }
    }

    function handler(e) {
        var eventType = e.type,
            options = e.data,
            elem = e.data.elem,
            index = e.data.index,
            caretPos;

        if (isOpera) { // last check 12
            if (eventType === 'keypress') {
                eventType = 'keydown';
            }
        }

        var LEFT_CODE = 37,
            BACKSPACE_CODE = 8,
            DELETE_CODE = 46,
            RIGHT_CODE = 39;

            if (eventType === 'keydown' && e.keyCode === RIGHT_CODE) {
                caretPos = caret(elem[0]);
                if (
                    caretPos.start === this.value.length && // caret is last
                    index !== inputs.length - 1 // input is no last
                ) {
                    inputs.eq(index + 1).focus();
                    caret(inputs[index + 1], 0, 0);
                    e.preventDefault(); // no next motion
                }
            }
            if (eventType === 'keydown' && (e.keyCode === BACKSPACE_CODE || e.keyCode === LEFT_CODE)) {
                caretPos = caret(elem[0]);
                if (
                    caretPos.start === caretPos.end &&
                    caretPos.start === 0 && // caret is first
                    index !== 0 // input is no first
                ) {
                    var toFocus = inputs.eq(index - 1),
                        lengthToFocus = toFocus.val().length;
                    toFocus.focus();
                    caret(toFocus[0], lengthToFocus, lengthToFocus);
                    if (e.keyCode === LEFT_CODE) {
                        e.preventDefault(); // no next motion
                    }
                }
            }
            if (eventType === 'keyup' ||
                eventType === 'keydown') { // repeat in FF10, Webkit, IE
            //case 'keypress': // repeat in FF10, Opera 11
                // ignore system key. ex. shift
                if (e.keyCode < 48) {
                    return;
                }

                // ignore ctrl + any key
                if (eventType === 'keyup' && options.ignoreNextKeyup) {
                    options.ignoreNextKeyup = false;
                    return;
                }
                if (e.metaKey) {
                    // metaKey is ignored in browsers on keyup
                    options.ignoreNextKeyup = true;
                    return;
                }

                caretPos = caret(elem[0]);
                if (
                    caretPos.start === caretPos.end &&
                    caretPos.start === this.value.length && // caret is last
                    index !== inputs.length - 1 && // input is no last
                    this.value.length === options.maxlength
                ) {
                    inputs.eq(index + 1).focus();
                    caret(inputs[index + 1], 0, 0);
                }
            }
            if (eventType === 'paste') {
                elem.attr(MAXLENGTH, totalMaxlength);
            }
/*            case 'keypress':
                elem.attr(MAXLENGTH, options.maxlength + 1);
                break;*/
            if (eventType === 'propertychange' || // IE8
                eventType === 'input') { // webkit set cursor position as [00|11112]
                // after paste
                if (elem.attr(MAXLENGTH) !== options.maxlength) {
                    // Chrome fix
                    setTimeout(function() {
                        afterPaste(elem, options);
                        elem.attr(MAXLENGTH, options.maxlength);
                    }, 0);
                }
            }
            if (eventType === 'input' && isOpera) {
                afterPaste(elem, options);
            }
    }

    inputs.each(function(i) {
        var elem = inputs.eq(i),
            maxlength = +elem.attr(MAXLENGTH);

        totalMaxlength += maxlength;
        inputsMaxlength.push(maxlength);

        elem.on('keydown keypress keyup input paste propertychange', {
            elem: elem,
            index: i,
            maxlength: maxlength
        }, handler);
    });

    // opera not support paste event
    if (isOpera) {
        inputs.attr(MAXLENGTH, totalMaxlength);
    }

    return inputs;
};

}(jQuery));

/*global $:false*/
/*global asyncTest:false, expect:false, strictEqual:false, start: false, ok: false*/
asyncTest("paste symbols : [|◊] to [|◊]", function() {
	var inputs = $("#qunit-fixture input.input1").groupinputs();

	expect(2);

	inputs.eq(0).val("◊");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("◊");
	inputs.eq(0).caret(2, 2);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(0).caret();

		strictEqual(caret.start, 2, 'caret start');
		strictEqual(caret.end, 2, 'caret end');

		start();
	}, 10);
});

asyncTest("paste symbols øøøø: [|◊] to [øø][øø|◊]", function() {
	var inputs = $("#qunit-fixture input.input2").groupinputs();

	expect(4);

	inputs.eq(0).val("◊");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("øøøø◊");
	inputs.eq(0).caret(6, 6);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(1).caret();

		strictEqual(inputs.eq(0).val(), 'øø', 'first input value');
		strictEqual(inputs.eq(1).val(), 'øø◊', 'two input value');
		strictEqual(caret.start, 2, 'two caret start');
		strictEqual(caret.end, 2, 'two caret end');

		start();
	}, 10);
});

asyncTest("paste symbols ●●●●●: [øø][øø|◊] to [øø][øø●●][●●●|◊]", function() {
	var inputs = $("#qunit-fixture input.input3").groupinputs();

	expect(4);

	inputs.eq(0).val("øø");
	inputs.eq(1).val("øø◊");
	inputs.eq(1).triggerHandler("paste");
	inputs.eq(1).val("øø●●●●●◊");
	inputs.eq(1).caret(7, 7);
	inputs.eq(1).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(2).caret();

		strictEqual(inputs.eq(1).val(), 'øø●●', 'two input value');
		strictEqual(inputs.eq(2).val(), '●●●◊', 'third input value');
		strictEqual(caret.start, 3, 'third caret start');
		strictEqual(caret.end, 3, 'third caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 1111222233334444 to [|] [] [] []", function() {
	var inputs = $("#qunit-fixture input.input4").groupinputs();
	expect(6);

	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("1111222233334444");
	inputs.eq(0).caret(16, 16);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '4444', 'fourth input value');
		strictEqual(caret.start, 4, 'fourth caret start');
		strictEqual(caret.end, 4, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 11112222333344 to [|5] [] [] []", function() {
	var inputs = $("#qunit-fixture input.input5").groupinputs();
	expect(6);

	inputs.eq(0).val("5");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("111122223333445");
	inputs.eq(0).caret(14, 14);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '445', 'fourth input value');
		strictEqual(caret.start, 2, 'fourth caret start');
		strictEqual(caret.end, 2, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 111122223333444 to [|5] [] [] []", function() {
	var inputs = $("#qunit-fixture input.input6").groupinputs();
	expect(6);

	inputs.eq(0).val("5");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("1111222233334445");
	inputs.eq(0).caret(15, 15);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '4445', 'fourth input value');
		strictEqual(caret.start, 3, 'fourth caret start');
		strictEqual(caret.end, 3, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 1111222233334444 to [|5] [] [] []", function() {
	var inputs = $("#qunit-fixture input.input7").groupinputs();
	expect(6);

	inputs.eq(0).val("5");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("11112222333344445");
	inputs.eq(0).caret(16, 16);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '4445', 'fourth input value');
		strictEqual(caret.start, 3, 'fourth caret start');
		strictEqual(caret.end, 3, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 11112222333 to [|] [4444] [] []", function() {
	var inputs = $("#qunit-fixture input.input8").groupinputs();
	expect(6);

	inputs.eq(1).val("4444");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("11112222333");
	inputs.eq(0).caret(11, 11);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(2).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3334', 'third input value');
		strictEqual(inputs.eq(3).val(), '444', 'fourth input value');
		strictEqual(caret.start, 3, 'third caret start');
		strictEqual(caret.end, 3, 'third caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 111122223333 to [|] [4444] [] []", function() {
	var inputs = $("#qunit-fixture input.input9").groupinputs();
	expect(6);

	inputs.eq(1).val("4444");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("111122223333");
	inputs.eq(0).caret(12, 12);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '4444', 'fourth input value');
		strictEqual(caret.start, 0, 'fourth caret start');
		strictEqual(caret.end, 0, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste credit card 1111222233333 to [|] [4444] [] []", function() {
	var inputs = $("#qunit-fixture input.input10").groupinputs();
	expect(6);

	inputs.eq(1).val("4444");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("1111222233333");
	inputs.eq(0).caret(13, 13);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(3).caret();

		strictEqual(inputs.eq(0).val(), '1111', 'first input value');
		strictEqual(inputs.eq(1).val(), '2222', 'two input value');
		strictEqual(inputs.eq(2).val(), '3333', 'third input value');
		strictEqual(inputs.eq(3).val(), '4444', 'fourth input value');
		strictEqual(caret.start, 0, 'fourth caret start');
		strictEqual(caret.end, 0, 'fourth caret end');

		start();
	}, 10);
});

asyncTest("paste value card 345 to [] [1|2]", function() {
	var inputs = $("#qunit-fixture input.input11").groupinputs();
	expect(4);

	inputs.eq(1).val("12");
	inputs.eq(1).triggerHandler("paste");
	inputs.eq(1).val("13452");
	inputs.eq(1).caret(4, 4);
	inputs.eq(1).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(1).caret();

		strictEqual(inputs.eq(0).val(), '', 'first input value');
		strictEqual(inputs.eq(1).val(), '1342', 'two input value');
		strictEqual(caret.start, 3, 'two caret start');
		strictEqual(caret.end, 3, 'two caret end');

		start();
	}, 10);
});

asyncTest("paste value card 9 to [1|234] [5]", function() {
	var inputs = $("#qunit-fixture input.input12").groupinputs();
	expect(4);

	inputs.eq(0).val("1234");
	inputs.eq(1).val("5");
	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("19234");
	inputs.eq(0).caret(2, 2);
	inputs.eq(0).triggerHandler("input");
	setTimeout(function() {
		var caret = inputs.eq(0).caret();

		strictEqual(inputs.eq(0).val(), '1923', 'first input value');
		strictEqual(inputs.eq(1).val(), '45', 'two input value');
		strictEqual(caret.start, 2, 'first caret start');
		strictEqual(caret.end, 2, 'first caret end');

		start();
	}, 10);
});

asyncTest("onchange trigger on two inputs", function() {
	var inputs = $("#qunit-fixture input.input-onchange1").groupinputs();
	expect(1);

	inputs.change(function() {
		ok(true, 'input#' + inputs.index(this) + ' onchanged');
	});

	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("12345");
	inputs.eq(0).caret(5, 5);
	inputs.eq(0).triggerHandler("input");

	setTimeout(function() {
		start();
	}, 10);
});

asyncTest("onchange trigger on three inputs", function() {
	var inputs = $("#qunit-fixture input.input-onchange2").groupinputs();
	expect(2);

	inputs.change(function() {
		ok(true, 'input#' + inputs.index(this) + ' onchanged');
	});

	inputs.eq(0).triggerHandler("paste");
	inputs.eq(0).val("123456789");
	inputs.eq(0).caret(9, 9);
	inputs.eq(0).triggerHandler("input");

	setTimeout(function() {
		start();
	}, 10);
});

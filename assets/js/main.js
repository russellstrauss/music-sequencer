var Sequencer = require('./components/sequencer.js');
var Utilities = require('./utils.js');

(function () {
	
	document.addEventListener('DOMContentLoaded',function(){

		Sequencer().init();
	});
})();
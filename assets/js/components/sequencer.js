module.exports = function() {
	
	let input = document.querySelector('#startingNote');
	let dropdown = document.querySelector('#scale');
	
	var scales = {
		MAJOR: 				[12, 11, 9, 7, 5, 4, 2, 0],
		PENTATONIC:			[12, 9, 7, 4, 2, 0],
		MINOR: 				[12, 11, 9, 7, 5, 3, 2, 0],
		BLUES: 				[12, 10, 7, 6, 5, 3, 0],
		FLAMENCO: 			[12, 11, 7, 6, 5, 3, 0],
		UKRAINIAN_DORIAN: 	[12, 10, 9, 7, 6, 3, 2, 0],
		AUGMENTED: 			[12, 11, 8, 7, 4, 3, 0],
		WHOLE_TONE: 		[12, 10, 8, 6, 4, 2, 0]
	}
	var notes = scales[dropdown.value];
	var MIDI_NUM_NAMES = ['C_1', 'C#_1', 'D_1', 'D#_1', 'E_1', 'F_1', 'F#_1', 'G_1', 'G#_1', 'A_1', 'A#_1', 'B_1',
                'C0', 'C#0', 'D0', 'D#0', 'E0', 'F0', 'F#0', 'G0', 'G#0', 'A0', 'A#0', 'B0',
                'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
                'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
                'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
                'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
                'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
                'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
                'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
                'C8', 'C#8', 'D8', 'D#8', 'E8', 'F8', 'F#8', 'G8', 'G#8', 'A8', 'A#8', 'B8',
				'C9', 'C#9', 'D9', 'D#9', 'E9', 'F9', 'F#9', 'G9'];
	
	return {
		
		settings: {
			sequencer: {
				columns: 60,
				rows: 7
			},
			rowColors: ['#564359', '#7F4C55', '#7A9982', '#B85C0F', '#184212', '#35535E', '#917231']
		},
		
		init: function() {

			let self = this;
			self.addEvents();
			
			// setup a polyphonic sampler
			var keys = new Tone.Players({
				'A' : './audio/casio/A1.[mp3|ogg]',
				'C#' : './audio/casio/Cs2.[mp3|ogg]',
				'E' : './audio/casio/E2.[mp3|ogg]',
				'F#' : './audio/casio/Fs2.[mp3|ogg]',
				'G' : './audio/casio/G2.[mp3|ogg]',
				'C' : './audio/casio/C2.[mp3|ogg]',
				'Bb' : './audio/casio/As2.[mp3|ogg]',
			}, {
				'volume' : -10,
				'fadeOut' : '64n',
			}).toMaster();
			var majorScale = ['587.330', '440', '293.665', '246.942', '164.814', '97.999', '65.406']; // [D, A, D, B, E, G, C]
			var Cmajor = ['C4','D4','E4','F4','G4','A4','B4','C5'];
			var minorScale = [];
			
			self.setScale(parseInt(input.value), notes);
			
			//const synth = new Tone.FMSynth().toMaster();
			var instruments = [];
			instruments.push({synth: new Tone.PolySynth(7, Tone.Synth).toMaster(), volume: 0.9});
			instruments.push({synth: new Tone.PolySynth(7, function () {
				return new Tone.Synth({
						"oscillator" : {
							"type" : "amtriangle",
							"harmonicity" : 0.5,
							"modulationType" : "sine"
						},
						"envelope" : {
							"attackCurve" : "exponential",
							"attack" : 0.025,
							"decay" : 0.2,
							"sustain" : 0.2,
							"release" : 1.5,
						},
						"portamento" : 0.05
						});
			}).toMaster(), volume: 1});
			instruments.push({synth: new Tone.PolySynth(7, function () {
				return new Tone.Synth({
						"oscillator" : {
							"type" : "fmtriangle",
							"harmonicity" : 1,
							"modulationType" : "square",
							"modulationIndex": 4
						},
						"envelope" : {
							"attackCurve" : "exponential",
							"attack" : 0.025,
							"decay" : 0.2,
							"sustain" : 0.2,
							"release" : 0.7,
						},
						"portamento" : 0.05
						});
			}).toMaster(), volume: 0.2});
			instruments.push({synth: new Tone.PolySynth(7, function () {
				return new Tone.Synth({
						"oscillator" : {
							"type" : "pwm",
							"modulationFrequency" : 0.4
						},
						"envelope" : {
							"attackCurve" : "sine",
							"attack" : 0.03,
							"decay" : 0.22,
							"sustain" : 0.4,
							"release" : 0.8,
						}
						});
			}).toMaster(), volume: 0.1});

			var synth = new Tone.Synth({
				"oscillator" : {
					"type" : "fmtriangle",
					"harmonicity" : 1,
					"modulationType" : "square",
					"modulationIndex": 4
				},
				"envelope" : {
					"attackCurve" : "exponential",
					"attack" : 0.025,
					"decay" : 0.2,
					"sustain" : 0.2,
					"release" : 0.7,
				},
				"portamento" : 0.05
			}).toMaster();		
			let sequence = [];
			for (let i = 0; i < this.settings.sequencer.columns; i++) {
				sequence.push(i+1);
			}
			
			let tss = document.querySelector('tone-step-sequencer');
			
			tss.columns = this.settings.sequencer.columns;
			tss.rows = this.settings.sequencer.rows;
			
			var loop = new Tone.Sequence(function(time, currentCol) {
				
				var column = document.querySelector('tone-step-sequencer').currentColumn;
				
				column.forEach(function(val, row) {
					
					let instrument;
					if (row === 0) instrument = instruments[0];
					if (row === 1) instrument = instruments[0];
					if (row === 2) instrument = instruments[0];
					if (row === 3) instrument = instruments[1];
					if (row === 4) instrument = instruments[0];
					if (row === 5) instrument = instruments[1];
					if (row === 6) instrument = instruments[0];

					if (val) {
						var vel = Math.random() * 0.5 + 0.5; // slightly randomized velocities
						instrument.synth.triggerAttackRelease(notes[row], '4n', time, instrument.volume);
					}
				});
				
				Tone.Draw.schedule(function() { //set the column on the correct draw frame
					document.querySelector('tone-step-sequencer').setAttribute('highlight', currentCol);
				}, time);
				
			}, sequence, '16n').start(0); // sequence speed
			
			Tone.Transport.bpm.value = 72;
			document.querySelector('tone-transport').bind(Tone.Transport);

			Tone.Transport.on('stop', () => {
				setTimeout(() => {
					document.querySelector('tone-step-sequencer').setAttribute('highlight', '-1');
				}, 100);
			});
			
			// Removed scoped custom styles
			let toneContentStyle = document.querySelector('tone-content').shadowRoot.querySelector('style');
			toneContentStyle.remove();
			
			
			setTimeout(function() {
				
				self.addRowColumnIndices();
				self.setStyles();
			}, 0);
		},
		
		addRowColumnIndices: function() {
			
			
			let self = this;
			let sequencer = document.querySelector('tone-step-sequencer');
			let columns = sequencer.shadowRoot.querySelectorAll('.column');
			
			columns.forEach(function(column) {
				
				var columnIndex = Array.prototype.indexOf.call(column.parentNode.children, column);
				column.setAttribute('column', columnIndex);
				let rows = column.querySelectorAll('.row');
				
				rows.forEach(function(row) {
					
					var rowIndex = Array.prototype.indexOf.call(column.children, row);
					row.setAttribute('row', rowIndex);
				});
			});
			
			self.setInterval(0, 6, 12);
			self.setInterval(1, 5, 10);
			self.setInterval(2, 4, 6);
			self.setInterval(3, 3, 5);
			self.setInterval(4, 2, 4);
			self.setInterval(5, 1, 3);
			self.setInterval(6, 0, 2);
		},
		
		setInterval: function(rowIndex, startingColumn, interval) {
			
			let sequencer = document.querySelector('tone-step-sequencer');
			let cells = sequencer.shadowRoot.querySelectorAll('[row="' + rowIndex + '"]');
			
			let startingIndex = startingColumn;
			while (startingIndex > 0) {
				let newVal = startingIndex - interval;
				if (newVal > 0) startingIndex = newVal;
				else break;
			}

			for (let i = startingIndex; i < cells.length; i += interval) {
				
				sequencer.values[i][rowIndex] = true; // off tempo bug?
				cells[i].classList.add('filled');
				//cells[i].style.backgroundColor = this.settings.rowColors[rowIndex];
			}
		},
		
		addEvents: function() {
			
			let self = this;
			
			dropdown.addEventListener('change', function(event) {
				self.setScale(parseInt(input.value), scales[event.target.value]);
			});
			
			input.addEventListener('change', function(event) {
				console.log(event.target.value);
				self.setScale(parseInt(event.target.value), scales[dropdown.value]);
			});
		},
		
		setScale: function(startingNote, scale) {
			
			var newScale = [];
			for(var i = 0; i < scale.length; i++) {
				newScale.push( MIDI_NUM_NAMES[scale[i] + startingNote] );
			}
			notes = newScale;
		},
		
		setStyles: function() {
			
			// let sequencer = document.querySelector('tone-step-sequencer');
			// let style = '<style type="text/css"> * { border: 1px solid red !important;} </style>'
			// sequencer.shadowRoot.style = style;
		}
	}
}
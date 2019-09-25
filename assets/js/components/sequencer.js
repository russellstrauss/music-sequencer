module.exports = function() {
	
	return {
		
		settings: {
			sequencer: {
				columns: 60,
				rows: 7
			}
		},
		
		init: function() {

			let self = this;
			
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
			var notes = ['D4', 'D4', 'D4', 'D4', 'D4', 'D4', 'Bb2'];
			const synth = new Tone.FMSynth().toMaster();

			var noteNames = ['D', 'C', 'G', 'F#', 'E', 'C#', 'Bb4'];
			
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
					if (val) {
						var vel = Math.random() * 0.5 + 0.5; // slightly randomized velocities
						//keys.get(noteNames[i]).start(time, 0, '32n', 0, vel); // 32n: note length
						synth.triggerAttackRelease(notes[row], '32n');
					}
				});
				
				Tone.Draw.schedule(function() { //set the column on the correct draw frame
					document.querySelector('tone-step-sequencer').setAttribute('highlight', currentCol);
				}, time);
				
			}, sequence, '16n').start(0); // sequence speed

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
				
				self.addRowClasses();
			}, 0);
		},
		
		addRowClasses: function() {
			
			
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
			
			self.highlightInterval(6, 0, 2);
			self.highlightInterval(5, 1, 4);
		},
		
		highlightInterval: function(rowIndex, startingColumn, interval) {
			
			let sequencer = document.querySelector('tone-step-sequencer');
			//let columns = sequencer.shadowRoot.querySelectorAll('[column="' + startingColumn + '"]');
			let cells = sequencer.shadowRoot.querySelectorAll('[row="' + rowIndex + '"]');
			
			//console.log(columns);
			let startingIndex = startingColumn;
			while (startingIndex > 0) {
				//debugger;
				let newVal = startingIndex - interval;
				if (newVal > 0) startingIndex = newVal;
				else break;
			}

			for (let i = startingIndex; i < cells.length; i += interval) {
				
				//cells[i].style.backgroundColor = 'black';
				cells[i].classList.add('filled');
			}
		},
		
		addEvents: function() {
			
		}
	}
}
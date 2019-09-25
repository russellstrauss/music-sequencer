module.exports = function() {
	
	return {
		
		settings: {
			
		},
		
		init: function() {

			let self = this;
			
			
			
			
			//setup a polyphonic sampler
			var keys = new Tone.Players({
				'A' : './audio/casio/A1.[mp3|ogg]',
				'C#' : './audio/casio/Cs2.[mp3|ogg]',
				'E' : './audio/casio/E2.[mp3|ogg]',
				'F#' : './audio/casio/Fs2.[mp3|ogg]',
			}, {
				'volume' : -10,
				'fadeOut' : '64n',
			}).toMaster();

			//the notes
			var noteNames = ['F#', 'E', 'C#', 'A'];
			
			let sequence = [];
			for (let i = 0; i < 60; i++) {
				sequence.push(i+1);
			}
			
			console.log(sequence);
			var loop = new Tone.Sequence(function(time, col) {
				
				var column = document.querySelector('tone-step-sequencer').currentColumn;
				
				column.forEach(function(val, i) {
					
					if (val){
						var vel = Math.random() * 0.5 + 0.5; // slightly randomized velocities
						keys.get(noteNames[i]).start(time, 0, '32n', 0, vel);
					}
				});
				
				Tone.Draw.schedule(function() { //set the columne on the correct draw frame
					document.querySelector('tone-step-sequencer').setAttribute('highlight', col);
				}, time);
			}, sequence, '16n').start(0);

			//bind the interface
			document.querySelector('tone-transport').bind(Tone.Transport);

			Tone.Transport.on('stop', () => {
				setTimeout(() => {
					document.querySelector('tone-step-sequencer').setAttribute('highlight', '-1');
				}, 100);
			});
		}
	}
}
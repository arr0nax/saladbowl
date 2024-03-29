let sourceList = [];
let activeList = [];

$(function () {

	fetchLibrary();
	var example3Left = document.getElementById('example3Left');
	var example3Right = document.getElementById('example3Right');
	new Sortable(example3Left, {
	    group: 'shared',
	    animation: 150,
		onSort: function (evt) {
			const id_string = evt.item.classList.item(1)

			let start = luxon.DateTime.now().set({hour: 4, minute: 0, second: 0});

			activeList = []
			var i;
			for (i = 0; i < evt.target.children.length; i++) {
				activeList.push(sourceList[evt.target.children[i].classList.item(1)]);
			} 

			const list = document.getElementById("example3Left").childNodes;
			for (var i = 1; i < list.length; i++) {
				const index = i - 1;
				const newTime = start.toLocaleString(luxon.DateTime.TIME_WITH_SECONDS);
				let title = activeList[index].source.split('/')[4];
				list[i].innerText = `${newTime} - ${title}`
				
				const newDur = luxon.Duration.fromMillis(activeList[index].duration * 1000);
				start = start.plus(newDur);

				let button = document.createElement('button');
				button.textContent = 'x';
				button.addEventListener('click', (e) => {
					console.log(e);
					var nodes = Array.prototype.slice.call( document.getElementById('example3Left').children );
					console.log(nodes);
					const remove_index = nodes.indexOf(e.target.parentNode);
					console.log(remove_index);
					e.target.parentNode.parentNode.removeChild(e.target.parentNode);
					activeList.splice(remove_index, 1);

					console.log(activeList);
					
				})
				list[i].appendChild(button);
		
			}	
		},
	});

	new Sortable(example3Right, {
	    group: {
			name: 'shared',
			pull: 'clone',
			put: false
	    },
	    animation: 150,
	    sort: false
	});
});

function fetchLibrary() {
	fetch("library.json")
		.then(response => {
		   return response.json();
		})
		.then(data => {
			const sorted_data = data.sort((a, b) => a.source.split('/')[4] > b.source.split('/')[4]);
			sourceList = sorted_data;
			populateLibrary(sorted_data);
		});
}

function populateLibrary(data) {
	var example3Right = document.getElementById('example3Right');
	data.forEach((movie, index) => {
		let el = document.createElement('div');
		el.classList.add('list-group-item')
		el.classList.add(`${index}`)
		el.style.minHeight = `18px`
		el.style.borderColor = 'white';
		el.style.cursor = 'grab';
		example3Right.appendChild(el);


		let title = movie.source.split('/')[4];

		let duration = movie.duration;
		let hours = `${Math.floor(duration / 3600)}`;
		let minutes = `${Math.floor((duration % 3600) / 60)}`;
		let seconds = `${Math.floor((duration % 3600) % 60)}`;

		if (hours.length < 2) hours = '0' + hours;
		if (minutes.length < 2) minutes = '0' + minutes;
		if (seconds.length < 2) seconds = '0' + seconds;

		el.style.height = `${duration / 100}px`

		let text = document.createElement('div');
		text.innerText = `${hours}:${minutes}:${seconds} - ${title}`;
		el.appendChild(text);

		
		
		
	})

}

function createTables() {

}

function updateTimes() {

}

function saveSchedule() {
	
	let buttons = document.getElementById('buttons');
	let el = document.createElement('div');
	el.id = "saved";
	el.innerText = "loading"
	buttons.appendChild(el);

	let button = document.getElementById("save");
	button.disabled = true;
	

	
	const url = '/save-schedule';



	const options = {
	    method: 'POST',
	    body: JSON.stringify(activeList),
	    headers: {
		'Content-Type': 'application/json'
	    }
	}

	fetch(url, options)
	    .then(res => res.json())
	    .then(res => {
			el.innerText = "saved!"
			button.disabled = false;

			setTimeout(() => {
				el.remove()
			}, 3000)
			console.log(res)
		})
		.catch(error => {
			el.innerText = "something went wrong :("
			button.disabled = false;
			
			setTimeout(() => {
				el.remove()
			}, 3000)
		})
}

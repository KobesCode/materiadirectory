export default {
	async load() {
		let data = await fetch('https://docs.google.com/spreadsheets/u/0/d/1xsugAiw0j3Kz0Ic41gD-QuMtfxiVtlf-mujLC3Xt78c/gviz/tq?tqx=out:json&sheet=twitch')
		let text = await data.text();
		text = text.replaceAll(
			"/*O_o*/\ngoogle.visualization.Query.setResponse(",
			""
		);
		text = JSON.parse(text.substring(0, text.length - 2));

		let rows = text.table.rows

		let channels = []

		for (let row in rows) {
			let channeldata = rows[row].c.map(item => item && item.v !== null ? item.v : null);

			let accountname = channeldata[1].split('/').pop()
			channels.push(
				{
					name: channeldata[0],
					url: channeldata[1],
					tags: channeldata[2],
					server: channeldata[3],
					fc: channeldata[4],
					streamdays: channeldata[5],
					accountname: accountname,
				}
			);
		}

		channels.shift();

		let fetches = []
		let array = [];
		for (let channel in channels) {
			fetches.push(
				fetch(`https://twitchuserinfo.ingramscloud.workers.dev/${channels[channel].accountname}`)
					.then((response) => response.text())
					.then(data => { array.push({ accountname: channels[channel].accountname, profile_url: data }) ; })
					.catch(err => {return console.log(err);})
			)
		}

		// TODO: Find a way to merge array and channels
		Promise.all(fetches).then(function() {
			let mergedChannels = channels.concat(array.filter(item2 => channels.some(item1 => item1.accountname === item2.accountname)));
			console.log(mergedChannels);
		});


		return channels;
	}
}
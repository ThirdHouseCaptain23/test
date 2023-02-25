'use strict'
const axios = require('axios')

const config = {
	method: 'post',
	maxBodyLength: Infinity,
	headers: {
		'Content-Type': 'application/json',
	},
}

exports.getSessions = async (data) => {
	try {
		config.url = 'http://localhost:3015/osl-bap/dsep/search'
		config.data = JSON.stringify(data)
		console.log(config)
		const response = await axios(config)
		console.log(response.data.data)
		return response.data.data
	} catch (err) {
		console.log(err)
	}
}

/* exports.getSessions({
	sessionTitle: 'ClusterNumberNo10',
	type: 'session',
})
 */

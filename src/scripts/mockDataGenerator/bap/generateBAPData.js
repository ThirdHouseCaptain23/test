'use strict'

const { signup, addProfile } = require('./generateUserAccount')
const { getSessions } = require('./getSessions')
const { confirmSession } = require('./confirmSession')

const generateBAPData = async () => {
	try {
		for (let i = 1; i <= 10; i++) {
			const sessions = await getSessions({
				sessionTitle: 'ClusterNumber' + i,
				type: 'session',
			})
			console.log(sessions.length)
		}
	} catch (err) {
		console.log(err)
	}
}

generateBAPData()

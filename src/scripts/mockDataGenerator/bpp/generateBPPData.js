'use strict'
const { generateMentorAccount, loginMentorAccount } = require('./generateMentorAccount')
const { generateOrganization } = require('./generateOrganization')
const { generateSession } = require('./generateSession')
const { faker } = require('@faker-js/faker')

const generateMentorNames = () => {
	try {
		const count = 40
		const mentorSet = new Set()
		do {
			mentorSet.add(faker.name.fullName())
		} while (mentorSet.size !== count)
		return Array.from(mentorSet)
	} catch (err) {
		console.log(err)
	}
}

const generateBPPData = async () => {
	try {
		const initialMentorAccount = await loginMentorAccount({
			email: 'hackathonMentor@shikshalokam.org',
			password: 'testing',
		})
		const initialAccessToken = initialMentorAccount.access_token
		console.log('ACCESS TOKEN: ', initialAccessToken)
		generateMentorNames()
	} catch (err) {
		console.log(err)
	}
}

generateBPPData()

'use strict'
const { itemAttendanceQueries } = require('@database/storage/itemAttendance/queries')
const { itemQueries } = require('@database/storage/item/queries')
const { internalRequests } = require('@helpers/requests')

exports.getConfirmedList = async (req, res) => {
	try {
		const userId = req.user.id
		const itemAttendances = await itemAttendanceQueries.findByUserMongoId(userId)
		const attendances = await Promise.all(
			itemAttendances.map(async (itemAttendance) => {
				const item = await itemQueries.findById(itemAttendance.itemMongoId)
				return {
					orderId: itemAttendance.orderId,
					type: itemAttendance.type,
					details: JSON.parse(item.details),
					status: itemAttendance.status,
					joinLink: itemAttendance.joinLink,
				}
			})
		)
		res.status(200).json({
			status: true,
			message: 'Fetched Confirmed List',
			data: attendances,
		})
	} catch (err) {
		console.log(err)
	}
}

exports.markAttendanceCompleted = async (req, res) => {
	const failedRes = (message) => res.status(400).json({ status: false, message })
	try {
		const userId = req.user.id
		const orderId = req.body.orderId
		const rating = req.body.rating
		console.log(userId)
		console.log(orderId)
		const itemAttendance = await itemAttendanceQueries.findOne({ orderId, userMongoId: userId })
		if (!itemAttendance) return failedRes('Attendance Not Found')
		const updatedAttendance = await itemAttendanceQueries.setAsCompleted(orderId, rating)
		const item = await itemQueries.findById(itemAttendance.itemMongoId)
		const response = await internalRequests.recommendationPOST({
			route: process.env.RECOMMENDATION_ADD_RATING,
			body: {
				userId,
				itemId: item.itemId,
				rating,
			},
		})
		console.log(response)
		if (!response.status) throw 'Neo4j Item Injection Failed'
		res.status(200).json({
			status: true,
			message: 'Attendance Marked As Completed',
			data: updatedAttendance,
		})
	} catch (err) {
		console.log(err)
	}
}

'use strict'
const { itemAttendanceQueries } = require('@database/storage/itemAttendance/queries')
const { itemQueries } = require('@database/storage/item/queries')

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
		res.status(200).json({
			status: true,
			message: 'Attendance Marked As Completed',
			data: updatedAttendance,
		})
	} catch (err) {
		console.log(err)
	}
}

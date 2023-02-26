'use strict'
const router = require('express').Router()
const dsepRouter = require('@routes/dsep')
const userRouter = require('@routes/user')
const { tokenVerifier } = require('@middlewares/tokenVerifier')
const { getConfirmedList, markAttendanceCompleted, getRecommendations } = require('@controllers/index')

router.use('/dsep', dsepRouter)
router.use('/user', userRouter)

router.use(tokenVerifier)

router.get('/get-confirmed-list', getConfirmedList)
router.post('/mark-attendance-completed', markAttendanceCompleted)
router.post('/get-recommendations', getRecommendations)
module.exports = router

const { Router } = require('express')
const { WardenController, ImageController } = require('../controllers')
const { authorizeValidator } = require('../helpers/validators')
const router = Router()
const upload = require('../lib/imageUpload')
const { verifyAuthToken } = require('../middlewares/authTokenVerification')
const {
  validationRequestSchema,
} = require('../middlewares/validationRequestSchema')
const { verifyAdmin } = require('../middlewares/verifyAdmin')

router.get(
  '/assign-approval-request',
  verifyAuthToken,
  verifyAdmin,
  WardenController.assignWardensToAdmin,
)

router.get(
  '/approval',
  verifyAuthToken,
  verifyAdmin,
  WardenController.getWardenListForApproval,
)
router.get('/approval/:id', WardenController.getWardenDetailsById)
router.put(
  '/authorize',
  authorizeValidator(),
  validationRequestSchema,
  verifyAuthToken,
  verifyAdmin,
  WardenController.authorizeWarden,
)
router.put(
  '/decline',
  authorizeValidator(),
  validationRequestSchema,
  verifyAuthToken,
  verifyAdmin,
  WardenController.declineWarden,
)
router.put(
  '/undo',
  authorizeValidator(),
  validationRequestSchema,
  verifyAuthToken,
  verifyAdmin,
  WardenController.undoWarden,
)


router.delete(
  '/delete',
  authorizeValidator(),
  validationRequestSchema,
  verifyAuthToken,
  verifyAdmin,
  WardenController.deleteWarden,
)

router.put('/reset', WardenController.resetWardenStatus)

module.exports = router

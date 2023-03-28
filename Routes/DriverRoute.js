const express = require('express');
const Authenticate = require('../Authenticate/authenticate');
const { registerDriver, updateDriver, getDriverData } = require('../Controllers/DriverController');
const router = express.Router();
const multer = require('multer')

const upload = multer({
    storage: multer.diskStorage({
      destination: function(req,file,cb){
        if(file.fieldname === 'cnicfront' || file.fieldname === 'cnicback'){
            cb(null,'Uploads/driver/cnic')
        }else if(file.fieldname === 'vehicles' || file.fieldname === 'vehicleCertificate'){
            cb(null,'Uploads/driver/vehicles')
        }else if(file.fieldname === 'liscenseimage'){
            cb(null,'Uploads/driver/liscense')
        }
      },
      filename: function(req,file,cb){
        cb(null,file.fieldname + "_" + Date.now()+".jpg")
      },
    })
  }).fields([{name: 'cnicfront', maxCount: 1},{name: 'cnicback', maxCount: 1},{name: 'vehicles',maxCount:1},{name: 'vehicleCertificate', maxCount: 1},{name: 'liscenseimage', maxCount: 1}])

router.post('/driver/register',upload,Authenticate, registerDriver);
router.put('/driver/:userId',Authenticate,updateDriver)
router.get('/driver/:userId', Authenticate,getDriverData);

module.exports = router;
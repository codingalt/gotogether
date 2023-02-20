const mongoose = require('mongoose');

const driverSchema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
      },
      fatherName: {
        type: String,
        required: true,
      },
      birthDate: {
        type: String,
        required: true,
      },
      cnic: {
        type: String,
        required: true,
        unique: true,
      },
      cnicImgFront: {
        public_id: {
            type: String,
          },
          url: {
            type: String,
          },
      },
      cnicImgBack: {
        public_id: {
            type: String,
          },
          url: {
            type: String,
          },
      },
      totalReviewsGiven: {
        type: Number,
        required: true,
      },
      totalRating: {
        type: Number,
        required: true
      },
      profileStatus: {
        type: Boolean,
        default: false
      },
      residentialAddress: {
        type: String,
        required: true,
      },
      vehicleDetails: [
        {
            vehicleType: String,
            vehicleNumber: String,
            vehicleColor: String,
            vehicleRegisterCertificate: {
              public_id: {
                type: String,
              },
              url: {
                type: String,
              },
            },
            vehicleBrand: String,
            vehicleSeats: Number,
            vehicleImages: {
                public_id: {
                    type: String,
                  },
                  url: {
                    type: String,
                  },
            },

        }
      ],

      liscenseDetails: [
        {
            liscenseNumber: String,
            liscenseImages: {
                public_id: {
                    type: String,
                  },
                  url: {
                    type: String,
                  },
            },
            liscenseExpiryDate: String,
            liscenseType: String
        }
      ]
     
    },
    { timestamps: true }
  );
  
  const DriverModel = mongoose.model("Drivers", driverSchema);
  module.exports = DriverModel;
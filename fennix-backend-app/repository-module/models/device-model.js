const mongoose = require('mongoose');
require('mongoose-double')(mongoose);
const Schema = mongoose.Schema;
let SchemaType = mongoose.Schema.Types;

const deviceSchema = new Schema({
    _id:  String,
    beneficiaryId:  String,
    deviceTypeId:  String,
    imei:  Number,
    simCardId:  String,
    isActive:  Boolean,
    online: String,
    centerId:  String,
    firmwareVersion:  String,
    createdDate:  String,
    updatedDate:  String
});

const deviceTypeSchema = new Schema({
    _id: {Type:String},
    name: {Type:String},
    minSpeed: {Type:Number},
    maxHdop: {Type:Number},
    minGpsLevel: {Type:Number},
    minDiffTrackPoints: {Type:Number},
    timeout: {Type:Number},
    stationaryTimeout: {Type:Number},
    icon: {Type:String},
    mapIcon: {Type:String},
    tailColor: {Type:String},
    tailPoints: {Type: Number},
    isActive: {Type:Boolean},
    createdDate: {Type:String},
    updatedDate: {Type:String}
});

const deviceAttributesSchema = new Schema({
    _id: Number,
    beneficiaryId: Number,
    deviceId: Number,
    cellId: String,
    mcc: Number,
    lac: String,
    enableAlarmStatus: Boolean,
    buzzerStatus: Boolean,
    vibratorStatus: Boolean,
    serialNumber: String,
    hdop: Number,
    locationId: Number,
    speed: SchemaType.Double,
    gpsStatus: String,
    moveDistance: Number,
    alarmStatus: String,
    beltStatus: Number,
    batteryVoltage: SchemaType.Double,
    shellStatus: Number,
    chargeStatus: Number,
    connectingSession: String,
    serverDate: Date,
    course: Number,
    satelliteNumber: Number,
    gpsFixedStatus: Number,
    batteryPercentage: SchemaType.Double,
    gsmSignal: Number,
    lowPowerStatus: Number,
    dataLoggerStatus: Number,
    stillStatus: Number,
    rfConnectionStatus: Number,
    rfgSensorStatus: Number,
    rfPlugStatus: Number,
    restrictedAreaStatus: Number,
    restrictedPersonsStatus: Number,
    deviceUpdatedDate: Date
});

const deviceCounterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    counter: Number
});

const deviceAggregator = mongoose.model('Device', deviceSchema, 'devices');

const deviceTypeModel = mongoose.model('DeviceType', deviceTypeSchema, 'deviceTypes');

const DeviceAttributeModel = mongoose.model('DeviceAttribute', deviceAttributesSchema, 'deviceAttributes');

const DeviceAttributesModelCounter = mongoose.model('DeviceAttributeCounter', deviceCounterSchema, 'deviceAttributesCounter');

const devicesModel = mongoose.model('Device');

const DeviceCounter = mongoose.model('DeviceCounter', deviceCounterSchema, 'devicesCounter');

module.exports = {
    deviceAggregator,
    deviceTypeModel,
    devicesModel,
    DeviceCounter,
    DeviceAttributesModelCounter,
    DeviceAttributeModel
};
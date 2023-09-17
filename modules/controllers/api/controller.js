const Case = require('./../../models/case');
const Year = require('./../../models/year');
const Month = require('../../models/month');
const Bill = require('./../../models/bill');
const User = require('./../../models/user');
const Permission = require('./../../models/permission');
const Role = require('./../../models/role');
const PasswordReset = require('./../../models/password-reset');
const Folder = require('./../../models/folder');
const Status = require('./../../models/status');
const Message = require('./../../models/message');

module.exports = class Controller {
    constructor(){
        this.model = {
            Case,
            Year , 
            Month,
            Bill,
            User,
            Permission,
            Role,
            PasswordReset,
            Folder,
            Status,
            Message
        }
    }
};

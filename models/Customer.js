const { values } = require('lodash');
const {DataTypes, STRING}= require('sequelize');
const { default: isEmail } = require('validator/lib/isEmail');

module.exports = (sequelize)=>{
    const Customer=sequelize.define('Customer',{
        name:{
            
            type:DataTypes.STRING,
            allowNull:false,
        },
        email:{
            
            type:DataTypes.STRING,
            allowNull:false,
            isEmail:true
        },
        age:{
            
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{
        tablename:'customers',
        timeStamps:true
    })
}
"use strict";
const userModel = require("../models/User");

const onGetAllUsers = async function (req, res) {
  try {
    const usersData = await userModel.find();
    return res.status(200).json({ status: true, users: usersData });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

const onGetUserById = async function (req, res) {
  try {
    const userData = await userModel.findById(req.params.userId);
    if (!userData) return res.status(404).json({ status: false, message: 'No user with this id found' });
    return res.status(200).json({ status: true, user: userData });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

const onDeleteUserById = async function (req, res) {
  try {
    const user = await userModel.remove({ _id: req.params.id });
    return res.status(200).json({
      status: true,
      message: `Deleted a count of ${user.deletedCount} user.`
    });
  } catch (error) {
    return res.status(500).json({ status: false, error: error })
  }
}

module.exports = {
  onGetAllUsers,
  onGetUserById,
  onDeleteUserById
}
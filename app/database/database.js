const User = require("../models/users.model");
const Waitlist = require("../models/waitlists.model");
const bcrypt = require("bcryptjs");
const randomid = require("randomid");

const upload_img = async(file, path) => {
    if (file == undefined){
        return null;
    }
    const file_id = `${randomid(4)}.${file.name.split('.')
        [file.name.split('.').length - 1]}`;
    file.mv(`./app/assets/${path}/` + file_id);
    const file_info = { name: file_id, size: file.size }
    return file_info;
}

module.exports = {
    comparePassword: async(request_password, user_password) => {
        const check = await bcrypt.compare(request_password, user_password);
        return check;
    },
    createUser: async (data) => {
        const new_user = new User({
            fullname: data.fullname,
            username: data.username,
            user_id: randomid(7),
            password: await bcrypt.hash(data.password, 8),
            profile_picture: {name:"default"},
            gender: data.gender,
            email: data.email,
            date_joined: new Date().toISOString(),
            location: "Port Harcourt, Nigeria",
        });
        await new_user.save();
        return new_user;
    },
    getUser: async (username) => {
        const user = await User.findOne({'username': username});
        return user;
    },
    editUser: async(email, file, data) => {
        const user = await User.findOne({'email': email});

        user.fullname = data.fullname;
        user.username = data.username;
        user.profile_picture = file===undefined?user.profile_picture:await upload_img(file, 'images');
        user.gender = data.gender;
        user.email = data.email;
        user.location = data.location;

        await user.save();
        return user;
    },
    getWaitlister: async(email) => {
        const waitlister = await Waitlist.findOne({'email':email})
        return waitlister;
    },
    newWaitlist: async(email, name) => {
        const new_waitlist = new Waitlist({
            email: email,
            name: name,
            date_joined: new Date().toISOString(),
        })
        await new_waitlist.save();
        return new_waitlist;
    }
}
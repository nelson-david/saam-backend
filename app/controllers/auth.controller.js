const jwt = require('jsonwebtoken');
const randomid = require("randomid");

const genAccessToken = async(user, token) => {
	return jwt.sign(user, token);
}

const loginUser = async(res, user) => {
	const token = await genAccessToken({
		_id: user._id, email: user.email, username: user.username
	}, res.config.TOKEN_SECRET);
	return token;
}

const sendEmail = async() => {
	const confirmation_code = 1234;
	return confirmation_code;
}

module.exports = {
	verify_email: async(req, res) => {
		const data = req.body;

		var user = await res.database.getUser(data.email, false);
		if (user){
			if (parseInt(data.code) === user.confirmation_code){
				const token = await loginUser(res, user);
				res.status(200).send({message: true, 'token': token, 'user': user})
				return;
			}
			res.sendStatus(500);
			return;
		}
	},
	auth: async(req, res) => {
		const data = req.body;
		const user = await res.database.getUser(data.username);
		if (user){
			const check = await res.database.comparePassword(data.password, user.password)
			if (check) {
				const token = await loginUser(res, user);
				res.status(200).send({message: true, 'token': token, 'user': user})
				return;
			}
			return res.send({error:"password"});
		}
		return res.send({error:"exists"})
	},
	register_user: async(req, res) => {
		const data = req.body;
		try{
			var user = await res.database.getUser(data.username);
			if (user){
				res.status(200).send({exists: true});
				return;
			}
			user = await res.database.createUser(data);
			return res.send({user:user})
		}catch (error){
			res.sendStatus(500);
			console.log("Error: ", error);
			return;
		}
	}
}
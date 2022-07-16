// const redis = require("redis");
// const client = redis.createClient(6379);
const randomid = require("randomid");

module.exports = {
	get_user: async(req, res) => {
		try{
			const user = await res.database.getUser(req.params.username);
			return res.send({user:user});
		}catch(error){
			res.sendStatus(500);
			return;
		}
	},
	current_user: async(req, res) => {
		try{
			const user = await res.database.getUser(res.user.username);
			return res.send({user:user});
		}catch(error){
			res.sendStatus(500);
			return;
		}
	},
	edit_profile: async(req, res) => {
		const body = req.body;
		const file = req.files!==null?req.files.files:undefined

		const user = await res.database.editUser(res.user.email, 
			file, JSON.parse(body.current_user));

		return res.send({message:"success"})
	},
	new_message: async(req, res) => {
		try{
			const body = req.body;
			const user = await res.database.getUser(req.params.username);
			if (user){
				var message_list = user.messages;
				const new_message = {
					message_id: randomid(4),
					body: body.message,
					date_sent: new Date().toISOString(),
				}
				message_list.unshift(new_message);
				user.messages = message_list;
				await user.save();
				return res.send({message: "success"})
			}
			return res.send({error: exist})
		}catch(error){
			res.sendStatus(500);
			return;	
		}
	},
	delete_message: async(req, res) => {
		try{
			const user = await res.database.getUser(req.params.username);
			const message_id = req.params.message_id;

			user.messages.map( async(message, index) => {
				if (message.message_id===message_id){
					user.messages.splice(index, 1);
					await user.save();
				}
			})
			return res.send({message: "success"})
		}catch(error){
			res.sendStatus(500);
			return;
		}
	}
}
module.exports = {
	join_waitlist: async(req, res) => {
		const data = req.body;
		const waitlister = await res.database.getWaitlister(data.email);
		if (waitlister) {
			res.status(200).send({message:"exists"})
			return;
		}
		console.log("Waitlister: ", waitlister);
		const new_waitlister = await res.database.newWaitlist(data.email, data.name); 
		res.status(200).send({message:"success"})
		return;
	}
}
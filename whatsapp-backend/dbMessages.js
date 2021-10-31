import mongoose from 'mongoose';

	const whatsappSchema = mongoose.Schema()
	{
		message: String,
		name: String,
		timestamp: String,
		received: Boolean;
	}
	) 

/*add comments
and work on logical reasoning also
improving your coding standards 
*/ 

export default mongoose.model('messagecontents', whatsappSchema);
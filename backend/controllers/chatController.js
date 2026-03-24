const supabase =  require("../utils/supabase")

//create new chat

exports.createChat = async (req, res) => {

    try {
        const userId = req.user.user.id 

        const { data, error } = await supabase
        .from("chats")
        .insert([{ user_id: userId }])
        .select()

        if (error) throw error

        res.json(data[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// get all chats

exports.getChats = async (req, res) => {

    try {
        const userId = req.user.id 
        const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false})

        if (error) throw error

        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
const router = require("../routes/auth");
const supabase = require("../utils/supabase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// REGISTER
exports.register = async (req, res) => {
try {
const { name, email, password } = req.body

if (!name || !email || !password) {
return res.status(400).json({
error: "Name, email and password are required"
})
}

// check if user exists
const { data: existingUser } = await supabase
.from("users")
.select("*")
.eq("email", email)
.single()

if (existingUser) {
return res.status(400).json({
error: "Email already registered"
})
}

// ✅ HASH PASSWORD
const hashedPassword = await bcrypt.hash(password, 10)

// ✅ SAVE WITH PASSWORD
const { data, error } = await supabase
.from("users")
.insert([{
name,
email,
password: hashedPassword
}])
.select()
.single()

if (error) {
return res.status(500).json({
error: error.message
})
}

res.json({
success: true,
message: "User created successfully",
user: data
})

} catch (err) {
res.status(500).json({
error: "Registration failed"
})
}
}


// LOGIN
exports.login = async (req, res) => {
try {
const { email, password } = req.body

if (!email || !password) {
return res.status(400).json({
error: "Email and password required"
})
}

const { data, error } = await supabase
.from("users")
.select("*")
.eq("email", email)
.single()

if (error || !data) {
return res.status(401).json({
error: "User not found"
})
}

// ✅ CHECK PASSWORD
const isMatch = await bcrypt.compare(password, data.password)

if (!isMatch) {
return res.status(401).json({
error: "Invalid credentials"
})
}

// token
const token = jwt.sign(
{ id: data.id, email: data.email },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
)

res.json({
success: true,
message: "Login successful",
token,
user: data
})

} catch (err) {
res.status(500).json({
error: "Login failed"
})
}
}

exports.deleteAccount = async (req, res) => {

    try {

        const { email } = req.body

        const { error } = await supabase
        .from("users")
        .delete()
        .eq("email", email)

        if(error){
            return res.status(500).json({
                error: error.message
            })
        }

        res.json({
            success:true,
            message:"Account deleted"
        })
    } catch(err){
        res.status(500).json({
            error:"Delete failed"
        })
    }
}
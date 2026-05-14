const axios = require('axios');

async function testSignup() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      name: 'Test Member',
      email: 'member@example.com',
      password: 'password123'
    });
    console.log("Signup success:", res.data);
  } catch (error) {
    console.error("Signup failed:", error.response?.data || error.message);
  }
}

testSignup();

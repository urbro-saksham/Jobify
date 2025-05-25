const User = require('../Models/user');

exports.registerUser = async (req, res) => {

  const { name, email, password, phone, title } = req.body;

  try{
    const alreadyExists = await User.findOne({ email });
    if(alreadyExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = new User({
      name: {
        firstname: name.firstname,
        lastname: name.lastname
      },
      email,
      password,
      phone,
      title
    });

    user.password = await user.GenerateHashPassword(password);

    // Save the user to the database
    User.create(user)
      .then((user) => {
        const token = user.GenerateToken();
        if (!token) {
          return res.status(500).json({ message: 'Token generation failed' });
        }

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,      // JavaScript can't access it
            secure: true,        // Only sent over HTTPS
            sameSite: 'Strict',  // Prevent CSRF in most cases
            maxAge: 3600000   // 1h
        });

        // Send the response
        res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            title: user.title
          },
          token
        });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  }
  catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.loginUser = async (req, res) => {

  const {email, password} = req.body;

  try{
    const versify = await User.findOne({ email });

    if (!versify) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await versify.ComparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = versify.GenerateToken();

    if (!token) {
      return res.status(500).json({ message: 'Token generation failed' });
    }

    // Set the token in a cookie
    res.cookie('token', token, {
      httpOnly: true,      // JavaScript can't access it
      secure: true,        // Only sent over HTTPS
      sameSite: 'Strict',  // Prevent CSRF in most cases
      maxAge: 3600000   // 1h
    });

    // Send the response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: versify._id,
        name: versify.name,
        email: versify.email,
        phone: versify.phone,
        title: versify.title
      },
      token
    });
  }
  catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
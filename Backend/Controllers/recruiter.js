const Recruiter = require('../Models/recruiter');

exports.registerRecruiter = async (req, res) => {
  const {name, email, password, companyname, phone} = req.body;

  try{
    const exist = await Recruiter.findOne({ email });

    if(exist) {
      return res.status(400).json({message: 'Email already exists'});
    }

    const data = {
      name: {
        firstname: name.firstname,
        lastname: name.lastname
      },
      email,
      password,
      companyname,
      phone
    }

    data.password = await Recruiter.GeneratePassword(password);

    // Save the user to the database
    Recruiter.create(data)
      .then((data) => {
        const token = data.GenerateToken();
        if (!token) {
          return res.status(500).json({ message: 'Token generation failed' });
        }

        // Set the token in a cookie
        res.cookie('recruitertoken', token, {
            httpOnly: true,      // JavaScript can't access it
            secure: true,        // Only sent over HTTPS
            sameSite: 'Strict',  // Prevent CSRF in most cases
            maxAge: 3600000   // 1h
        });

        // Send the response
        res.status(201).json({
          message: 'Recruiter registered successfully',
          data: {
            id: data._id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            companyname: data.title
          },
          token
        });
      })
      .catch((error) => {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  }
  catch (errors) {
    console.log(errors)
    return res.status(500).json({ message: 'Error Registering Recruiter'});
  }
}

exports.loginRecruiter = async (req, res) => {
  const { email, password } = req.body;

  try {
    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await recruiter.ComparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = recruiter.GenerateToken();

    if (!token) {
      return res.status(500).json({ message: 'Token generation failed' });
    }

    // Set the token in a cookie
    res.cookie('recruitertoken', token, {
      httpOnly: true,      // JavaScript can't access it
      secure: true,        // Only sent over HTTPS
      sameSite: 'Strict',  // Prevent CSRF in most cases
      maxAge: 3600000   // 1h
    });

    // Send the response
    res.status(200).json({
      message: 'Recruiter logged in successfully',
      data: {
        id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        phone: recruiter.phone,
        companyname: recruiter.companyname
      },
      token
    });
  }
  catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
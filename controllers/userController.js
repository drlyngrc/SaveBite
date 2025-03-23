import UserService from "../services/UserService.js";

const userService = new UserService();

export const displayProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userProfile = await userService.displayUserProfile(userId);
    const { name, contact, email } = userProfile;
    res.render("main/profile.ejs", { currentRoute: '/profile', name, contact, email });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFundsToUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { amount } = req.body;

    const message = await userService.addFunds(userId, amount);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { name, email, password, contact } = req.body;

    const message = await userService.updateProfile(
      userId,
      name,
      email,
      password,
      contact,
    );
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

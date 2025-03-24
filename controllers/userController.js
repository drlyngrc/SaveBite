import UserService from "../services/UserService.js";

const userService = new UserService();

export const displayProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const userProfile = await userService.displayUserProfile(userId);
    console.log(userProfile);
    const { name, contact, email, address } = userProfile;
    res.render("main/profile.ejs", {
      currentRoute: "/profile",
      name,
      contact,
      email,
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { email, contact, address } = req.body;

    const message = await userService.updateProfile(
      userId,
      email,
      contact,
      address,
    );

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

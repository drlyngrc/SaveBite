class User {
  constructor(userId, name, email, password, contact) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.password = password;
    this.contact = contact;
    this.createAt = new Date().toISOString();
  }
}

export default User;

class User {
  constructor(userId, name, email, contact, address) {
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.contact = contact;
    this.address = address;
    this.createAt = new Date().toISOString();
  }
}

export default User;

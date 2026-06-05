function UserLogin() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h2>User Login</h2>

        <form>
          <input type="email" placeholder="Enter email" />
          <input type="password" placeholder="Enter password" />
          <button type="submit">Login as User</button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
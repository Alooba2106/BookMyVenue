function OwnerRegister() {
  return (
    <div>
      <h2>Venue Owner Registration</h2>

      <form>
        <input type="text" placeholder="Owner Name" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Phone Number" />
        <input type="password" placeholder="Password" />

        <button type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default OwnerRegister;
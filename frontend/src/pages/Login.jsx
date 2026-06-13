import { useState } from "react";
import { useNavigate } from "react-router-dom";



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogin(event) {
    event.preventDefault();
    console.log("Login button clicked");
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

   fetch("http://127.0.0.1:8000/users/login", {
  method: "POST",
  body: formData,
})
  .then((res) => {
    console.log("Response status:", res.status);
    return res.json();
  })
  .then((data) => {
    console.log("Login response:", data);

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      console.log("Navigating now");
      navigate("/venues");
    } else {
      alert("Login failed");
    }
  });
}
  return (
    <form onSubmit={handleLogin}>
      <h1>User Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
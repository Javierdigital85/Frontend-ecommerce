import { Link } from "react-router";

const AuthButtons = () => {
  return (
    <div className="py-4 flex justify-center items-center gap-4 flex-wrap">
      {/* <p>Categories</p> */}
      <Link className="" to={"/"}>
        Home
      </Link>
      <Link className="" to={"/register"}>
        Create account
      </Link>

      <Link className="" to={"/login"}>
        Login
      </Link>
    </div>
  );
};

export default AuthButtons;

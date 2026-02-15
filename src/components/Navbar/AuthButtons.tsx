import { Link } from "react-router";
import { useTranslation } from "../../hook/useTranslation";

const AuthButtons = () => {
  const { t } = useTranslation();
  return (
    <div className="py-4 flex justify-center items-center gap-4 flex-wrap">
      {/* <p>Categories</p> */}
      <Link className="" to={"/"}>
        {t.home}
      </Link>
      <Link className="" to={"/register"}>
        {t.register}
      </Link>

      <Link className="" to={"/login"}>
        {t.login}
      </Link>
    </div>
  );
};

export default AuthButtons;

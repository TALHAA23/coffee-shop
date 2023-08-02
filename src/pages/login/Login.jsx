import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom";

import { useUpdateUser } from "../../hooks/UserProvider";
import { loginUser } from "../../utils";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (email == "" || password == "")
    return new Error("Complete all the sections");

  try {
    await loginUser({ email, password });
    return email;
  } catch (err) {
    return err;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const actionResponse = useActionData();
  const navigate = useNavigate();

  if (actionResponse && !(actionResponse instanceof Error)) {
    const userSetter = useUpdateUser();
    userSetter(actionResponse);
    navigate("/");
  }

  return (
    <div className="form-wrapper">
      <div className="registration-login">
        <img
          className="form--brandLogo"
          src="/assets/Brandlogo.png"
          alt="branding"
        />

        {actionResponse && navigation.state != "submitting" && (
          <p
            className={
              actionResponse instanceof Error ? "form--error" : "form-success"
            }
          >
            {actionResponse.message}
          </p>
        )}

        {navigation.state == "submitting" && (
          <p className="form--waiting">Verification...</p>
        )}

        <Form className="form" method="post">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Input Your Email" />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Input Your Password"
          />

          <button
            className="form--submit"
            disabled={navigation.state == "submitting" ? true : false}
          >
            Login
          </button>
        </Form>

        <Link to="/registration" className="form--redirect">
          Don't Have any Account? Register
        </Link>
      </div>
    </div>
  );
}

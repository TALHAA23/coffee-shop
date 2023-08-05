import { Form, Link, useActionData, useNavigation } from "react-router-dom";
// import { registerUser } from "../../utils";
import { registerUser } from "../../auth";

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (email == "" || name == "" || password == "")
    return new Error("Complete all the sections");

  try {
    await registerUser({ email, password });
    return redirect("/login");
  } catch (err) {
    return err;
  }

  return null;

  // return registerUser({ name, email, password })
  //   .then((res) => res)
  //   .catch((err) => err);
}

export default function Registration() {
  const navigation = useNavigation();
  const actionResponse = useActionData();

  return (
    <div className="form-wrapper">
      <div className="registration-login">
        <img
          className="form--brandLogo"
          src="/assets/Brandlogo.png"
          alt="branding"
        />

        {actionResponse && (
          <p
            className={
              actionResponse instanceof Error ? "form--error" : "form-success"
            }
          >
            {actionResponse.message}
          </p>
        )}

        {navigation.state == "submitting" && (
          <p className="form--waiting">Working on it...</p>
        )}

        <Form className="form" method="post">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" placeholder="Input Your Name" />
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Input Your Email" />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Input Your Password"
          />

          <small className="form--terms-and-conditions">
            By tapping "Register" you agree to our <a href="#">Terms of Use</a>
            and <a href="#">Privacy Policy</a>
          </small>

          <button
            className="form--submit"
            disabled={navigation.state == "submitting" ? true : false}
          >
            Register
          </button>
        </Form>

        <Link to="/login" className="form--redirect">
          Have an account? Login
        </Link>
      </div>
    </div>
  );
}

import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const UserEmailContext = createContext(undefined);

export const UserEmailProvider = function ({ children }) {
  var [userUid, setUserUid] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUserUid(user ? user.uid : null);
    });
  }, []);

  var value = {
    userUid,
  };
  return (
    <UserEmailContext.Provider value={value}>
      {children}
    </UserEmailContext.Provider>
  );
};

export const useUserUid = function () {
  const context = useContext(UserEmailContext);

  if (context === undefined) {
    throw new Error("useUserUid must be used within a UserEmailProvider");
  }

  return context;
};

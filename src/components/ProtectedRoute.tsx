import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabaseClient";
; // ✅ Make sure this path is correct

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!data?.session) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return children;
};

export default ProtectedRoute;

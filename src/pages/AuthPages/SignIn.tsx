import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Masuk ke Dashboard Admin Reva Baju Anak"
        description="Masuk ke Dashboard Admin Reva Baju Anak"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

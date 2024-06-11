import Header from "./components/shared/header";
import Layout from "./components/shared/layout";
import UserMap from "./components/shared/user-map";

export default function App() {
  return (
    <>
      <Header />
      <Layout>
        <UserMap />
      </Layout>
    </>
  );
}

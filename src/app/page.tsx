import { ToastContainer } from "react-toastify";
import Main from "./containers/main.container";
import Header from "./containers/header.container";
import CardContainer from "./containers/card.container";
import StoreProvider from "./store-provider";
import Footer from "./containers/footer.container";

export default function Home() {
  return (
    <StoreProvider>
      <Header />
      <Main>
        <CardContainer />
      </Main>
      <Footer />
      <ToastContainer />
    </StoreProvider>
  );
}

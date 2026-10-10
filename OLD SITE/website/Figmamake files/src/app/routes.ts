import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/pages/Home";
import { Services } from "./components/pages/Services";
import { Work } from "./components/pages/Work";
import { Pricing } from "./components/pages/Pricing";
import { About } from "./components/pages/About";
import { Contact } from "./components/pages/Contact";
import { Location } from "./components/pages/Location";
import { Brand } from "./components/pages/Brand";
import { BrandBook } from "./components/pages/BrandBook";
import { NotFound } from "./components/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "work", Component: Work },
      { path: "pricing", Component: Pricing },
      { path: "about", Component: About },
      { path: "location", Component: Location },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  // Hidden internal brand book — not linked from public navigation
  { path: "/brand", Component: Brand },
  // External brand book reproduction — direct URL access only
  { path: "/brandbook", Component: BrandBook },
]);

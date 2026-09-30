import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "@/constants/routes";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/HomePage";
import RegisterPage from "@/pages/RegisterPage";
import CategoryPage from "@/pages/CategoryPage";
import LocationPage from "@/pages/LocationPage";
// @ts-expect-error JavaScript component has no declaration file yet.
import Item from "@/pages/Item";
// @ts-expect-error JavaScript component has no declaration file yet.
import TagsPage from "@/pages/TagsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <PageTransition />
    </BrowserRouter>
  );
}

function PageTransition() {
  const location = useLocation();

  return (
    <div key={location.key} className="page-transition">
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route
            path={ROUTES.CATEGORIES}
            element={<CategoryPage></CategoryPage>}
          ></Route>
          <Route
            path={ROUTES.LOCATIONS}
            element={<LocationPage></LocationPage>}
          ></Route>
          <Route path={ROUTES.ITEMS} element={<Item></Item>}></Route>
          <Route path={ROUTES.TAGS} element={<TagsPage></TagsPage>}></Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

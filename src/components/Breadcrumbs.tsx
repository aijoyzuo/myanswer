import { Link, useLocation } from "react-router-dom";

const routeNameMap:Record<string,string> = {
    products: "產品列表",
    product: "產品列表",
    category: "分類",
    cart: "購物車",
    checkout: "結帳",
    services: "服務項目",
    wishlist: "心動清單"
  };

export default function Breadcrumbs():JSX.Element {
  const location = useLocation();
  const pathnames:string[] = location.pathname.split("/").filter((x) => x);

   const isProductDetail =
    pathnames.length === 2 && pathnames[0] === "product";  
  

  return (
    <nav aria-label="breadcrumb" className="my-3">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/">首頁</Link>
        </li>

        {isProductDetail? (
          <>
            <li className="breadcrumb-item">
              <Link to="/products">產品列表</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              產品詳情
            </li>
          </>
        ) : (
          pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNameMap[name] || decodeURIComponent(name);

            return isLast ? (
              <li key={name} className="breadcrumb-item active" aria-current="page">
                {displayName}
              </li>
            ) : (
              <li key={name} className="breadcrumb-item">
                <Link to={routeTo}>{displayName}</Link>
              </li>
            );
          })
        )}
      </ol>
    </nav>
  );
}

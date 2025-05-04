import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import ProductBestSelling from "../../components/ecommerce/ProductBestSelling";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard Admin Reva Baju Anak"
        description="Dashboard Admin Reva Baju Anak"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <ProductBestSelling />
        </div>
      </div>
    </>
  );
}

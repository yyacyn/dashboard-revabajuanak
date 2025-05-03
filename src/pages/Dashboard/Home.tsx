import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
<<<<<<< HEAD
import ProductBestSelling from "../../components/ecommerce/ProductBestSelling";
=======
>>>>>>> 2856799797e71883868567c718f981220b02f1a8

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard Admin Reva Baju Anak"
        description="Dashboard Admin Reva Baju Anak"
      />
<<<<<<< HEAD
      <div className="grid grid-cols-3 gap-4 md:gap-6">
=======
      <div className="grid grid-cols-12 gap-4 md:gap-6">
>>>>>>> 2856799797e71883868567c718f981220b02f1a8
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

<<<<<<< HEAD



        <div className="col-span-12 xl:col-span-7">
          <ProductBestSelling />
=======
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
>>>>>>> 2856799797e71883868567c718f981220b02f1a8
        </div>
      </div>
    </>
  );
}

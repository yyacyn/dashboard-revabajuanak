import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
// import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import OrderTable from "../../components/tables/BasicTables/OrdersTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Order"
        description="yep"
      />
      <PageBreadcrumb pageTitle="Order" />
      <div className="space-y-6">
        <OrderTable />
      </div>
    </>
  );
}

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
// import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
// import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import ProductTable from "../../components/tables/BasicTables/ProductsTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta
        title="Tabel Produk"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Tabel Produk" />
      <div className="space-y-6">
        <ProductTable />
      </div>
    </>
  );
}

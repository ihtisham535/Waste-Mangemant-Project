import { Link } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Button from "../../components/Button/Button.jsx";
import Card from "../../components/Card/Card.jsx";
import Table from "../../components/Table/Table.jsx";
import "./ShopkeeperDashboard.css";

const summaryCards = [
  { label: "Today scans", value: "152", meta: "Last 12 hours" },
  { label: "Rewards issued", value: "$610", meta: "Auto-approved" },
  { label: "Low stock", value: "3 items", meta: "Needs restock" },
];

const items = [
  {
    id: "IT-903",
    name: "Citrus quinoa bowl",
    category: "Prepared foods",
    quantity: 24,
    discount: "Active",
    price: "$9.20",
  },
  {
    id: "IT-887",
    name: "Sunrise cold brew",
    category: "Beverages",
    quantity: 9,
    discount: "Limited",
    price: "$4.80",
  },
  {
    id: "IT-864",
    name: "Herb roasted sandwich",
    category: "Deli",
    quantity: 31,
    discount: "Active",
    price: "$7.50",
  },
  {
    id: "IT-842",
    name: "Market garden salad",
    category: "Prepared foods",
    quantity: 12,
    discount: "Paused",
    price: "$6.75",
  },
];

const columns = [
  {
    key: "name",
    label: "Item",
    render: (row) => (
      <div>
        <p className="shop-item-title">{row.name}</p>
        <p className="fwrs-muted">{row.category}</p>
      </div>
    ),
  },
  { key: "quantity", label: "Quantity", align: "right" },
  {
    key: "discount",
    label: "Discount status",
    render: (row) => (
      <span
        className={`fwrs-badge ${row.discount === "Active" ? "success" : row.discount === "Limited" ? "warning" : "info"}`}
      >
        {row.discount}
      </span>
    ),
  },
  { key: "price", label: "Price", align: "right" },
];

const ShopkeeperDashboard = () => (
  <div className="fwrs-app">
    <Header />
    <div className="fwrs-body">
      <Sidebar role="Shopkeeper" />
      <main className="fwrs-main shop-dashboard">
        <section className="shop-header fwrs-fade-in">
          <div>
            <span className="fwrs-chip">Shopkeeper view</span>
            <h1 className="shop-title">Store performance overview</h1>
            <p className="shop-subtitle">
              Track item availability, discounts, and redemption velocity in one focused workspace.
            </p>
          </div>
          <div className="shop-actions">
            <Link to="/items/new">
              <Button>Add item</Button>
            </Link>
            <Link to="/items/edit">
              <Button variant="ghost">Edit items</Button>
            </Link>
          </div>
        </section>

        <Alert variant="info" title="Inventory alert">
          Three items are below the preferred stock threshold. Consider restocking before peak hours.
        </Alert>

        <section className="shop-metrics">
          {summaryCards.map((card) => (
            <Card key={card.label} className="shop-metric-card">
              <p className="shop-metric-label">{card.label}</p>
              <p className="shop-metric-value">{card.value}</p>
              <p className="fwrs-muted">{card.meta}</p>
            </Card>
          ))}
        </section>

        <Card className="shop-table-card">
          <div className="shop-table-head">
            <div>
              <h2 className="fwrs-section-title">Item availability</h2>
              <p className="fwrs-muted">Quantity and discount status per active item.</p>
            </div>
            <Button variant="secondary" size="sm">
              Sync stock
            </Button>
          </div>
          <Table columns={columns} data={items} />
        </Card>
      </main>
    </div>
    <Footer />
  </div>
);

export default ShopkeeperDashboard;

"use client";

import SubscriptionsTable from "./subscriptions-table";

export default function DashboardSection() {
  return (
    <section className="section">
      <div className="wrapper">
        <div>
          <SubscriptionsTable />
        </div>
      </div>
    </section>
  );
}

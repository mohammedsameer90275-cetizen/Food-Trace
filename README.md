# FoodTrace Django Launch Ready

FoodTrace is packaged as a local React + Django application. No Docker is required.

## Start The App

Double-click:

```bat
START_FOODTRACE.cmd
```

The launcher will:

- create a Python virtual environment in `backend\.venv`
- install Django backend dependencies
- run SQLite migrations
- seed 20 fruit and vegetable catalog records
- start Django at `http://127.0.0.1:8000`
- install React dependencies if needed
- start Vite at `http://127.0.0.1:5173`
- open the app in the browser

Default admin:

```text
username: admin
password: Admin@123
```

Premium demo accounts:

```text
demo_admin / Demo@123
demo_farmer / Demo@123
demo_distributor / Demo@123
demo_retailer / Demo@123
demo_consumer / Demo@123
```

For the strongest college demo:

1. Start the app with `START_FOODTRACE.cmd`.
2. Log in as `admin / Admin@123`.
3. Open the Admin Dashboard.
4. Click `Seed Premium Demo`.
5. Show the Project Summary, Dataset, Tracking, QR Product Certificate, Distributor, Retailer, and Consumer dashboards.

## Requirements

- Python 3.11 or newer
- Node.js LTS
- Windows 10 or newer

## Notes

- The backend is Django REST Framework with SQLite and SimpleJWT.
- Product IDs and batch IDs are generated automatically.
- Freshness score and status are calculated automatically from harvest and expiry dates.
- Farmers can set or edit harvest date, but cannot manually set product status.
- Product QR codes open `/product/{product_id}`.
- The premium demo button creates realistic users, products, inventory, tracking history, and notifications.
- Product uploads use Django file storage, so the backend does not require Pillow or native image build tools.
- The zip does not include old user/product data. A fresh SQLite database is created when the launcher runs.

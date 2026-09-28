import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import engine, Base
from app.models.user import Admin
from app.models.account import Account
from app.models.trade import Order, Requirement, Offer, Auction
from app.models.logistics import Trip, Settlement
from app.models.system import Case, Report, AuditLog
from app.core.security import get_password_hash
from datetime import datetime, timedelta

async def seed_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine) as db:
        # Admins
        super_admin = Admin(id="ADM-9021", name="Ops Lead", email="ops@bixoo.com", password_hash=get_password_hash("password"), role="SUPER_ADMIN", is_active=True)
        standard_admin = Admin(id="ADM-8804", name="Verification Rep", email="admin@bixoo.com", password_hash=get_password_hash("password"), role="ADMIN", is_active=True)
        db.add_all([super_admin, standard_admin])

        # Accounts
        accounts = [
            Account(id="USR-3301", entity_type="BUYER", business_name="Acme Corp Ltd", contact_number="+91 9876543210", email="contact@acmecorp.in", gstin="29ABCD1234F1Z5", registration_number="CIN-U12345KA2023PTC123", address="123 Tech Park, Bangalore", fleet_docs_status="N/A", verification_status="UNVERIFIED"),
            Account(id="USR-4410", entity_type="SELLER", business_name="Global Steel Traders", contact_number="+91 9988776655", email="sales@globalsteel.in", gstin="27XYZD9876F1Z9", registration_number="CIN-U98765MH2021PTC987", address="45 Industrial Estate, Mumbai", fleet_docs_status="N/A", verification_status="VERIFIED"),
            Account(id="USR-7811", entity_type="TRANSPORTER", business_name="FastTrack Logistics", contact_number="+91 8877665544", email="ops@fasttrack.in", gstin="33PQRS4567F1Z2", registration_number="CIN-U55555TN2019PTC555", address="78 Transport Nagar, Chennai", fleet_docs_status="VERIFIED", verification_status="VERIFIED"),
            Account(id="USR-9922", entity_type="SELLER", business_name="Fraudulent Supplies", contact_number="+91 7766554433", email="scam@fraud.in", gstin="07FAKE0000F1Z0", registration_number="CIN-U00000DL2024PTC000", address="Unknown, Delhi", fleet_docs_status="N/A", verification_status="SUSPENDED"),
            Account(id="USR-1102", entity_type="BUYER", business_name="BuildTech Constructors", contact_number="+91 9123456780", email="procurement@buildtech.in", gstin="06MNPQ1111F1Z1", registration_number="CIN-U11111HR2020PTC111", address="Phase 2, Gurugram", fleet_docs_status="N/A", verification_status="VERIFIED"),
            Account(id="USR-2204", entity_type="TRANSPORTER", business_name="Reliable Movers", contact_number="+91 8123456789", email="support@reliablemovers.in", gstin="24ABCD9999F1Z3", registration_number="CIN-U22222GJ2018PTC222", address="GIDC, Ahmedabad", fleet_docs_status="PENDING", verification_status="UNVERIFIED"),
            Account(id="USR-5509", entity_type="SELLER", business_name="Sunrise Materials", contact_number="+91 9888877777", email="hello@sunrisematerials.in", gstin="32GHJK8888F1Z4", registration_number="CIN-U33333KL2022PTC333", address="Industrial Park, Kochi", fleet_docs_status="N/A", verification_status="VERIFIED"),
            Account(id="USR-6601", entity_type="BUYER", business_name="NextGen Infra", contact_number="+91 9000011111", email="info@nextgeninfra.in", gstin="36WXYZ2222F1Z5", registration_number="CIN-U44444TS2021PTC444", address="HITEC City, Hyderabad", fleet_docs_status="N/A", verification_status="SUSPENDED"),
        ]
        db.add_all(accounts)

        # Requirements & Offers
        req1 = Requirement(id="REQ-7001", buyer_id="USR-3301", product="TMT Bars 12mm FE500", total_requested=100.0, unit="Tons", remaining_qty=40.0, status="MATCHING", is_flagged=False)
        req2 = Requirement(id="REQ-7002", buyer_id="USR-1102", product="Cement OPC 53 Grade", total_requested=500.0, unit="Bags", remaining_qty=500.0, status="MATCHING", is_flagged=True)
        req3 = Requirement(id="REQ-7003", buyer_id="USR-3301", product="Silica Sand", total_requested=250.0, unit="Tons", remaining_qty=0.0, status="CLOSED", is_flagged=False)
        req4 = Requirement(id="REQ-7004", buyer_id="USR-1102", product="Teak Wood Logs", total_requested=50.0, unit="CBM", remaining_qty=35.0, status="PAUSED", is_flagged=False)
        db.add_all([req1, req2, req3, req4])
        
        ord1 = Order(id="ORD-9901", buyer_id="USR-3301", seller_id="USR-4410", source_type="REQUIREMENT", source_ref="REQ-7001", agreed_qty="60.0", total_value="3300000", status="CONFIRMED")
        ord2 = Order(id="ORD-9902", buyer_id="USR-1102", seller_id="USR-5509", source_type="AUCTION", source_ref="AUC-5501", agreed_qty="150.0", total_value="800000", status="CONFIRMED")
        ord3 = Order(id="ORD-9903", buyer_id="USR-3301", seller_id="USR-5509", source_type="REQUIREMENT", source_ref="REQ-7003", agreed_qty="250.0", total_value="250000", status="CONFIRMED")
        db.add_all([ord1, ord2, ord3])

        # Offers mapped to Requirements
        off1 = Offer(id="OFF-8001", requirement_id="REQ-7001", buyer_id="USR-3301", seller_id="USR-4410", offered_qty="60.0", latest_price="55000", status="ACCEPTED", linked_order_id="ORD-9901")
        off2 = Offer(id="OFF-8002", requirement_id="REQ-7001", buyer_id="USR-3301", seller_id="USR-5509", offered_qty="40.0", latest_price="56000", status="NEGOTIATING", linked_order_id=None)
        off3 = Offer(id="OFF-8003", requirement_id="REQ-7002", buyer_id="USR-1102", seller_id="USR-4410", offered_qty="500.0", latest_price="390", status="PENDING", linked_order_id=None)
        db.add_all([off1, off2, off3])

        # Trips
        trip1 = Trip(
            id="TRP-1011",
            order_id="ORD-9901",
            transporter="FastTrack Logistics (USR-7811)",
            route="Mumbai -> Bangalore",
            current_milestone="IN_TRANSIT",
            gps_last_seen="2 mins ago",
            is_gps_stale=False,
            consignee_proof_submitted=False
        )
        trip2 = Trip(
            id="TRP-1012",
            order_id="ORD-9902",
            transporter="Reliable Movers (USR-2204)",
            route="Kochi -> Gurugram",
            current_milestone="PICKUP",
            gps_last_seen="1 hour ago",
            is_gps_stale=True,
            consignee_proof_submitted=False
        )
        trip3 = Trip(
            id="TRP-1013",
            order_id="ORD-9903",
            transporter="FastTrack Logistics (USR-7811)",
            route="Kochi -> Bangalore",
            current_milestone="DELIVERED",
            gps_last_seen="1 day ago",
            is_gps_stale=False,
            consignee_proof_submitted=True
        )
        db.add_all([trip1, trip2, trip3])

        # Settlements
        set1 = Settlement(
            id="SET-9001",
            trip_id="TRP-1013",
            payee="FastTrack Logistics (USR-7811)",
            amount="₹ 45,000",
            proof_status="EPOD_VERIFIED",
            settlement_status="PENDING_CLEARANCE",
            bank_ref_masked="XXXX-XXXX-9012"
        )
        set2 = Settlement(
            id="SET-9002",
            trip_id="TRP-1011",
            payee="FastTrack Logistics (USR-7811)",
            amount="₹ 1,10,000",
            proof_status="PENDING_EPOD",
            settlement_status="PENDING_EPOD",
            bank_ref_masked="XXXX-XXXX-9012"
        )
        db.add_all([set1, set2])

        
        # Cases
        case1 = Case(
            id="CAS-5001",
            type="PAYMENT_DISPUTE",
            linked_entity="SET-9002",
            reporter_id="USR-7811",
            status="OPEN",
            sla="48h",
            evidence_attached=True
        )
        case2 = Case(
            id="CAS-5002",
            type="QUALITY_ISSUE",
            linked_entity="ORD-9901",
            reporter_id="USR-3301",
            status="INVESTIGATING",
            sla="24h",
            evidence_attached=True
        )
        case3 = Case(
            id="CAS-5003",
            type="DELIVERY_DELAY",
            linked_entity="TRP-1012",
            reporter_id="USR-1102",
            status="RESOLVED",
            sla="12h",
            evidence_attached=False
        )
        db.add_all([case1, case2, case3])

        await db.commit()

if __name__ == "__main__":
    asyncio.run(seed_data())

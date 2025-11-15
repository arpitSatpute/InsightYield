"""
Debug script to check database state and diagnose issues
"""

import os
from pymongo import MongoClient
from datetime import datetime, timedelta
from dotenv import load_dotenv
from tabulate import tabulate

load_dotenv()

def debug_database():
    # Connect to MongoDB
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
    db_name = os.getenv('MONGO_DB', 'defi_strategies')
    
    print(f"🔌 Connecting to MongoDB...")
    print(f"   URI: {mongo_uri}")
    print(f"   Database: {db_name}")
    
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test connection
        client.admin.command('ping')
        print("✅ Connected successfully!\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return
    
    db = client[db_name]
    
    # Check collections
    print("📚 Collections in database:")
    collections = db.list_collection_names()
    if collections:
        for col in collections:
            count = db[col].count_documents({})
            print(f"   - {col}: {count} documents")
    else:
        print("   (none)")
    print()
    
    # Check strategies
    print("=" * 70)
    print("🎯 STRATEGIES")
    print("=" * 70)
    
    total_strategies = db['strategies'].count_documents({})
    active_strategies = db['strategies'].count_documents({'active': True})
    inactive_strategies = db['strategies'].count_documents({'active': False})
    
    print(f"Total strategies: {total_strategies}")
    print(f"Active: {active_strategies} | Inactive: {inactive_strategies}\n")
    
    if total_strategies > 0:
        strategies = list(db['strategies'].find().sort('index', 1))
        
        table_data = []
        for s in strategies:
            table_data.append([
                s.get('index', 'N/A'),
                s.get('name', 'N/A')[:30],
                s.get('address', 'N/A')[:20] + '...',
                '✓' if s.get('active') else '✗',
                f"{s.get('allocation', 0)/100:.1f}%"
            ])
        
        print(tabulate(
            table_data,
            headers=['Index', 'Name', 'Address', 'Active', 'Allocation'],
            tablefmt='grid'
        ))
    else:
        print("❌ No strategies found in database!")
    
    print()
    
    # Check performance data
    print("=" * 70)
    print("📊 PERFORMANCE DATA")
    print("=" * 70)
    
    total_performance = db['performance'].count_documents({})
    print(f"Total performance records: {total_performance}\n")
    
    if total_performance > 0:
        # Check per strategy
        active_strats = list(db['strategies'].find({'active': True}))
        
        if active_strats:
            table_data = []
            cutoff_30d = datetime.now() - timedelta(days=30)
            cutoff_7d = datetime.now() - timedelta(days=7)
            
            for strategy in active_strats:
                addr = strategy['address']
                
                total = db['performance'].count_documents({'strategy_address': addr})
                last_30d = db['performance'].count_documents({
                    'strategy_address': addr,
                    'timestamp': {'$gte': cutoff_30d}
                })
                last_7d = db['performance'].count_documents({
                    'strategy_address': addr,
                    'timestamp': {'$gte': cutoff_7d}
                })
                
                # Get latest record
                latest = db['performance'].find_one(
                    {'strategy_address': addr},
                    sort=[('timestamp', -1)]
                )
                
                latest_date = latest['timestamp'].strftime('%Y-%m-%d') if latest else 'N/A'
                status = '✅' if last_30d >= 10 else '❌'
                
                table_data.append([
                    strategy.get('index', 'N/A'),
                    strategy.get('name', 'N/A')[:25],
                    total,
                    last_30d,
                    last_7d,
                    latest_date,
                    status
                ])
            
            print(tabulate(
                table_data,
                headers=['Index', 'Strategy', 'Total', 'Last 30d', 'Last 7d', 'Latest', 'Ready?'],
                tablefmt='grid'
            ))
            
            print("\n📋 Requirements for predict_and_sign.py:")
            print("   - Need ≥10 records in last 30 days per strategy")
            print("   - Need at least 1 active strategy")
            
            ready_count = sum(1 for row in table_data if row[-1] == '✅')
            print(f"\n   {ready_count}/{len(active_strats)} strategies are ready")
            
        else:
            print("❌ No active strategies found!")
    else:
        print("❌ No performance data found!")
    
    print()
    
    # Check recommendations
    print("=" * 70)
    print("📝 RECOMMENDATIONS")
    print("=" * 70)
    
    total_recs = db['recommendations'].count_documents({})
    pending_recs = db['recommendations'].count_documents({'status': 'pending'})
    submitted_recs = db['recommendations'].count_documents({'submitted': True})
    
    print(f"Total: {total_recs} | Pending: {pending_recs} | Submitted: {submitted_recs}")
    
    if total_recs > 0:
        recent = list(db['recommendations'].find().sort('timestamp', -1).limit(5))
        
        table_data = []
        for rec in recent:
            table_data.append([
                rec['timestamp'].strftime('%Y-%m-%d %H:%M'),
                rec.get('signer', 'N/A')[:15] + '...',
                rec.get('status', 'N/A'),
                '✓' if rec.get('submitted') else '✗',
                rec.get('signature', 'N/A')[:20] + '...'
            ])
        
        print("\nRecent recommendations:")
        print(tabulate(
            table_data,
            headers=['Timestamp', 'Signer', 'Status', 'Submitted', 'Signature'],
            tablefmt='grid'
        ))
    
    print()
    
    # Final diagnosis
    print("=" * 70)
    print("🔍 DIAGNOSIS")
    print("=" * 70)
    
    issues = []
    
    if total_strategies == 0:
        issues.append("No strategies in database")
    elif active_strategies == 0:
        issues.append("No active strategies (all marked as inactive)")
    
    if total_performance == 0:
        issues.append("No performance data in database")
    elif active_strategies > 0:
        ready = 0
        for strategy in db['strategies'].find({'active': True}):
            count = db['performance'].count_documents({
                'strategy_address': strategy['address'],
                'timestamp': {'$gte': datetime.now() - timedelta(days=30)}
            })
            if count >= 10:
                ready += 1
        
        if ready == 0:
            issues.append("No strategies have enough recent performance data (need ≥10 records)")
    
    if issues:
        print("❌ Issues found:")
        for i, issue in enumerate(issues, 1):
            print(f"   {i}. {issue}")
        
        print("\n💡 Solution:")
        print("   Run: python setup_database.py")
        print("   This will create test data for development")
    else:
        print("✅ Database looks good!")
        print("   You should be able to run predict_and_sign.py successfully")
    
    print("=" * 70)


if __name__ == "__main__":
    try:
        debug_database()
    except Exception as e:
        print(f"\n❌ Error during debug: {e}")
        import traceback
        traceback.print_exc()
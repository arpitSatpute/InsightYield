"""
Setup MongoDB database with test strategies and performance data
Run this before predict_and_sign.py
"""

import os
from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import numpy as np
from dotenv import load_dotenv

load_dotenv()

class DatabaseSetup:
    def __init__(self):
        mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://arpitsatpute3964_db_user:arpits_15@cluster0.z2r371s.mongodb.net/?appName=Cluster0')
        db_name = os.getenv('MONGO_DB', 'defi_strategies')
        
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        
        print(f"Connected to MongoDB: {db_name}")
    
    def check_existing_data(self):
        """Check what data already exists"""
        strategies_count = self.db['strategies'].count_documents({})
        active_strategies = self.db['strategies'].count_documents({'active': True})
        performance_count = self.db['performance'].count_documents({})
        
        print("\n📊 Current Database State:")
        print(f"  Total strategies: {strategies_count}")
        print(f"  Active strategies: {active_strategies}")
        print(f"  Performance records: {performance_count}")
        
        return {
            'strategies': strategies_count,
            'active': active_strategies,
            'performance': performance_count
        }
    
    def create_test_strategies(self, num_strategies=4, clear_existing=False):
        """Create test strategies"""
        if clear_existing:
            self.db['strategies'].delete_many({})
            print("\n🗑️  Cleared existing strategies")
        
        # Sample strategy addresses (replace with your actual contract addresses)
        strategies = [
            {
                'index': 0,
                'address': '0x1234567890123456789012345678901234567890',
                'name': 'Conservative Yield Strategy',
                'protocol': 'Compound',
                'active': True,
                'allocation': 2500,
                'risk_level': 'low',
                'created_at': datetime.now() - timedelta(days=90)
            },
            {
                'index': 1,
                'address': '0x2345678901234567890123456789012345678901',
                'name': 'Balanced DeFi Strategy',
                'protocol': 'Aave',
                'active': True,
                'allocation': 2500,
                'risk_level': 'medium',
                'created_at': datetime.now() - timedelta(days=85)
            },
            {
                'index': 2,
                'address': '0x3456789012345678901234567890123456789012',
                'name': 'Aggressive Growth Strategy',
                'protocol': 'Curve',
                'active': True,
                'allocation': 2500,
                'risk_level': 'high',
                'created_at': datetime.now() - timedelta(days=80)
            },
            {
                'index': 3,
                'address': '0x4567890123456789012345678901234567890123',
                'name': 'Stable Farming Strategy',
                'protocol': 'Yearn',
                'active': True,
                'allocation': 2500,
                'risk_level': 'low',
                'created_at': datetime.now() - timedelta(days=75)
            }
        ]
        
        # Only use requested number
        strategies = strategies[:num_strategies]
        
        result = self.db['strategies'].insert_many(strategies)
        print(f"\n✅ Created {len(result.inserted_ids)} test strategies")
        
        return strategies
    
    def generate_performance_data(self, strategy, days=35, volatility='medium'):
        """Generate realistic performance data for a strategy"""
        
        # Set parameters based on volatility
        params = {
            'low': {'daily_return': 0.0003, 'daily_volatility': 0.005, 'trend': 0.0001},
            'medium': {'daily_return': 0.0008, 'daily_volatility': 0.015, 'trend': 0.0002},
            'high': {'daily_return': 0.0015, 'daily_volatility': 0.030, 'trend': 0.0005}
        }
        
        risk_level = strategy.get('risk_level', 'medium')
        p = params.get(risk_level, params['medium'])
        
        performance_data = []
        base_value = random.uniform(95000, 105000)  # Starting TVL
        
        for i in range(days):
            timestamp = datetime.now() - timedelta(days=days-i-1)
            
            # Generate realistic price movement
            daily_return = np.random.normal(p['daily_return'], p['daily_volatility'])
            trend_component = p['trend'] * (i / days)  # Slight upward trend
            
            base_value = base_value * (1 + daily_return + trend_component)
            
            # Add some market events (occasional spikes/dips)
            if random.random() < 0.05:  # 5% chance of event
                event_impact = random.choice([-0.03, 0.04])  # -3% or +4%
                base_value = base_value * (1 + event_impact)
            
            # Calculate APY (annualized)
            apy = (daily_return + trend_component) * 365
            
            performance_data.append({
                'strategy_address': strategy['address'],
                'timestamp': timestamp,
                'total_value': max(base_value, 10000),  # Prevent negative values
                'apy': max(apy, 0),  # Prevent negative APY
                'volume_24h': random.uniform(50000, 200000),
                'users': random.randint(100, 1000)
            })
        
        return performance_data
    
    def populate_performance_data(self, strategies, days=35, clear_existing=False):
        """Populate performance data for all strategies"""
        if clear_existing:
            self.db['performance'].delete_many({})
            print("\n🗑️  Cleared existing performance data")
        
        total_records = 0
        
        for strategy in strategies:
            performance_data = self.generate_performance_data(strategy, days)
            self.db['performance'].insert_many(performance_data)
            total_records += len(performance_data)
            print(f"  Added {len(performance_data)} records for Strategy {strategy['index']}")
        
        print(f"\n✅ Total performance records created: {total_records}")
    
    def verify_setup(self):
        """Verify that data meets requirements for predict_and_sign.py"""
        print("\n🔍 Verifying Setup...")
        
        strategies = list(self.db['strategies'].find({'active': True}))
        
        if len(strategies) == 0:
            print("❌ No active strategies found!")
            return False
        
        all_valid = True
        for strategy in strategies:
            count = self.db['performance'].count_documents({
                'strategy_address': strategy['address'],
                'timestamp': {'$gte': datetime.now() - timedelta(days=30)}
            })
            
            status = "✅" if count >= 10 else "❌"
            print(f"{status} Strategy {strategy['index']}: {count} records (need ≥10)")
            
            if count < 10:
                all_valid = False
        
        if all_valid:
            print("\n🎉 Database is ready for predict_and_sign.py!")
        else:
            print("\n⚠️  Some strategies don't have enough data")
        
        return all_valid
    
    def create_indexes(self):
        """Create database indexes for better performance"""
        print("\n📑 Creating indexes...")
        
        # Strategies indexes
        self.db['strategies'].create_index([('address', 1)])
        self.db['strategies'].create_index([('active', 1)])
        self.db['strategies'].create_index([('index', 1)])
        
        # Performance indexes
        self.db['performance'].create_index([('strategy_address', 1)])
        self.db['performance'].create_index([('timestamp', -1)])
        self.db['performance'].create_index([
            ('strategy_address', 1),
            ('timestamp', -1)
        ])
        
        print("✅ Indexes created")
    
    def cleanup(self):
        """Remove all test data"""
        result1 = self.db['strategies'].delete_many({})
        result2 = self.db['performance'].delete_many({})
        result3 = self.db['recommendations'].delete_many({})
        result4 = self.db['agent_nonces'].delete_many({})
        
        print(f"\n🗑️  Cleanup complete:")
        print(f"  Deleted {result1.deleted_count} strategies")
        print(f"  Deleted {result2.deleted_count} performance records")
        print(f"  Deleted {result3.deleted_count} recommendations")
        print(f"  Deleted {result4.deleted_count} nonces")


def main():
    print("🚀 InsightYield Database Setup")
    print("=" * 60)
    
    setup = DatabaseSetup()
    
    # Check existing data
    existing = setup.check_existing_data()
    
    # Ask user what to do
    if existing['strategies'] > 0 or existing['performance'] > 0:
        print("\n⚠️  Database already has data!")
        response = input("Clear and recreate? (yes/no): ").lower()
        clear = response == 'yes'
    else:
        clear = False
    
    # Create test data
    print("\n📝 Creating test data...")
    strategies = setup.create_test_strategies(num_strategies=4, clear_existing=clear)
    setup.populate_performance_data(strategies, days=35, clear_existing=clear)
    
    # Create indexes
    setup.create_indexes()
    
    # Verify
    setup.verify_setup()
    
    print("\n" + "=" * 60)
    print("✅ Setup complete! You can now run predict_and_sign.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
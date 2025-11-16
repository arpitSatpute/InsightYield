"""
Utility script to sync MongoDB nonces with blockchain
Run this if you get nonce mismatch errors
"""

import os
from pymongo import MongoClient
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

def sync_nonces():
    print("🔄 Nonce Synchronization Utility")
    print("=" * 60)
    
    # Connect to MongoDB
    mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017')
    db_name = os.getenv('MONGO_DB', 'defi_strategies')
    
    client = MongoClient(mongo_uri)
    db = client[db_name]
    print(f"✅ Connected to MongoDB: {db_name}")
    
    # Connect to blockchain
    rpc_url = os.getenv('RPC_URL')
    w3 = Web3(Web3.HTTPProvider(rpc_url))
    
    if not w3.is_connected():
        print("❌ Failed to connect to blockchain")
        return
    
    print(f"✅ Connected to blockchain: {w3.eth.chain_id}")
    
    # Get agent address
    private_key = os.getenv('PRIVATE_KEY')
    account = Account.from_key(private_key)
    agent_address = account.address
    
    print(f"\n📋 Agent address: {agent_address}")
    
    # Setup contract
    contract_address = os.getenv('STRATEGY_MANAGER_ADDRESS')
    contract_abi = [
        {
            "inputs": [{"internalType": "address", "name": "agent", "type": "address"}],
            "name": "getAgentNonce",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    
    contract = w3.eth.contract(
        address=Web3.to_checksum_address(contract_address),
        abi=contract_abi
    )
    
    # Get on-chain nonce
    print("\n🔍 Checking nonces...")
    try:
        onchain_nonce = contract.functions.getAgentNonce(agent_address).call()
        print(f"   Blockchain nonce: {onchain_nonce}")
    except Exception as e:
        print(f"❌ Error reading blockchain nonce: {e}")
        return
    
    # Get MongoDB nonce
    nonces_col = db['agent_nonces']
    mongo_doc = nonces_col.find_one({'agent': agent_address})
    
    if mongo_doc:
        mongo_nonce = mongo_doc['nonce']
        print(f"   MongoDB nonce:    {mongo_nonce}")
    else:
        mongo_nonce = None
        print(f"   MongoDB nonce:    (not set)")
    
    # Check if sync needed
    if mongo_nonce == onchain_nonce:
        print("\n✅ Nonces are already in sync!")
        return
    
    print(f"\n⚠️  Nonces are OUT OF SYNC!")
    print(f"   Difference: {abs((mongo_nonce or 0) - onchain_nonce)}")
    
    # Sync to blockchain value
    print(f"\n🔧 Syncing MongoDB to blockchain value ({onchain_nonce})...")
    
    from datetime import datetime
    nonces_col.update_one(
        {'agent': agent_address},
        {
            '$set': {
                'nonce': onchain_nonce,
                'synced_at': datetime.now(),
                'source': 'blockchain'
            }
        },
        upsert=True
    )
    
    print("✅ MongoDB nonce updated!")
    
    # Update any pending recommendations with wrong nonce
    print("\n🔄 Checking pending recommendations...")
    recommendations_col = db['recommendations']
    
    wrong_nonce_recs = recommendations_col.find({
        'status': 'pending',
        'recommendation.nonce': {'$ne': onchain_nonce}
    })
    
    count = 0
    for rec in wrong_nonce_recs:
        old_nonce = rec['recommendation']['nonce']
        print(f"   Updating recommendation {rec['_id']}: nonce {old_nonce} → {onchain_nonce}")
        
        recommendations_col.update_one(
            {'_id': rec['_id']},
            {
                '$set': {
                    'status': 'expired',
                    'reason': f'Nonce mismatch (had {old_nonce}, blockchain is {onchain_nonce})',
                    'expired_at': datetime.now()
                }
            }
        )
        count += 1
    
    if count > 0:
        print(f"\n⚠️  Marked {count} recommendations as expired due to wrong nonce")
        print("   Run predict_and_sign.py to create new recommendations")
    else:
        print("\n✅ No pending recommendations with wrong nonce")
    
    print("\n" + "=" * 60)
    print("✅ Nonce synchronization complete!")
    print(f"   Current nonce: {onchain_nonce}")
    print(f"   Next prediction will use nonce: {onchain_nonce}")
    print("=" * 60)
    
    client.close()


if __name__ == "__main__":
    sync_nonces()